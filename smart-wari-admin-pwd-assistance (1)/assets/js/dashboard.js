/* Dashboard page: live map + analytics charts. Sample/demo data only. */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Live Map ---------------- */
  const map = L.map('liveMap', { scrollWheelZoom: false }).setView([18.35, 74.9], 8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);

  const markerColor = (color) => L.divIcon({
    className: '',
    html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 0 2px ${color}55"></div>`,
    iconSize: [16, 16]
  });

  const points = [
    { lat: 18.3410, lng: 74.0169, type: 'volunteers', label: 'Saswad — Volunteer Team (32 active)', color: '#16A34A' },
    { lat: 18.2802, lng: 74.1580, type: 'sos', label: 'Jejuri — Active SOS (Fall/Injury)', color: '#DC2626' },
    { lat: 17.9789, lng: 74.4708, type: 'volunteers', label: 'Lonand — Volunteer Team (18 active)', color: '#16A34A' },
    { lat: 17.9906, lng: 74.6438, type: 'medical', label: 'Phaltan — Medical Camp (Dr. Kulkarni)', color: '#F59E0B' },
    { lat: 17.9101, lng: 75.0864, type: 'food', label: 'Malshiras — Food Camp (Annachhatra Mandal)', color: '#F97316' },
    { lat: 17.8961, lng: 75.2200, type: 'water', label: 'Wakhri — Water Point (Tanker + RO)', color: '#2563EB' },
    { lat: 17.6805, lng: 75.3288, type: 'medical', label: 'Pandharpur — Hospital Support Point', color: '#7C3AED' }
  ];

  const layerRefs = points.map(p => {
    const m = L.marker([p.lat, p.lng], { icon: markerColor(p.color) }).addTo(map);
    m.bindPopup(`<strong>${p.label}</strong>`);
    m._wariType = p.type;
    return m;
  });

  const warkariMarkers = new Map();

  function updateLiveLocations(){
    fetch('http://localhost:5000/api/locations')
      .then(response => {
        if (!response.ok) throw new Error(`Live locations request failed with status ${response.status}`);
        return response.json();
      })
      .then(payload => {
        if (!payload.success || !Array.isArray(payload.data)) {
          throw new Error('Live locations response has an invalid format');
        }

        const receivedUserIds = new Set();
        payload.data.filter(location => location.role === 'WARKARI').forEach(location => {
          if (!location.userId || !Number.isFinite(Number(location.latitude)) || !Number.isFinite(Number(location.longitude))) return;

          receivedUserIds.add(location.userId);
          const coordinates = [Number(location.latitude), Number(location.longitude)];
          let marker = warkariMarkers.get(location.userId);

          if (marker) {
            marker.setLatLng(coordinates);
          } else {
            marker = L.marker(coordinates, { icon: markerColor('#FF8C00') }).addTo(map);
            warkariMarkers.set(location.userId, marker);
          }

          marker.bindPopup(`<strong>${location.name || 'Unknown user'}</strong><br>Role: ${location.role}`);
        });

        warkariMarkers.forEach((marker, userId) => {
          if (!receivedUserIds.has(userId)) {
            map.removeLayer(marker);
            warkariMarkers.delete(userId);
          }
        });
      })
      .catch(error => console.error('Live locations API error:', error));
  }

  updateLiveLocations();
  setInterval(updateLiveLocations, 4000);

  /* ---------------- ♿ PWD Assistance markers (reuses this same map) ----------------
     Kept as its own emoji-marker layer, entirely separate from the SOS marker
     above — adding markers here does not touch the existing 'sos' points or
     any SOS logic. Uses the shared PWD_REQUESTS / PWD_VOLUNTEERS data
     (assets/js/pwd-data.js), loaded before this script runs. */
  const pwdEmojiIcon = (emoji, color) => L.divIcon({
    className: '',
    html: `<div style="width:26px;height:26px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 0 2px ${color}55;display:flex;align-items:center;justify-content:center;font-size:13px;">${emoji}</div>`,
    iconSize: [26, 26], iconAnchor: [13, 13]
  });

  const pwdMarkersById = {};
  if (typeof PWD_REQUESTS !== 'undefined'){
    PWD_REQUESTS.filter(r => !["Resolved","Cancelled"].includes(r.status)).forEach(r => {
      const m = L.marker([r.lat, r.lng], { icon: pwdEmojiIcon('♿', '#6D28D9') }).addTo(map);
      m.bindPopup(`<strong>${r.id} — ${r.varkariName}</strong><br>${r.assistanceType}<br>${r.stop}<br>Volunteer: ${r.volunteer}<br>Status: ${r.status}` +
        `<br><a href="pwd-assistance.html">Open in PWD Assistance →</a>`);
      m._wariType = 'pwd';
      layerRefs.push(m);
      pwdMarkersById[r.id] = m;
    });
  }
  if (typeof PWD_VOLUNTEERS !== 'undefined'){
    PWD_VOLUNTEERS.filter(v => v.status === 'AVAILABLE').forEach(v => {
      const m = L.marker([v.lat, v.lng], { icon: pwdEmojiIcon('🟢', '#16A34A') }).addTo(map);
      m.bindPopup(`<strong>${v.name}</strong><br>PWD Volunteer — Available<br>${v.stop}`);
      m._wariType = 'pwd';
      layerRefs.push(m);
    });
  }

  /* Deep link from pwd-assistance.html's "View on Map" button: ?pwd=PWD-3081 */
  const dashParams = new URLSearchParams(window.location.search);
  const focusPwd = dashParams.get('pwd');
  if (focusPwd && pwdMarkersById[focusPwd]){
    const target = pwdMarkersById[focusPwd];
    map.setView(target.getLatLng(), 12);
    target.openPopup();
    const pwdChip = document.querySelector('.chip[data-filter="pwd"]');
    if (pwdChip) pwdChip.click();
  }

  document.querySelectorAll('.chip[data-filter]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip[data-filter]').forEach(c => c.classList.remove('active-filter'));
      chip.classList.add('active-filter');
      const filter = chip.dataset.filter;
      layerRefs.forEach(m => {
        const show = filter === 'all' || m._wariType === filter;
        const el = m.getElement();
        if (el) el.style.display = show ? '' : 'none';
      });
    });
  });

  /* ---------------- Chart defaults ---------------- */
  Chart.defaults.font.family = "'Poppins', sans-serif";
  Chart.defaults.color = '#6B7280';
  Chart.defaults.plugins.legend.labels.usePointStyle = true;

  /* Registration trend */
  new Chart(document.getElementById('chartRegistration'), {
    type: 'line',
    data: {
      labels: ['Day 1','Day 2','Day 3','Day 4','Day 5','Day 6','Day 7','Day 8','Day 9','Day 10'],
      datasets: [{
        label: 'New Registrations',
        data: [820, 1120, 990, 1450, 1720, 1610, 1980, 2210, 2040, 2340],
        borderColor: '#FF8C00',
        backgroundColor: 'rgba(255,140,0,.12)',
        fill: true, tension: .4, pointRadius: 3, pointBackgroundColor: '#FF8C00'
      }]
    },
    options: { plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#EEF0F4' } }, x: { grid: { display: false } } } }
  });

  /* Assistance distribution donut */
  new Chart(document.getElementById('chartDistribution'), {
    type: 'doughnut',
    data: {
      labels: ['Food', 'Water', 'Medical', 'Route', 'Emergency', 'Other'],
      datasets: [{
        data: [28, 24, 18, 14, 9, 7],
        backgroundColor: ['#F97316', '#2563EB', '#16A34A', '#FF8C00', '#DC2626', '#94A3B8'],
        borderWidth: 3, borderColor: '#fff'
      }]
    },
    options: { plugins: { legend: { position: 'bottom' } }, cutout: '62%' }
  });

  /* Daily visitors bar */
  new Chart(document.getElementById('chartVisitors'), {
    type: 'bar',
    data: {
      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets: [{
        label: 'Visitors',
        data: [32000, 35400, 31200, 40100, 44300, 48120, 46200],
        backgroundColor: '#16A34A', borderRadius: 8, maxBarThickness: 34
      }]
    },
    options: { plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#EEF0F4' } }, x: { grid: { display: false } } } }
  });

  /* SOS requests */
  new Chart(document.getElementById('chartSOS'), {
    type: 'bar',
    data: {
      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets: [{
        label: 'SOS Requests',
        data: [4, 6, 3, 8, 5, 9, 7],
        backgroundColor: '#DC2626', borderRadius: 8, maxBarThickness: 34
      }]
    },
    options: { plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#EEF0F4' }, beginAtZero: true }, x: { grid: { display: false } } } }
  });

  /* Route crowd analytics */
  new Chart(document.getElementById('chartRoute'), {
    type: 'bar',
    data: {
      labels: ['Alandi','Pune','Saswad','Jejuri','Lonand','Phaltan','Malshiras','Wakhri','Pandharpur'],
      datasets: [{
        label: 'Crowd Density Index',
        data: [72, 65, 58, 61, 47, 53, 68, 74, 96],
        backgroundColor: (ctx) => {
          const v = ctx.raw;
          return v > 85 ? '#DC2626' : v > 65 ? '#F59E0B' : '#16A34A';
        },
        borderRadius: 8, maxBarThickness: 40
      }]
    },
    options: { plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#EEF0F4' } }, x: { grid: { display: false } } } }
  });

});
