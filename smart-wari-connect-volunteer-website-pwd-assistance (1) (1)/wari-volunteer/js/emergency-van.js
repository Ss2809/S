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
  const VARKARI_LOC = { lat: 18.2705, lng: 74.1650, label: 'Varkari (WK-7734)' };
  const MEDICAL_CENTER = { lat: 18.2655, lng: 74.1585, label: 'Jejuri Primary Health Center' };
  let vanLoc = { lat: 18.2610, lng: 74.1510 }; // van starting point

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
  const emergencyId = 'EMG-' + (1043 + Math.floor(Math.random() * 50));

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

  document.getElementById('acceptEmergencyBtn').addEventListener('click', function () {
    newCard.style.display = 'none';
    workflowCard.style.display = '';
    currentStepIndex = 1; // ACCEPTED
    renderStepper();
    setVanStatus('DISPATCHED');
    document.getElementById('vanAssignedEmergency').textContent = emergencyId;
    forceStatus('emergency');
    toast('Emergency accepted — Admin and Varkari notified.', '#DCFCE7', 'bi-check2-circle text-success');
    // TODO(API): POST /api/volunteer/emergency/{id}/accept
    // -> assigns volunteer + van, notifies Varkari + Admin
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
    // TODO(API): notify Varkari + Admin that van is en route
  });

  document.getElementById('arrivedBtn').addEventListener('click', function () {
    currentStepIndex = 4; renderStepper();
    setVanStatus('ARRIVED');
    document.getElementById('completeBtn').disabled = false;
    this.disabled = true;
    toast('Volunteer has arrived at the Varkari location.', '#DCFCE7', 'bi-geo-alt-fill text-success');
    // TODO(API): notify Varkari + Admin of arrival
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
    // TODO(API): POST /api/volunteer/emergency/{id}/complete -> stop GPS server-side, save history
  });

  /* ---------- Navigate button ---------- */
  document.getElementById('navigateBtn').addEventListener('click', function () {
    fitAll();
    const { km, etaMin } = updateEtaLabel();
    toast('Route to Varkari: ' + km.toFixed(1) + ' km · ~' + etaMin + ' min.', '#FFF7ED', 'bi-compass text-warning');
  });

  renderStepper();
});
