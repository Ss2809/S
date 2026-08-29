/* ==========================================================================
   Live Emergency Tracking page.
   Integrated with Node.js + Express + MongoDB backend (/api/sos & /api/locations).
   Provides real-time tracking of active SOS requests, live GPS positions,
   assigned volunteers, and medical center locations on the Leaflet map.
   ========================================================================== */

const TRACK_API_BASE = 'http://localhost:5000/api';
let trackMap = null;
let trackVanMarker = null;
let trackVarkariMarker = null;
let trackMedMarker = null;
let trackInterval = null;
let liveEmergencyRequests = [];
let liveVolunteerLocations = [];
let currentSelectedSosId = null;
let initialMapFitDone = false;

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, function (char) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char];
  });
}

function formatRelativeTime(dateValue) {
  if (!dateValue) return 'Just now';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return String(dateValue);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.max(0, Math.floor(diffMs / 60000));
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  return date.toLocaleDateString();
}

function formatTimestamp(dateValue) {
  if (!dateValue) return 'Live';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return String(dateValue);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function trackNearestMedicalCenter(lat, lng) {
  if (!Array.isArray(MEDICAL_CENTERS) || MEDICAL_CENTERS.length === 0) {
    return { name: "Nearest Health Post", address: "Route Medical Camp", lat: 18.2802, lng: 74.1580 };
  }
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return MEDICAL_CENTERS[0];

  let nearest = MEDICAL_CENTERS[0];
  let minDistance = Infinity;
  MEDICAL_CENTERS.forEach(m => {
    const dLat = m.lat - lat;
    const dLng = m.lng - lng;
    const dist = dLat * dLat + dLng * dLng;
    if (dist < minDistance) {
      minDistance = dist;
      nearest = m;
    }
  });
  return nearest;
}

function trackDivIcon(emoji, color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:32px;height:32px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 0 3px ${color}55;display:flex;align-items:center;justify-content:center;font-size:16px;">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
}

function trackRenderDetails(req, van) {
  const detailsContainer = document.getElementById('trackDetails');
  if (!detailsContainer) return;

  if (!req) {
    detailsContainer.innerHTML = `
      <div class="col-12 text-center text-muted py-3">
        <i class="bi bi-shield-check fs-4 d-block mb-1" style="color:var(--emerald);"></i>
        No active emergency selected. All systems normal.
      </div>`;
    return;
  }

  const badgeClass = typeof emStatusBadgeClass === 'function'
    ? emStatusBadgeClass(req.status)
    : 'badge-info';

  const vanNumber = van && van.number ? van.number : (req.van || (req.assignedVolunteerName ? 'AMB-004' : '—'));

  detailsContainer.innerHTML = `
    <div class="col-6 col-md-3"><div class="small text-muted">Varkari</div><div class="fw-semibold">${escapeHtml(req.varkariName)} <span class="text-muted small">(${escapeHtml(req.varkariId)})</span></div></div>
    <div class="col-6 col-md-3"><div class="small text-muted">Emergency Type</div><div class="fw-semibold">${escapeHtml(req.type)}</div></div>
    <div class="col-6 col-md-3"><div class="small text-muted">Location</div><div class="fw-semibold">${escapeHtml(req.stop)}</div></div>
    <div class="col-6 col-md-3"><div class="small text-muted">Status</div><span class="badge-status ${badgeClass}">${escapeHtml(req.status)}</span></div>
    <div class="col-6 col-md-3"><div class="small text-muted">Assigned Volunteer</div><div class="fw-semibold">${escapeHtml(req.volunteer)}</div></div>
    <div class="col-6 col-md-3"><div class="small text-muted">Emergency Van</div><div class="fw-semibold font-data">${escapeHtml(vanNumber)}</div></div>
    <div class="col-12 col-md-6"><div class="small text-muted">Emergency Message / Notes</div><div class="small text-muted">${escapeHtml(req.message || 'Urgent medical / rescue assistance requested.')}</div></div>
    <div class="col-12 col-md-6"><div class="small text-muted">Reported Time</div><div class="small font-data">${escapeHtml(req.time)} (${formatRelativeTime(req.createdAt)})</div></div>`;
}

function findVolunteerLocation(volunteerId, volunteerName) {
  if (!liveVolunteerLocations.length) return null;

  if (volunteerId) {
    const byId = liveVolunteerLocations.find(l => l.userId === volunteerId);
    if (byId && Number.isFinite(Number(byId.latitude)) && Number.isFinite(Number(byId.longitude))) {
      return { lat: Number(byId.latitude), lng: Number(byId.longitude), name: byId.name || volunteerName };
    }
  }

  if (volunteerName && volunteerName !== 'Unassigned') {
    const byName = liveVolunteerLocations.find(l => l.name && l.name.toLowerCase() === volunteerName.toLowerCase());
    if (byName && Number.isFinite(Number(byName.latitude)) && Number.isFinite(Number(byName.longitude))) {
      return { lat: Number(byName.latitude), lng: Number(byName.longitude), name: byName.name };
    }
  }

  // fallback to first active volunteer location
  const firstVol = liveVolunteerLocations.find(l => l.role === 'VOLUNTEER' && Number.isFinite(Number(l.latitude)));
  if (firstVol) {
    return { lat: Number(firstVol.latitude), lng: Number(firstVol.longitude), name: firstVol.name };
  }

  return null;
}

function trackLoad(id, preserveView = false) {
  if (!trackMap) return;

  const req = liveEmergencyRequests.find(r => r.id === id || r._id === id)
    || liveEmergencyRequests[0];

  if (!req) {
    [trackVarkariMarker, trackVanMarker, trackMedMarker].forEach(m => m && trackMap.removeLayer(m));
    trackVarkariMarker = null;
    trackVanMarker = null;
    trackMedMarker = null;
    trackRenderDetails(null, null);
    return;
  }

  currentSelectedSosId = req.id;

  const lat = Number(req.lat);
  const lng = Number(req.lng);
  const hasValidVarkariLoc = Number.isFinite(lat) && Number.isFinite(lng);

  // Determine van location
  const volLoc = findVolunteerLocation(req.volunteerId, req.volunteer);
  let vanLat = hasValidVarkariLoc ? lat - 0.006 : 18.2750;
  let vanLng = hasValidVarkariLoc ? lng - 0.005 : 74.1520;
  let vanName = req.volunteer !== 'Unassigned' ? req.volunteer : 'Emergency Response Team';

  if (volLoc) {
    vanLat = volLoc.lat;
    vanLng = volLoc.lng;
    vanName = volLoc.name || vanName;
  } else if (Array.isArray(EMERGENCY_VANS) && EMERGENCY_VANS.length > 0) {
    const matchedVan = EMERGENCY_VANS.find(v => v.volunteer === req.volunteer || v.number === req.van);
    if (matchedVan) {
      vanLat = matchedVan.lat;
      vanLng = matchedVan.lng;
    }
  }

  const van = {
    number: req.van !== '—' ? req.van : 'AMB-004',
    volunteer: vanName,
    lat: vanLat,
    lng: vanLng
  };

  const med = trackNearestMedicalCenter(hasValidVarkariLoc ? lat : 18.2802, hasValidVarkariLoc ? lng : 74.1580);

  // Update or Create Varkari Marker
  if (hasValidVarkariLoc) {
    const varkariPos = [lat, lng];
    if (trackVarkariMarker) {
      trackVarkariMarker.setLatLng(varkariPos);
    } else {
      trackVarkariMarker = L.marker(varkariPos, { icon: trackDivIcon('📍', '#FF8C00') }).addTo(trackMap);
    }
    trackVarkariMarker.bindPopup(`<strong>${escapeHtml(req.varkariName)}</strong> (${escapeHtml(req.varkariId)})<br>${escapeHtml(req.type)}<br>Status: <strong>${escapeHtml(req.status)}</strong><br>GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
  } else if (trackVarkariMarker) {
    trackMap.removeLayer(trackVarkariMarker);
    trackVarkariMarker = null;
  }

  // Update or Create Van Marker
  const vanPos = [van.lat, van.lng];
  if (trackVanMarker) {
    trackVanMarker.setLatLng(vanPos);
  } else {
    trackVanMarker = L.marker(vanPos, { icon: trackDivIcon('🚑', '#DC2626') }).addTo(trackMap);
  }
  trackVanMarker.bindPopup(`<strong>${escapeHtml(van.number)}</strong><br>Volunteer: ${escapeHtml(van.volunteer)}<br>Role: Emergency Response<br>Status: ${escapeHtml(req.status)}`);

  // Update or Create Medical Center Marker
  if (med && Number.isFinite(med.lat) && Number.isFinite(med.lng)) {
    const medPos = [med.lat, med.lng];
    if (trackMedMarker) {
      trackMedMarker.setLatLng(medPos);
    } else {
      trackMedMarker = L.marker(medPos, { icon: trackDivIcon('🏥', '#7C3AED') }).addTo(trackMap);
    }
    trackMedMarker.bindPopup(`<strong>${escapeHtml(med.name)}</strong><br>${escapeHtml(med.address || 'Wari Medical Post')}`);
  }

  // Set map viewport
  const bounds = [];
  if (hasValidVarkariLoc) bounds.push([lat, lng]);
  if (Number.isFinite(van.lat) && Number.isFinite(van.lng)) bounds.push([van.lat, van.lng]);
  if (med && Number.isFinite(med.lat) && Number.isFinite(med.lng)) bounds.push([med.lat, med.lng]);

  if (bounds.length > 0 && (!preserveView || !initialMapFitDone)) {
    trackMap.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    initialMapFitDone = true;
  }

  trackRenderDetails(req, van);
}

async function fetchEmergencyData() {
  try {
    // 1. Fetch SOS requests from MongoDB backend
    const sosResponse = await fetch(`${TRACK_API_BASE}/sos`);
    if (!sosResponse.ok) throw new Error(`SOS API returned HTTP ${sosResponse.status}`);
    const sosResult = await sosResponse.json();

    if (!sosResult.success || !Array.isArray(sosResult.data)) {
      throw new Error('Invalid SOS response format');
    }

    // 2. Fetch live Volunteer Locations
    try {
      const locResponse = await fetch(`${TRACK_API_BASE}/locations`);
      if (locResponse.ok) {
        const locResult = await locResponse.json();
        if (locResult.success && Array.isArray(locResult.data)) {
          liveVolunteerLocations = locResult.data;
        }
      }
    } catch (locErr) {
      console.warn('[Live Emergency Tracking] Location fetch note:', locErr.message);
    }

    // Map backend SOS objects
    liveEmergencyRequests = sosResult.data.map(sos => {
      const lat = Number(sos.latitude);
      const lng = Number(sos.longitude);
      const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);

      return {
        id: String(sos._id),
        _id: String(sos._id),
        varkariId: sos.userId || 'Warkari',
        varkariName: sos.userName || 'Warkari',
        type: sos.emergencyType || 'Emergency SOS',
        message: sos.message || '',
        stop: hasCoords ? `GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}` : 'Location Unavailable',
        volunteer: sos.assignedVolunteerName || (sos.assignedVolunteerId ? sos.assignedVolunteerId : 'Unassigned'),
        volunteerId: sos.assignedVolunteerId || null,
        van: sos.assignedVolunteerName ? 'AMB-004' : '—',
        time: formatTimestamp(sos.createdAt),
        createdAt: sos.createdAt,
        status: sos.status || 'PENDING',
        lat: hasCoords ? lat : 18.2802,
        lng: hasCoords ? lng : 74.1580
      };
    });

    const select = document.getElementById('trackEmergencySelect');
    if (select) {
      const previousValue = currentSelectedSosId || select.value;

      if (!liveEmergencyRequests.length) {
        select.innerHTML = '<option value="">No active emergencies</option>';
        trackLoad(null);
      } else {
        // Group active ones first
        const activeStatuses = ['PENDING', 'ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'REACHED'];
        const sortedRequests = [...liveEmergencyRequests].sort((a, b) => {
          const aActive = activeStatuses.includes(a.status) ? 1 : 0;
          const bActive = activeStatuses.includes(b.status) ? 1 : 0;
          if (aActive !== bActive) return bActive - aActive;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        select.innerHTML = sortedRequests.map(r => {
          const shortId = r.id.length > 8 ? r.id.slice(-6) : r.id;
          return `<option value="${r.id}">[${r.status}] ${shortId} — ${escapeHtml(r.varkariName)} (${escapeHtml(r.type)})</option>`;
        }).join('');

        // Maintain selection or prioritize URL param / first request
        let targetId = null;
        if (previousValue && sortedRequests.some(r => r.id === previousValue)) {
          targetId = previousValue;
        } else {
          const params = new URLSearchParams(window.location.search);
          const paramId = params.get('id');
          if (paramId && sortedRequests.some(r => r.id === paramId)) {
            targetId = paramId;
          } else {
            targetId = sortedRequests[0].id;
          }
        }

        select.value = targetId;
        trackLoad(targetId, true);
      }
    }

    const noteEl = document.getElementById('trackUpdatedNote');
    if (noteEl) {
      noteEl.textContent = `Live · Last update: ${new Date().toLocaleTimeString()}`;
    }
  } catch (error) {
    console.warn('[Live Emergency Tracking] Data sync notice:', error.message);
    const noteEl = document.getElementById('trackUpdatedNote');
    if (noteEl) {
      noteEl.textContent = `Reconnecting to backend... (${new Date().toLocaleTimeString()})`;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('trackMap');
  if (!mapElement) return;

  // Initialize Leaflet map
  trackMap = L.map('trackMap', { scrollWheelZoom: false }).setView([18.2802, 74.1580], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(trackMap);

  const select = document.getElementById('trackEmergencySelect');
  if (select) {
    select.addEventListener('change', () => {
      currentSelectedSosId = select.value;
      initialMapFitDone = false; // re-fit when user actively picks another emergency
      trackLoad(select.value, false);
    });
  }

  // Initial fetch and automatic periodic live refresh
  fetchEmergencyData();
  trackInterval = setInterval(fetchEmergencyData, 3500);
});
