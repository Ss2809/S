/* ==========================================================
   Smart Wari Connect — Emergency Van & Response
   Adds emergency workflow, live GPS tracking and the Leaflet
   emergency map on top of the existing Volunteer Dashboard.
   Hooks marked TODO(API) are where this should call the
   existing backend once it is wired up.
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {

  if (!document.getElementById('emergencyMap')) return; // only run on this page

  /* ---------- Demo coordinates (Jejuri Wari stop area) ---------- */
  let VARKARI_LOC = { lat: 18.2705, lng: 74.1650, label: 'Varkari (WK-7734)' };
  const MEDICAL_CENTER = { lat: 18.2655, lng: 74.1585, label: 'Jejuri Primary Health Center' };
  let vanLoc = { lat: 18.2610, lng: 74.1510 }; // van starting point
  const SOS_API_BASE = 'http://localhost:5000/api/sos';
  const VOLUNTEER_ID = 'test-volunteer-001';
  const VOLUNTEER_NAME = 'Test Volunteer';
  let currentEmergency = null;

  /* ---------- Leaflet map ---------- */
  const map = L.map('emergencyMap', { zoomControl: true }).setView([18.2660, 74.1590], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  function emojiIcon(emoji) {
    return L.divIcon({
      html: '<div style="font-size:26px;line-height:1;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35));">' + emoji + '</div>',
      className: '', iconSize: [30, 30], iconAnchor: [15, 15]
    });
  }

  const varkariMarker = L.marker([VARKARI_LOC.lat, VARKARI_LOC.lng], { icon: emojiIcon('📍') })
    .addTo(map).bindPopup(VARKARI_LOC.label);
  const medicalMarker = L.marker([MEDICAL_CENTER.lat, MEDICAL_CENTER.lng], { icon: emojiIcon('🏥') })
    .addTo(map).bindPopup(MEDICAL_CENTER.label);
  const vanMarker = L.marker([vanLoc.lat, vanLoc.lng], { icon: emojiIcon('🚑') })
    .addTo(map).bindPopup('Emergency Van · AMB-004');

  const liveWarkariMarkers = {};
  const liveSosMarkers = {};
  const activeSosStatuses = ['PENDING', 'ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'REACHED'];

  function updateLiveWarkariMarkers(locations) {
    const receivedUserIds = new Set();
    locations.filter(location => location.role === 'WARKARI').forEach(location => {
      const latitude = Number(location.latitude);
      const longitude = Number(location.longitude);
      if (!location.userId || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

      receivedUserIds.add(location.userId);
      const coordinates = [latitude, longitude];
      const marker = liveWarkariMarkers[location.userId];
      if (marker) {
        marker.setLatLng(coordinates);
      } else {
        liveWarkariMarkers[location.userId] = L.marker(coordinates, { icon: emojiIcon('📍') }).addTo(map);
      }
      liveWarkariMarkers[location.userId].bindPopup('<strong>' + (location.name || 'Warkari') + '</strong><br>Role: WARKARI');
    });

    Object.keys(liveWarkariMarkers).forEach(userId => {
      if (!receivedUserIds.has(userId)) {
        map.removeLayer(liveWarkariMarkers[userId]);
        delete liveWarkariMarkers[userId];
      }
    });
  }

  function updateLiveSosMarkers(sosRequests) {
    const receivedSosIds = new Set();
    sosRequests.filter(sos => activeSosStatuses.includes(sos.status)).forEach(sos => {
      const latitude = Number(sos.latitude);
      const longitude = Number(sos.longitude);
      if (!sos._id || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

      receivedSosIds.add(sos._id);
      const coordinates = [latitude, longitude];
      const marker = liveSosMarkers[sos._id];
      if (marker) {
        marker.setLatLng(coordinates);
      } else {
        liveSosMarkers[sos._id] = L.marker(coordinates, { icon: emojiIcon('🚨') }).addTo(map);
      }
      liveSosMarkers[sos._id].bindPopup(
        '<strong>' + (sos.userName || 'Warkari') + '</strong><br>' +
        (sos.emergencyType || 'Emergency') + '<br>' +
        (sos.message || '') + '<br>Status: ' + sos.status
      );
    });

    Object.keys(liveSosMarkers).forEach(sosId => {
      if (!receivedSosIds.has(sosId)) {
        map.removeLayer(liveSosMarkers[sosId]);
        delete liveSosMarkers[sosId];
      }
    });
  }

  function refreshLiveMapData() {
    fetch('http://localhost:5000/api/locations')
      .then(response => {
        if (!response.ok) throw new Error('Location request failed with status ' + response.status);
        return response.json();
      })
      .then(result => {
        if (!result.success || !Array.isArray(result.data)) throw new Error('Invalid locations response');
        updateLiveWarkariMarkers(result.data);
      })
      .catch(error => console.error('Live Warkari map API error:', error));

    fetch('http://localhost:5000/api/sos')
      .then(response => {
        if (!response.ok) throw new Error('SOS request failed with status ' + response.status);
        return response.json();
      })
      .then(result => {
        if (!result.success || !Array.isArray(result.data)) throw new Error('Invalid SOS response');
        updateLiveSosMarkers(result.data);
      })
      .catch(error => console.error('Live SOS map API error:', error));
  }

  refreshLiveMapData();
  setInterval(refreshLiveMapData, 4000);

  let routeLine = L.polyline([[vanLoc.lat, vanLoc.lng], [VARKARI_LOC.lat, VARKARI_LOC.lng]], {
    color: '#DC2626', weight: 3, dashArray: '6 6'
  }).addTo(map);

  function fitAll() {
    const bounds = L.latLngBounds([
      [VARKARI_LOC.lat, VARKARI_LOC.lng], [MEDICAL_CENTER.lat, MEDICAL_CENTER.lng], [vanLoc.lat, vanLoc.lng]
    ]);
    map.fitBounds(bounds, { padding: [30, 30] });
  }
  fitAll();

  /* ---------- Distance / ETA (straight-line approximation) ---------- */
  function haversineKm(a, b) {
    const R = 6371, toRad = d => d * Math.PI / 180;
    const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
    const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  }
  function updateEtaLabel() {
    const km = haversineKm(vanLoc, VARKARI_LOC);
    const etaMin = Math.max(1, Math.round((km / 28) * 60)); // assume ~28km/h avg on Wari route
    document.getElementById('etaDistanceLabel').textContent = km.toFixed(1) + ' km · ~' + etaMin + ' min ETA';
    document.getElementById('emReqDistance').textContent = km.toFixed(1) + ' KM';
    return { km, etaMin };
  }
  updateEtaLabel();

  /* ---------- Emergency workflow state ---------- */
  const STEPS = ['pending', 'accepted', 'started', 'onway', 'arrived', 'completed'];
  let currentStepIndex = 0;
  let emergencyId = 'EMG-' + (1043 + Math.floor(Math.random() * 50));

  function setCurrentEmergency(sos) {
    if (!sos) return;
    currentEmergency = sos;
    emergencyId = sos._id;
    VARKARI_LOC = {
      lat: Number(sos.latitude),
      lng: Number(sos.longitude),
      label: sos.userName || sos.userId || 'Warkari'
    };
    varkariMarker.setLatLng([VARKARI_LOC.lat, VARKARI_LOC.lng]).bindPopup(VARKARI_LOC.label);
    routeLine.setLatLngs([[vanLoc.lat, vanLoc.lng], [VARKARI_LOC.lat, VARKARI_LOC.lng]]);

    const card = document.getElementById('newEmergencyCard');
    card.style.display = '';
    const nameEl = card.querySelector('.req-name');
    const typeEl = card.querySelector('.req-pill');
    const descEl = card.querySelector('[data-i18n="emergencyDescSample"]');
    const locEl = card.querySelector('[data-i18n="jejuriRoadCrossing"]');
    if (nameEl) nameEl.textContent = `${sos.userName || 'Warkari'} (${sos.userId || sos._id})`;
    if (typeEl) typeEl.textContent = sos.emergencyType || 'Emergency SOS';
    if (descEl) descEl.textContent = sos.message || 'Emergency SOS raised from Warkari dashboard.';
    if (locEl) locEl.textContent = `Lat: ${Number(sos.latitude).toFixed(5)}, Lng: ${Number(sos.longitude).toFixed(5)}`;
    document.getElementById('emReqTime').textContent = 'Live SOS';
    updateEtaLabel();
  }

  async function loadPendingEmergency() {
    try {
      const response = await fetch(SOS_API_BASE);
      if (!response.ok) throw new Error('SOS request failed with status ' + response.status);
      const result = await response.json();
      if (!result.success || !Array.isArray(result.data)) throw new Error('Invalid SOS API response');
      const pending = result.data.find(sos => sos.status === 'PENDING');
      if (pending) setCurrentEmergency(pending);
      else if (!currentEmergency) document.getElementById('newEmergencyCard').style.display = 'none';
    } catch (error) {
      console.error('[Emergency Van] Failed to load SOS:', error);
    }
  }

  async function patchEmergencyStatus(status) {
    if (!currentEmergency) return;
    const response = await fetch(SOS_API_BASE + '/' + encodeURIComponent(currentEmergency._id) + '/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message || 'SOS status update failed');
    currentEmergency = result.data;
  }

  function renderStepper() {
    document.querySelectorAll('#wfStepper .wf-step').forEach(function (el, i) {
      el.classList.remove('done', 'current');
      if (i < currentStepIndex) el.classList.add('done');
      else if (i === currentStepIndex) el.classList.add('current');
    });
  }

  function setVanStatus(text) {
    document.getElementById('vanStatusValue').textContent = text;
  }

  function toast(message, iconBg, icon) {
    const list = document.getElementById('emergencyNotifList');
    if (!list) return;
    const row = document.createElement('div');
    row.className = 'notif-item mt-2';
    row.innerHTML = '<div class="notif-ic" style="background:' + iconBg + ';"><i class="bi ' + icon + '"></i></div>' +
      '<div><div class="fw-semibold" style="font-size:.84rem;">' + message + '</div><div class="notif-time">Just now</div></div>';
    list.prepend(row);
    // TODO(API): also push to existing notification system / notifOffcanvas + Admin + Varkari
  }

  /* ---------- GPS tracking ---------- */
  let gpsWatchId = null;
  let gpsInterval = null;

  function setGpsBadge(on) {
    ['gpsBadge', 'gpsBadgeVanCard'].forEach(function (id) {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.toggle('off', !on);
      const label = el.querySelector('span:last-child');
      if (label) label.textContent = on ? 'GPS LIVE' : 'GPS OFF';
    });
  }

  function pushVanLocation(lat, lng) {
    vanLoc = { lat: lat, lng: lng };
    vanMarker.setLatLng([lat, lng]);
    routeLine.setLatLngs([[lat, lng], [VARKARI_LOC.lat, VARKARI_LOC.lng]]);
    document.getElementById('vanGpsValue').textContent = lat.toFixed(4) + ', ' + lng.toFixed(4);
    document.getElementById('vanLastUpdated').textContent = new Date().toLocaleTimeString();
    updateEtaLabel();

    // TODO(API): send to existing backend, e.g.
    // fetch('/api/volunteer/emergency/' + emergencyId + '/location', {
    //   method: 'POST', headers: {'Content-Type':'application/json'},
    //   body: JSON.stringify({ lat, lng, updatedAt: Date.now() })
    // });
  }

  function startLiveLocation() {
    setGpsBadge(true);
    if (navigator.geolocation) {
      gpsWatchId = navigator.geolocation.watchPosition(
        function (pos) { pushVanLocation(pos.coords.latitude, pos.coords.longitude); },
        function () { /* permission denied / unavailable — fall back to simulated GPS below */ },
        { enableHighAccuracy: true, maximumAge: 3000, timeout: 8000 }
      );
    }
    // Simulated movement toward the Varkari every ~4s so the demo/map stays live
    // even without real device GPS permission — safe to remove once real GPS is required.
    gpsInterval = setInterval(function () {
      const lat = vanLoc.lat + (VARKARI_LOC.lat - vanLoc.lat) * 0.12;
      const lng = vanLoc.lng + (VARKARI_LOC.lng - vanLoc.lng) * 0.12;
      pushVanLocation(lat, lng);
    }, 4000);
  }

  function stopLiveLocation() {
    setGpsBadge(false);
    if (gpsWatchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(gpsWatchId);
      gpsWatchId = null;
    }
    if (gpsInterval) { clearInterval(gpsInterval); gpsInterval = null; }
  }

  /* ---------- Volunteer availability chips ---------- */
  document.querySelectorAll('#volStatusRow .status-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      if (chip.disabled) return;
      document.querySelectorAll('#volStatusRow .status-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      // TODO(API): PATCH /api/volunteer/status { status }
    });
  });
  function forceStatus(status) {
    document.querySelectorAll('#volStatusRow .status-chip').forEach(function (c) {
      c.classList.toggle('active', c.getAttribute('data-status') === status);
      if (status === 'emergency') c.disabled = c.getAttribute('data-status') !== 'emergency' ? true : false;
      else if (c.getAttribute('data-status') !== 'emergency') c.disabled = false;
    });
  }

  /* ---------- Accept / Reject incoming emergency ---------- */
  const newCard = document.getElementById('newEmergencyCard');
  const workflowCard = document.getElementById('workflowCard');

  document.getElementById('acceptEmergencyBtn').addEventListener('click', async function () {
    newCard.style.display = 'none';
    workflowCard.style.display = '';
    currentStepIndex = 1; // ACCEPTED
    renderStepper();
    setVanStatus('DISPATCHED');
    document.getElementById('vanAssignedEmergency').textContent = emergencyId;
    forceStatus('emergency');
    toast('Emergency accepted — Admin and Varkari notified.', '#DCFCE7', 'bi-check2-circle text-success');
    if (currentEmergency) {
      const assignResponse = await fetch(SOS_API_BASE + '/' + encodeURIComponent(currentEmergency._id) + '/assign', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedVolunteerId: VOLUNTEER_ID, assignedVolunteerName: VOLUNTEER_NAME })
      });
      const assignResult = await assignResponse.json();
      if (!assignResponse.ok || !assignResult.success) throw new Error(assignResult.message || 'SOS assignment failed');
      await patchEmergencyStatus('ACCEPTED');
    }
  });

  document.getElementById('rejectEmergencyBtn').addEventListener('click', function () {
    newCard.style.display = 'none';
    toast('Emergency request rejected. Admin will reassign it.', '#FEE2E2', 'bi-x-circle text-danger');
    // TODO(API): POST /api/volunteer/emergency/{id}/reject
  });

  /* ---------- Workflow buttons ---------- */
  document.getElementById('startEmergencyBtn').addEventListener('click', function () {
    currentStepIndex = 2; renderStepper();
    setVanStatus('EN ROUTE');
    document.getElementById('onWayBtn').disabled = false;
    this.disabled = true;
    toast('Emergency response started.', '#FFF7ED', 'bi-play-fill text-warning');
  });

  document.getElementById('onWayBtn').addEventListener('click', function () {
    currentStepIndex = 3; renderStepper();
    setVanStatus('ON THE WAY');
    document.getElementById('arrivedBtn').disabled = false;
    this.disabled = true;
    startLiveLocation();
    toast('Van is on the way — live GPS started.', '#DBEAFE', 'bi-truck-front text-primary');
    patchEmergencyStatus('ON_THE_WAY').catch(error => console.error('[Emergency Van] ON_THE_WAY failed:', error));
  });

  document.getElementById('arrivedBtn').addEventListener('click', function () {
    currentStepIndex = 4; renderStepper();
    setVanStatus('ARRIVED');
    document.getElementById('completeBtn').disabled = false;
    this.disabled = true;
    toast('Volunteer has arrived at the Varkari location.', '#DCFCE7', 'bi-geo-alt-fill text-success');
    patchEmergencyStatus('REACHED').catch(error => console.error('[Emergency Van] REACHED failed:', error));
  });

  document.getElementById('completeBtn').addEventListener('click', function () {
    currentStepIndex = 5; renderStepper();
    setVanStatus('AVAILABLE');
    document.getElementById('vanAssignedEmergency').textContent = '—';
    this.disabled = true;
    stopLiveLocation();
    forceStatus('available');
    toast('Emergency completed — van and volunteer are AVAILABLE again.', '#DCFCE7', 'bi-flag-fill text-success');
    // Prepend to history table
    const tbody = document.getElementById('emergencyHistoryBody');
    if (tbody) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const row = document.createElement('tr');
      row.innerHTML = '<td>' + emergencyId + '</td><td>WK-7734</td><td>Cardiac Distress</td><td>Jejuri</td>' +
        '<td>AMB-004</td><td>' + now + '</td><td>' + now + '</td><td>' + now + '</td>' +
        '<td><span class="status-pill open">COMPLETED</span></td>';
      tbody.prepend(row);
    }
    patchEmergencyStatus('RESOLVED').catch(error => console.error('[Emergency Van] RESOLVED failed:', error));
  });

  /* ---------- Navigate button ---------- */
  document.getElementById('navigateBtn').addEventListener('click', function () {
    fitAll();
    const { km, etaMin } = updateEtaLabel();
    toast('Route to Varkari: ' + km.toFixed(1) + ' km · ~' + etaMin + ' min.', '#FFF7ED', 'bi-compass text-warning');
  });

  renderStepper();
  loadPendingEmergency();
  setInterval(loadPendingEmergency, 4000);
});
