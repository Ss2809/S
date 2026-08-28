/* ==========================================================================
   Live Emergency Tracking page.
   Demo only: moves the van marker a small step toward the Varkari's location
   every ~4s to simulate a live GPS feed, without reloading the page. In a
   real deployment, replace the setInterval callback below with a poll (or
   websocket push) against the same backend/API that feeds the Volunteer
   Dashboard's GPS stream — the marker-update function is the single
   integration point.
   ========================================================================== */

let trackMap, trackVanMarker, trackVarkariMarker, trackMedMarker, trackInterval;

function trackActiveEmergencies(){
  return EMERGENCY_REQUESTS.filter(r => ["PENDING","ACCEPTED","ON THE WAY","ARRIVED"].includes(r.status));
}

function trackNearestMedicalCenter(stop){
  return MEDICAL_CENTERS.find(m => m.stop === stop) || MEDICAL_CENTERS[0];
}

function trackDivIcon(emoji, color){
  return L.divIcon({
    className: '',
    html: `<div style="width:30px;height:30px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 0 3px ${color}55;display:flex;align-items:center;justify-content:center;font-size:15px;">${emoji}</div>`,
    iconSize: [30, 30], iconAnchor: [15, 15]
  });
}

function trackRenderDetails(req, van){
  document.getElementById('trackDetails').innerHTML = `
    <div class="col-6 col-md-3"><div class="small text-muted">Varkari</div><div class="fw-semibold">${req.varkariName} <span class="text-muted small">(${req.varkariId})</span></div></div>
    <div class="col-6 col-md-3"><div class="small text-muted">Emergency Type</div><div class="fw-semibold">${req.type}</div></div>
    <div class="col-6 col-md-3"><div class="small text-muted">Wari Stop</div><div class="fw-semibold">${req.stop}</div></div>
    <div class="col-6 col-md-3"><div class="small text-muted">Status</div><span class="badge-status ${emStatusBadgeClass(req.status)}">${req.status}</span></div>
    <div class="col-6 col-md-3"><div class="small text-muted">Assigned Volunteer</div><div class="fw-semibold">${req.volunteer}</div></div>
    <div class="col-6 col-md-3"><div class="small text-muted">Emergency Van</div><div class="fw-semibold font-data">${van ? van.number : '—'}</div></div>`;
}

function trackStep(){
  const id = document.getElementById('trackEmergencySelect').value;
  const req = EMERGENCY_REQUESTS.find(r => r.id === id);
  if (!req || req.status === 'ARRIVED' || req.status === 'COMPLETED') return;
  const van = EMERGENCY_VANS.find(v => v.number === req.van);
  if (!van) return;

  const dLat = req.lat - van.lat, dLng = req.lng - van.lng;
  const dist = Math.sqrt(dLat*dLat + dLng*dLng);
  if (dist < 0.001){
    req.status = 'ARRIVED'; van.status = 'AVAILABLE'; van.emergency = '—';
  } else {
    van.lat += dLat * 0.18; van.lng += dLng * 0.18;
  }
  van.updated = 'just now';
  trackVanMarker.setLatLng([van.lat, van.lng]);
  document.getElementById('trackUpdatedNote').textContent = `Last update: ${new Date().toLocaleTimeString()}`;
  trackRenderDetails(req, van);
}

function trackLoad(id){
  const req = EMERGENCY_REQUESTS.find(r => r.id === id) || trackActiveEmergencies()[0];
  if (!req) return;
  const van = EMERGENCY_VANS.find(v => v.number === req.van);
  const med = trackNearestMedicalCenter(req.stop);

  [trackVarkariMarker, trackVanMarker, trackMedMarker].forEach(m => m && trackMap.removeLayer(m));

  trackVarkariMarker = L.marker([req.lat, req.lng], { icon: trackDivIcon('📍', '#FF8C00') }).addTo(trackMap)
    .bindPopup(`<strong>${req.varkariName}</strong><br>${req.type} — ${req.stop}`);

  if (van){
    trackVanMarker = L.marker([van.lat, van.lng], { icon: trackDivIcon('🚑', '#DC2626') }).addTo(trackMap)
      .bindPopup(`<strong>${van.number}</strong><br>${van.volunteer}`);
  }

  if (med){
    trackMedMarker = L.marker([med.lat, med.lng], { icon: trackDivIcon('🏥', '#7C3AED') }).addTo(trackMap)
      .bindPopup(`<strong>${med.name}</strong><br>${med.address}`);
  }

  const bounds = [[req.lat, req.lng]];
  if (van) bounds.push([van.lat, van.lng]);
  if (med) bounds.push([med.lat, med.lng]);
  trackMap.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });

  trackRenderDetails(req, van);
}

document.addEventListener('DOMContentLoaded', () => {
  trackMap = L.map('trackMap', { scrollWheelZoom: false }).setView([18.0, 74.9], 8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors', maxZoom: 18
  }).addTo(trackMap);

  const active = trackActiveEmergencies();
  const select = document.getElementById('trackEmergencySelect');
  select.innerHTML = active.map(r => `<option value="${r.id}">${r.id} — ${r.varkariName} (${r.type}, ${r.stop})</option>`).join('')
    || '<option value="">No active emergencies</option>';

  const params = new URLSearchParams(window.location.search);
  let preselect = params.get('id');
  if (!preselect && params.get('van')){
    const match = active.find(r => r.van === params.get('van'));
    preselect = match ? match.id : null;
  }
  if (preselect) select.value = preselect;

  select.addEventListener('change', () => trackLoad(select.value));
  if (active.length) trackLoad(select.value);

  trackInterval = setInterval(trackStep, 4000);
});
