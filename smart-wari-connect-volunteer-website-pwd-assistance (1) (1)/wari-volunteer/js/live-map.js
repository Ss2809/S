document.addEventListener('DOMContentLoaded', function () {
  const map = L.map('liveMap', { zoomControl: true }).setView([18.35, 74.9], 9);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const markerGroups = {
    warkari: L.layerGroup().addTo(map),
    sos: L.layerGroup().addTo(map),
    volunteer: L.layerGroup().addTo(map),
    pwd: L.layerGroup().addTo(map)
  };
  const liveWarkariMarkers = {};
  const liveSosMarkers = {};
  const liveVolunteerMarkers = {};
  const livePwdMarkers = {};
  const activeSosStatuses = ['PENDING', 'ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'REACHED'];
  let activeFilter = 'All';

  function icon(emoji, color) {
    return L.divIcon({
      className: '',
      html: '<div style="width:32px;height:32px;border-radius:50%;background:' + color + ';border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 1px 5px rgba(0,0,0,.35);">' + emoji + '</div>',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  }

  function updateWarkariMarkers(locations) {
    const received = new Set();
    locations.filter(location => location.role === 'WARKARI').forEach(location => {
      const latitude = Number(location.latitude);
      const longitude = Number(location.longitude);
      if (!location.userId || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
      received.add(location.userId);
      const coordinates = [latitude, longitude];
      let marker = liveWarkariMarkers[location.userId];
      if (!marker) {
        marker = L.marker(coordinates, { icon: icon('🧍', '#FF8C00') }).addTo(markerGroups.warkari);
        liveWarkariMarkers[location.userId] = marker;
      } else {
        marker.setLatLng(coordinates);
      }
      marker.bindPopup('<strong>' + (location.name || 'Warkari') + '</strong><br>Role: WARKARI<br>Live location: ' + latitude.toFixed(5) + ', ' + longitude.toFixed(5));
    });
    Object.keys(liveWarkariMarkers).forEach(userId => {
      if (!received.has(userId)) {
        markerGroups.warkari.removeLayer(liveWarkariMarkers[userId]);
        delete liveWarkariMarkers[userId];
      }
    });
  }

  function updateVolunteerMarkers(locations) {
    const received = new Set();
    locations.filter(location => location.role === 'VOLUNTEER').forEach(location => {
      const latitude = Number(location.latitude);
      const longitude = Number(location.longitude);
      if (!location.userId || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
      received.add(location.userId);
      const coordinates = [latitude, longitude];
      let marker = liveVolunteerMarkers[location.userId];
      if (!marker) {
        marker = L.marker(coordinates, { icon: icon('🙋', '#16A34A') }).addTo(markerGroups.volunteer);
        liveVolunteerMarkers[location.userId] = marker;
      } else {
        marker.setLatLng(coordinates);
      }
      marker.bindPopup('<strong>' + (location.name || 'Volunteer') + '</strong><br>Role: VOLUNTEER<br>Live location: ' + latitude.toFixed(5) + ', ' + longitude.toFixed(5));
    });
    Object.keys(liveVolunteerMarkers).forEach(userId => {
      if (!received.has(userId)) {
        markerGroups.volunteer.removeLayer(liveVolunteerMarkers[userId]);
        delete liveVolunteerMarkers[userId];
      }
    });
  }

  function updateSosMarkers(sosRequests) {
    const received = new Set();
    sosRequests.filter(sos => activeSosStatuses.includes(sos.status)).forEach(sos => {
      const latitude = Number(sos.latitude);
      const longitude = Number(sos.longitude);
      if (!sos._id || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
      received.add(sos._id);
      const coordinates = [latitude, longitude];
      let marker = liveSosMarkers[sos._id];
      if (!marker) {
        marker = L.marker(coordinates, { icon: icon('🚨', '#DC2626') }).addTo(markerGroups.sos);
        liveSosMarkers[sos._id] = marker;
      } else {
        marker.setLatLng(coordinates);
      }
      marker.bindPopup('<strong>SOS: ' + (sos.userName || 'Warkari') + '</strong><br>' + (sos.emergencyType || 'Emergency') + '<br>' + (sos.message || '') + '<br>Status: ' + sos.status);
    });
    Object.keys(liveSosMarkers).forEach(sosId => {
      if (!received.has(sosId)) {
        markerGroups.sos.removeLayer(liveSosMarkers[sosId]);
        delete liveSosMarkers[sosId];
      }
    });
  }

  function updatePwdMarkers(pwdRequests) {
    const received = new Set();
    pwdRequests.filter(p => ['Pending', 'Accepted', 'On the Way', 'Reached'].includes(p.status)).forEach(p => {
      const latitude = Number(p.latitude);
      const longitude = Number(p.longitude);
      if (!p._id || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
      received.add(p._id);
      const coordinates = [latitude, longitude];
      let marker = livePwdMarkers[p._id];
      if (!marker) {
        marker = L.marker(coordinates, { icon: icon('♿', '#7C3AED') }).addTo(markerGroups.pwd);
        livePwdMarkers[p._id] = marker;
      } else {
        marker.setLatLng(coordinates);
      }
      marker.bindPopup('<strong>PWD: ' + (p.userName || 'Warkari') + '</strong><br>' + (p.assistanceType || 'Assistance') + '<br>' + (p.description || '') + '<br>Status: ' + p.status);
    });
    Object.keys(livePwdMarkers).forEach(id => {
      if (!received.has(id)) {
        markerGroups.pwd.removeLayer(livePwdMarkers[id]);
        delete livePwdMarkers[id];
      }
    });
  }

  function refreshLocations() {
    fetch('http://localhost:5000/api/locations')
      .then(response => {
        if (!response.ok) throw new Error('Locations request failed with status ' + response.status);
        return response.json();
      })
      .then(result => {
        if (!result.success || !Array.isArray(result.data)) throw new Error('Invalid locations response');
        updateWarkariMarkers(result.data);
        updateVolunteerMarkers(result.data);
      })
      .catch(error => console.error('Volunteer live locations error:', error));
  }

  function refreshSos() {
    fetch('http://localhost:5000/api/sos')
      .then(response => {
        if (!response.ok) throw new Error('SOS request failed with status ' + response.status);
        return response.json();
      })
      .then(result => {
        if (!result.success || !Array.isArray(result.data)) throw new Error('Invalid SOS response');
        updateSosMarkers(result.data);
      })
      .catch(error => console.error('Volunteer live SOS error:', error));
  }

  function refreshPwd() {
    fetch('http://localhost:5000/api/pwd-requests')
      .then(response => {
        if (!response.ok) throw new Error('PWD request failed with status ' + response.status);
        return response.json();
      })
      .then(result => {
        if (!result.success || !Array.isArray(result.data)) throw new Error('Invalid PWD response');
        updatePwdMarkers(result.data);
      })
      .catch(error => console.error('Volunteer live PWD map error:', error));
  }

  function applyFilter(filter) {
    activeFilter = filter;
    Object.keys(markerGroups).forEach(type => {
      const visible = filter === 'All' ||
        (filter === 'SOS' && type === 'sos') ||
        (filter === 'Medical' && (type === 'sos' || type === 'pwd')) ||
        (filter === 'Warkari' && type === 'warkari') ||
        (filter === 'Volunteers' && type === 'volunteer');
      if (visible) map.addLayer(markerGroups[type]);
      else map.removeLayer(markerGroups[type]);
    });
  }

  document.querySelectorAll('.map-filter-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.map-filter-chip').forEach(item => item.classList.remove('active'));
      chip.classList.add('active');
      applyFilter(chip.textContent.trim());
    });
  });

  refreshLocations();
  refreshSos();
  refreshPwd();
  setInterval(refreshLocations, 4000);
  setInterval(refreshSos, 4000);
  setInterval(refreshPwd, 4000);
  setTimeout(() => map.invalidateSize(), 0);
});
