document.addEventListener('DOMContentLoaded', function () {
  const map = L.map('liveMap', { scrollWheelZoom: true }).setView([18.35, 74.9], 9);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);

  const layerGroups = {
    food: L.layerGroup().addTo(map),
    water: L.layerGroup().addTo(map),
    medical: L.layerGroup().addTo(map),
    police: L.layerGroup(),
    volunteers: L.layerGroup().addTo(map),
    sos: L.layerGroup().addTo(map)
  };

  const serviceColors = { food: '#F97316', water: '#2563EB', medical: '#DC2626', police: '#334155', hospital: '#7C3AED' };
  const serviceIcons = { food: '🍛', water: '🚰', medical: '🏥', police: '👮', hospital: '🏥' };

  async function loadFieldServices() {
    try {
      const res = await fetch('http://localhost:5000/api/services');
      if (!res.ok) return;
      const result = await res.json();
      if (!result.success || !Array.isArray(result.data)) return;

      result.data.forEach(function (service) {
        const cat = String(service.category || 'FOOD').toLowerCase();
        const group = layerGroups[cat] || (cat === 'hospital' ? layerGroups.medical : layerGroups.food);
        if (!group) return;

        const lat = Number(service.latitude);
        const lng = Number(service.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

        const color = serviceColors[cat] || '#F97316';
        const iconSymbol = serviceIcons[cat] || '📍';

        L.marker([lat, lng], {
          icon: L.divIcon({
            className: '',
            html: '<div style="width:30px;height:30px;border-radius:50%;background:' + color + ';border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 1px 5px rgba(0,0,0,.35);">' + iconSymbol + '</div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          })
        }).bindPopup('<strong>' + (service.name || 'Wari Service') + '</strong><br>' + (service.details || service.stop || service.location || 'Open')).addTo(group);
      });
    } catch (e) {
      console.warn('Field services map notice:', e.message);
    }
  }

  loadFieldServices();

  const warkariIcon = L.divIcon({
    className: '',
    html: '<div style="width:34px;height:34px;border-radius:50%;background:#FF8C00;border:3px solid #fff;box-shadow:0 0 0 3px rgba(255,140,0,.3);display:flex;align-items:center;justify-content:center;font-size:18px;">🧍</div>',
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
  let warkariMarker = null;
  let locationWatchId = null;

  function updateWarkariLocation(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coordinates = [latitude, longitude];
    if (!warkariMarker) {
      warkariMarker = L.marker(coordinates, { icon: warkariIcon }).addTo(map);
    } else {
      warkariMarker.setLatLng(coordinates);
    }
    warkariMarker.bindPopup('<strong>Sunil Bhosale</strong><br>Role: WARKARI<br>Live GPS: ' + latitude.toFixed(5) + ', ' + longitude.toFixed(5));
    map.setView(coordinates, Math.max(map.getZoom(), 12));
    const hereLabel = document.querySelector('.status-pill.busy');
    if (hereLabel) hereLabel.innerHTML = '<i class="bi bi-circle-fill me-1" style="font-size:.5rem;"></i>You are here';

    fetch('http://localhost:5000/api/locations/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'SWC-2026-08412',
        name: 'Sunil Bhosale',
        role: 'WARKARI',
        latitude,
        longitude
      })
    }).then(function (response) {
      if (!response.ok) throw new Error('Location update failed with status ' + response.status);
      return response.json();
    }).then(function (result) {
      console.log('Live map location update:', result);
    }).catch(function (error) {
      console.error('Live map location API error:', error);
    });
  }

  function startLocationWatch() {
    if (locationWatchId !== null) return;
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser');
      return;
    }
    locationWatchId = navigator.geolocation.watchPosition(updateWarkariLocation, function (error) {
      console.error('Live map GPS error:', error.code, error.message);
      const hereLabel = document.querySelector('.status-pill.busy');
      if (hereLabel) hereLabel.innerHTML = '<i class="bi bi-circle-fill me-1" style="font-size:.5rem;"></i>Location unavailable';
    }, { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 });
  }

  function markerIcon(color, symbol) {
    return L.divIcon({
      className: '',
      html: '<div style="width:30px;height:30px;border-radius:50%;background:' + color + ';border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:15px;box-shadow:0 1px 5px rgba(0,0,0,.35);">' + symbol + '</div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  }

  const volunteerMarkers = new Map();
  function loadVolunteers() {
    fetch('http://localhost:5000/api/locations?role=VOLUNTEER')
      .then(function (response) {
        if (!response.ok) throw new Error('Volunteer locations failed with status ' + response.status);
        return response.json();
      })
      .then(function (result) {
        if (!result.success || !Array.isArray(result.data)) throw new Error('Invalid volunteer locations response');
        const received = new Set();
        result.data.forEach(function (location) {
          if (!location.userId || !Number.isFinite(Number(location.latitude)) || !Number.isFinite(Number(location.longitude))) return;
          received.add(location.userId);
          const coordinates = [Number(location.latitude), Number(location.longitude)];
          let marker = volunteerMarkers.get(location.userId);
          if (!marker) {
            marker = L.marker(coordinates, { icon: markerIcon('#16A34A', '🙋') }).addTo(layerGroups.volunteers);
            volunteerMarkers.set(location.userId, marker);
          } else {
            marker.setLatLng(coordinates);
          }
          marker.bindPopup('<strong>' + (location.name || 'Volunteer') + '</strong><br>Role: ' + (location.role || 'VOLUNTEER'));
        });
        volunteerMarkers.forEach(function (marker, userId) {
          if (!received.has(userId)) {
            layerGroups.volunteers.removeLayer(marker);
            volunteerMarkers.delete(userId);
          }
        });
      })
      .catch(function (error) { console.error('Volunteer locations API error:', error); });
  }

  const sosMarkers = new Map();
  function loadSOS() {
    fetch('http://localhost:5000/api/sos')
      .then(function (response) {
        if (!response.ok) throw new Error('SOS locations failed with status ' + response.status);
        return response.json();
      })
      .then(function (result) {
        if (!result.success || !Array.isArray(result.data)) throw new Error('Invalid SOS response');
        const received = new Set();
        result.data.filter(function (sos) { return Number.isFinite(Number(sos.latitude)) && Number.isFinite(Number(sos.longitude)); }).forEach(function (sos) {
          received.add(sos._id);
          const coordinates = [Number(sos.latitude), Number(sos.longitude)];
          let marker = sosMarkers.get(sos._id);
          if (!marker) {
            marker = L.marker(coordinates, { icon: markerIcon('#DC2626', '🚨') }).addTo(layerGroups.sos);
            sosMarkers.set(sos._id, marker);
          } else {
            marker.setLatLng(coordinates);
          }
          marker.bindPopup('<strong>SOS: ' + (sos.userName || 'Warkari') + '</strong><br>' + (sos.emergencyType || 'Emergency') + '<br>Status: ' + sos.status + '<br>' + Number(sos.latitude).toFixed(5) + ', ' + Number(sos.longitude).toFixed(5));
        });
        sosMarkers.forEach(function (marker, id) {
          if (!received.has(id)) {
            layerGroups.sos.removeLayer(marker);
            sosMarkers.delete(id);
          }
        });
      })
      .catch(function (error) { console.error('SOS locations API error:', error); });
  }

  const switches = document.querySelectorAll('.settings-row .form-check-input');
  const layerNames = ['food', 'water', 'medical', 'police', 'volunteers'];
  switches.forEach(function (toggle, index) {
    const type = layerNames[index];
    toggle.addEventListener('change', function () {
      if (toggle.checked) map.addLayer(layerGroups[type]);
      else map.removeLayer(layerGroups[type]);
    });
  });

  startLocationWatch();
  loadVolunteers();
  loadSOS();
  setInterval(loadVolunteers, 10000);
  setInterval(loadSOS, 4000);
  setTimeout(function () { map.invalidateSize(); }, 0);
});
