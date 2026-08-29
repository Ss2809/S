/* ==========================================================
   Smart Wari Connect — Volunteer Dashboard Script
   ========================================================== */

const VOLUNTEER_API_BASE = 'http://localhost:5000/api';
const CURRENT_VOLUNTEER = {
  id: 'SWCV-2026-1042',
  name: 'Anita Kulkarni',
  role: 'VOLUNTEER'
};

/* ---------- Centralized language system (EN / MR / HI) ---------- */
const SWC_I18N = {
  en: {
    dashboard: 'Dashboard', liveMap: 'Live Map', sosRequests: 'SOS Requests', warkariAssistance: 'Warkari Assistance',
    pwdAssistance: 'PWD Assistance',
    missingPersons: 'Missing Persons', emergencyVan: 'Emergency Van', medicalRequests: 'Medical Requests',
    routeInformation: 'Route Information', nearbyServices: 'Nearby Services', notifications: 'Notifications',
    myActivity: 'My Activity', profile: 'Profile', logout: 'Logout',
    emergencyVanTitle: 'Emergency Van & Response',
    emergencyVanSub: 'Accept medical emergencies, dispatch your van, track live GPS, and navigate straight to the Warkari in need.',
    volunteerAvailability: 'Volunteer Availability', availabilityHint: 'Only AVAILABLE volunteers receive new emergency requests.',
    statusAvailable: 'AVAILABLE', statusBusy: 'BUSY', statusEmergency: 'ON EMERGENCY', statusOffline: 'OFFLINE', statusIdle: 'IDLE',
    newMedicalEmergency: '🚨 NEW MEDICAL EMERGENCY', varkariId: 'Varkari ID: WK-7734', jejuriRoadCrossing: 'Jejuri Road Crossing',
    emergencyTypeCardiac: 'Cardiac Distress', emergencyTypeFall: 'Fall / Injury', emergencyTypeHeatstroke: 'Heatstroke',
    description: 'Description', emergencyDescSample: 'Elderly Warkari reporting chest pain and breathlessness near the road crossing.',
    currentWariStop: 'Current Wari Stop', acceptRequest: 'ACCEPT REQUEST', rejectRequest: 'REJECT REQUEST',
    emergencyStatus: 'Emergency Status', gpsOff: 'GPS OFF', gpsLive: 'GPS LIVE',
    wfPending: 'PENDING', wfAccepted: 'ACCEPTED', wfStarted: 'STARTED', wfOnWay: 'ON THE WAY', wfArrived: 'ARRIVED', wfCompleted: 'COMPLETED',
    startEmergency: 'Start', navigateToVarkari: '🧭 NAVIGATE TO VARKARI', liveEmergencyMap: 'Live Emergency Map',
    varkariLocation: 'Varkari', medicalCenter: 'Medical Center', emergencyHistory: 'Emergency History',
    emergencyId: 'Emergency ID', varkariIdCol: 'Varkari ID', emergencyType: 'Type', wariStop: 'Wari Stop', vanNumber: 'Van',
    requestTime: 'Requested', arrivalTime: 'Arrived', completionTime: 'Completed', status: 'Status',
    emergencyMedicalVan: 'Emergency Medical Van', assignedEmergency: 'Assigned Emergency', currentGps: 'Current GPS', lastUpdated: 'Last Updated',
    myWariStop: 'My Wari Stop', assigned: 'Assigned', previousStop: 'Previous: Saswad', nextStop: 'Next: Valhe',
    emergencyNotifications: 'Emergency Notifications', notifNewEmergency: 'New medical emergency assigned to you.'
  },
  mr: {
    dashboard: 'डॅशबोर्ड', liveMap: 'लाइव्ह नकाशा', sosRequests: 'एसओएस विनंत्या', warkariAssistance: 'वारकरी सहाय्य',
    pwdAssistance: 'दिव्यांग सहाय्य',
    missingPersons: 'हरवलेल्या व्यक्ती', emergencyVan: 'आपत्कालीन वाहन', medicalRequests: 'वैद्यकीय विनंत्या',
    routeInformation: 'मार्ग माहिती', nearbyServices: 'जवळील सेवा', notifications: 'सूचना',
    myActivity: 'माझी क्रियाकलाप', profile: 'प्रोफाइल', logout: 'लॉगआउट',
    emergencyVanTitle: 'आपत्कालीन वाहन आणि प्रतिसाद',
    emergencyVanSub: 'वैद्यकीय आपत्कालीन स्थिती स्वीकारा, वाहन पाठवा, लाइव्ह जीपीएस ट्रॅक करा आणि वारकऱ्यापर्यंत थेट मार्गक्रमण करा.',
    volunteerAvailability: 'स्वयंसेवक उपलब्धता', availabilityHint: 'फक्त उपलब्ध स्वयंसेवकांना नवीन आपत्कालीन विनंत्या मिळतात.',
    statusAvailable: 'उपलब्ध', statusBusy: 'व्यस्त', statusEmergency: 'आपत्कालीन कार्यरत', statusOffline: 'ऑफलाइन', statusIdle: 'रिकामे',
    newMedicalEmergency: '🚨 नवीन वैद्यकीय आपत्कालीन स्थिती', varkariId: 'वारकरी आयडी: WK-7734', jejuriRoadCrossing: 'जेजुरी रोड क्रॉसिंग',
    emergencyTypeCardiac: 'हृदयविकाराचा त्रास', emergencyTypeFall: 'पडणे / दुखापत', emergencyTypeHeatstroke: 'उष्माघात',
    description: 'वर्णन', emergencyDescSample: 'वयोवृद्ध वारकऱ्याला छातीत दुखणे व श्वास घेण्यास त्रास होत आहे.',
    currentWariStop: 'सध्याचा वारी थांबा', acceptRequest: 'विनंती स्वीकारा', rejectRequest: 'विनंती नाकारा',
    emergencyStatus: 'आपत्कालीन स्थिती', gpsOff: 'जीपीएस बंद', gpsLive: 'जीपीएस लाइव्ह',
    wfPending: 'प्रलंबित', wfAccepted: 'स्वीकारले', wfStarted: 'सुरू केले', wfOnWay: 'मार्गावर', wfArrived: 'पोहोचले', wfCompleted: 'पूर्ण झाले',
    startEmergency: 'सुरू करा', navigateToVarkari: '🧭 वारकऱ्याकडे मार्गक्रमण करा', liveEmergencyMap: 'लाइव्ह आपत्कालीन नकाशा',
    varkariLocation: 'वारकरी', medicalCenter: 'वैद्यकीय केंद्र', emergencyHistory: 'आपत्कालीन इतिहास',
    emergencyId: 'आपत्कालीन आयडी', varkariIdCol: 'वारकरी आयडी', emergencyType: 'प्रकार', wariStop: 'वारी थांबा', vanNumber: 'वाहन',
    requestTime: 'विनंती वेळ', arrivalTime: 'पोहोचल्याची वेळ', completionTime: 'पूर्ण झाल्याची वेळ', status: 'स्थिती',
    emergencyMedicalVan: 'आपत्कालीन वैद्यकीय वाहन', assignedEmergency: 'नियुक्त आपत्कालीन', currentGps: 'सध्याचे जीपीएस', lastUpdated: 'शेवटचे अद्ययावत',
    myWariStop: 'माझा वारी थांबा', assigned: 'नियुक्त', previousStop: 'मागील: सासवड', nextStop: 'पुढील: वाल्हे',
    emergencyNotifications: 'आपत्कालीन सूचना', notifNewEmergency: 'तुम्हाला नवीन वैद्यकीय आपत्कालीन स्थिती नियुक्त केली आहे.'
  },
  hi: {
    dashboard: 'डैशबोर्ड', liveMap: 'लाइव मैप', sosRequests: 'एसओएस अनुरोध', warkariAssistance: 'वारकरी सहायता',
    pwdAssistance: 'दिव्यांग सहायता',
    missingPersons: 'लापता व्यक्ति', emergencyVan: 'आपातकालीन वाहन', medicalRequests: 'चिकित्सा अनुरोध',
    routeInformation: 'मार्ग जानकारी', nearbyServices: 'आस-पास की सेवाएं', notifications: 'सूचनाएं',
    myActivity: 'मेरी गतिविधि', profile: 'प्रोफ़ाइल', logout: 'लॉगआउट',
    emergencyVanTitle: 'आपातकालीन वाहन और प्रतिक्रिया',
    emergencyVanSub: 'चिकित्सा आपातकाल स्वीकार करें, अपना वाहन भेजें, लाइव जीपीएस ट्रैक करें और सीधे वारकरी तक पहुंचें।',
    volunteerAvailability: 'स्वयंसेवक उपलब्धता', availabilityHint: 'केवल उपलब्ध स्वयंसेवकों को नए आपातकालीन अनुरोध मिलते हैं।',
    statusAvailable: 'उपलब्ध', statusBusy: 'व्यस्त', statusEmergency: 'आपातकाल में', statusOffline: 'ऑफलाइन', statusIdle: 'खाली',
    newMedicalEmergency: '🚨 नया चिकित्सा आपातकाल', varkariId: 'वारकरी आईडी: WK-7734', jejuriRoadCrossing: 'जेजुरी रोड क्रॉसिंग',
    emergencyTypeCardiac: 'हृदय संबंधी तकलीफ', emergencyTypeFall: 'गिरना / चोट', emergencyTypeHeatstroke: 'लू लगना',
    description: 'विवरण', emergencyDescSample: 'बुजुर्ग वारकरी को सीने में दर्द और सांस लेने में तकलीफ हो रही है।',
    currentWariStop: 'वर्तमान वारी पड़ाव', acceptRequest: 'अनुरोध स्वीकारें', rejectRequest: 'अनुरोध अस्वीकारें',
    emergencyStatus: 'आपातकालीन स्थिति', gpsOff: 'जीपीएस बंद', gpsLive: 'जीपीएस लाइव',
    wfPending: 'लंबित', wfAccepted: 'स्वीकृत', wfStarted: 'शुरू', wfOnWay: 'रास्ते में', wfArrived: 'पहुंच गए', wfCompleted: 'पूर्ण',
    startEmergency: 'शुरू करें', navigateToVarkari: '🧭 वारकरी की ओर चलें', liveEmergencyMap: 'लाइव आपातकालीन मैप',
    varkariLocation: 'वारकरी', medicalCenter: 'चिकित्सा केंद्र', emergencyHistory: 'आपातकालीन इतिहास',
    emergencyId: 'आपातकालीन आईडी', varkariIdCol: 'वारकरी आईडी', emergencyType: 'प्रकार', wariStop: 'वारी पड़ाव', vanNumber: 'वाहन',
    requestTime: 'अनुरोध समय', arrivalTime: 'पहुंचने का समय', completionTime: 'पूर्ण होने का समय', status: 'स्थिति',
    emergencyMedicalVan: 'आपातकालीन चिकित्सा वाहन', assignedEmergency: 'नियुक्त आपातकाल', currentGps: 'वर्तमान जीपीएस', lastUpdated: 'अंतिम अद्यतन',
    myWariStop: 'मेरा वारी पड़ाव', assigned: 'नियुक्त', previousStop: 'पिछला: सासवड', nextStop: 'अगला: वाल्हे',
    emergencyNotifications: 'आपातकालीन सूचनाएं', notifNewEmergency: 'आपको एक नया चिकित्सा आपातकाल सौंपा गया है।'
  }
};

function swcApplyLanguage(lang) {
  const dict = SWC_I18N[lang] || SWC_I18N.en;
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      if (el.tagName === 'TITLE') el.textContent = dict[key];
      else el.textContent = dict[key];
    }
  });
  document.querySelectorAll('.lang-switch .dropdown-item').forEach(function (item) {
    item.classList.toggle('active-lang', item.getAttribute('data-lang') === lang);
  });
  localStorage.setItem('swc_lang', lang);
  document.documentElement.setAttribute('lang', lang);
}

// Start volunteer GPS live broadcast to backend
document.addEventListener("DOMContentLoaded", () => {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      async (pos) => {
        try {
          await fetch(`${VOLUNTEER_API_BASE}/locations/update`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: CURRENT_VOLUNTEER.id,
              name: CURRENT_VOLUNTEER.name,
              role: CURRENT_VOLUNTEER.role,
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            })
          });
        } catch (e) {}
      },
      (err) => console.warn("Volunteer GPS notice:", err.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
  }
});

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Language switcher ---------- */
  const savedLang = localStorage.getItem('swc_lang') || 'en';
  swcApplyLanguage(savedLang);
  document.querySelectorAll('.lang-switch [data-lang]').forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      swcApplyLanguage(item.getAttribute('data-lang'));
    });
  });

  /* ---------- Availability toggle ---------- */
  const availBtn = document.getElementById('availToggle');
  const availStates = [
    { cls: '', label: 'Available for Assistance' },
    { cls: 'busy', label: 'Busy — Limited Requests' },
    { cls: 'offline', label: 'Offline' }
  ];
  let availIndex = 0;
  if (availBtn) {
    availBtn.addEventListener('click', function () {
      availIndex = (availIndex + 1) % availStates.length;
      const state = availStates[availIndex];
      availBtn.className = 'avail-toggle' + (state.cls ? ' ' + state.cls : '');
      availBtn.querySelector('.avail-label').textContent = state.label;
    });
  }

  /* ---------- Real SOS requests from backend ---------- */
  const volunteerSosList = document.getElementById('volunteerSosList');
  const activeAssistanceList = document.getElementById('activeAssistanceList');
  const SOS_API_BASE = `${VOLUNTEER_API_BASE}/sos`;

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

  function formatSosTime(value) {
    if (!value) return 'Just now';
    const created = new Date(value);
    if (Number.isNaN(created.getTime())) return escapeHtml(value);

    const diffMs = Date.now() - created.getTime();
    const diffMins = Math.max(0, Math.floor(diffMs / 60000));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return diffMins + ' min ago';

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return diffHours + ' hr ago';

    return created.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function renderVolunteerSosRequests(requests) {
    if (!volunteerSosList) return;

    const pendingRequests = requests.filter(function (sos) {
      return sos && (sos.status === 'PENDING' || sos.status === 'ASSIGNED');
    });

    if (!pendingRequests.length) {
      volunteerSosList.innerHTML =
        '<div class="col-12"><div class="swc-card text-center text-muted py-4">' +
        '<i class="bi bi-check2-circle fs-3 d-block mb-2" style="color:var(--emerald);"></i>' +
        'No pending SOS requests right now.' +
        '</div></div>';
    } else {
      volunteerSosList.innerHTML = pendingRequests.map(function (sos) {
        const id = escapeHtml(sos._id);
        const userName = escapeHtml(sos.userName || 'Unknown Warkari');
        const emergencyType = escapeHtml(sos.emergencyType || 'Emergency SOS');
        const message = escapeHtml(sos.message || '');
        const latitude = Number(sos.latitude);
        const longitude = Number(sos.longitude);
        const hasLocation = Number.isFinite(latitude) && Number.isFinite(longitude);
        const locationText = hasLocation
          ? 'Lat: ' + latitude.toFixed(5) + ', Lng: ' + longitude.toFixed(5)
          : 'Location unavailable';
        const mapsUrl = hasLocation
          ? 'https://www.google.com/maps?q=' + encodeURIComponent(latitude + ',' + longitude)
          : '#';

        return `
        <div class="sos-card mb-3" data-sos-card="${id}">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <span class="sos-tag"><span class="dot"></span>SOS REQUEST</span>
            <span class="section-sub">${formatSosTime(sos.createdAt)}</span>
          </div>
          <div class="d-flex gap-3 align-items-center mb-3">
            <img src="images/warkari-photo.svg" class="req-photo" alt="${userName}">
            <div class="flex-grow-1">
              <div class="req-name">${userName}</div>
              <div class="req-meta"><i class="bi bi-geo-alt-fill me-1"></i>${escapeHtml(locationText)}</div>
              <span class="req-pill" style="background:#FEE2E2; color:var(--sos);">${emergencyType}</span>
              ${message ? `<div class="section-sub mt-1">${message}</div>` : ''}
            </div>
          </div>
          <div class="row g-2">
            <div class="col-6 col-md-3"><button class="btn-req accept w-100" data-sos-id="${id}"><i class="bi bi-check2-circle"></i>Accept</button></div>
            <div class="col-6 col-md-3"><a class="btn-req navigate w-100" href="${mapsUrl}" target="_blank" rel="noopener"><i class="bi bi-compass"></i>Navigate</a></div>
            <div class="col-6 col-md-3"><a href="tel:+919812345600" class="btn-req call w-100"><i class="bi bi-telephone-fill"></i>Call</a></div>
            <div class="col-6 col-md-3"><button class="btn-req resolve w-100" data-sos-id="${id}"><i class="bi bi-flag"></i>Resolved</button></div>
          </div>
        </div>`;
      }).join('');
    }

    // Also update Active Assistance list
    if (activeAssistanceList) {
      const activeMine = requests.filter(function (sos) {
        const isMine = sos.assignedVolunteerId === CURRENT_VOLUNTEER.id || sos.assignedVolunteerName === CURRENT_VOLUNTEER.name;
        return isMine && ['ACCEPTED', 'ON_THE_WAY', 'REACHED'].includes(sos.status);
      });

      if (!activeMine.length) {
        activeAssistanceList.innerHTML = '<div class="text-muted small">No active SOS assistance right now.</div>';
      } else {
        activeAssistanceList.innerHTML = activeMine.map(function (sos) {
          const id = escapeHtml(sos._id);
          const userName = escapeHtml(sos.userName || 'Warkari');
          const type = escapeHtml(sos.emergencyType || 'Emergency SOS');
          return `
          <div class="active-card mb-2" data-active-sos="${id}">
            <i class="bi bi-person-check-fill fs-4" style="color:var(--emerald);"></i>
            <div class="flex-grow-1">
              <div class="fw-semibold" style="font-size:.88rem;">${userName} — ${type}</div>
              <div class="section-sub">Accepted · Status: <span class="badge bg-warning text-dark">${sos.status}</span></div>
            </div>
            <button class="btn-req resolve" data-sos-id="${id}">Mark Resolved</button>
          </div>`;
        }).join('');
      }
    }
  }

  async function loadVolunteerSOS() {
    if (!volunteerSosList && !activeAssistanceList) return;

    try {
      const response = await fetch(SOS_API_BASE);
      if (!response.ok) throw new Error('SOS request failed with status ' + response.status);

      const result = await response.json();
      if (!result.success || !Array.isArray(result.data)) throw new Error('Invalid SOS response');

      renderVolunteerSosRequests(result.data);
    } catch (error) {
      console.warn('[Volunteer SOS] Load notice:', error.message);
    }
  }

  async function updateSosStatus(sosId, status) {
    const response = await fetch(SOS_API_BASE + '/' + encodeURIComponent(sosId) + '/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: status })
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Unable to update SOS status');
    }
    return result.data;
  }

  // Handle Accept / Resolve click events on SOS
  document.addEventListener('click', async function (e) {
    const acceptBtn = e.target.closest('.btn-req.accept[data-sos-id]');
    const resolveBtn = e.target.closest('.btn-req.resolve[data-sos-id]');

    if (!acceptBtn && !resolveBtn) return;

    e.preventDefault();
    e.stopPropagation();

    const btn = acceptBtn || resolveBtn;
    const sosId = btn.getAttribute('data-sos-id');
    if (!sosId) return;

    btn.disabled = true;

    try {
      if (acceptBtn) {
        const assignResponse = await fetch(SOS_API_BASE + '/' + encodeURIComponent(sosId) + '/assign', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assignedVolunteerId: CURRENT_VOLUNTEER.id,
            assignedVolunteerName: CURRENT_VOLUNTEER.name
          })
        });
        const assignResult = await assignResponse.json();
        if (!assignResponse.ok || !assignResult.success) {
          throw new Error(assignResult.message || 'Unable to assign SOS request');
        }

        await updateSosStatus(sosId, 'ACCEPTED');
        alert('SOS accepted. Warkari and Admin notified.');
      } else {
        await updateSosStatus(sosId, 'RESOLVED');
        alert('SOS marked as resolved.');
      }

      await loadVolunteerSOS();
      await loadVolunteerDashboardStats();
    } catch (error) {
      console.error('[Volunteer SOS] Action failed:', error);
      alert(error.message || 'SOS action failed');
      btn.disabled = false;
    }
  });

  if (volunteerSosList || activeAssistanceList) {
    loadVolunteerSOS();
    setInterval(loadVolunteerSOS, 3000);
  }

  /* ---------- Volunteer Dashboard Real KPI Counts ---------- */
  async function loadVolunteerDashboardStats() {
    try {
      const res = await fetch(`${VOLUNTEER_API_BASE}/stats/volunteer?volunteerId=${CURRENT_VOLUNTEER.id}&volunteerName=${encodeURIComponent(CURRENT_VOLUNTEER.name)}`);
      if (!res.ok) return;
      const result = await res.json();
      if (!result.success || !result.data) return;

      const data = result.data;

      // 5 Top Stat Numbers
      const statNums = document.querySelectorAll('.stat-num');
      if (statNums.length >= 5) {
        statNums[0].textContent = data.totalSos ?? 3;
        statNums[1].textContent = data.totalMissing ?? 2;
        statNums[2].textContent = data.totalMedical ?? 5;
        statNums[3].textContent = data.totalPendingAssist ?? 7;
        statNums[4].textContent = data.totalPwdRequests ?? 4;
      }

      // Emergency Overview Cards
      const overviewValues = document.querySelectorAll('.row.g-3.mb-4 .fw-bold');
      if (overviewValues.length >= 5) {
        overviewValues[3].textContent = data.activeEmergencies ?? 0;
        overviewValues[4].textContent = data.requestsCompleted ?? 18;
      }

      // Profile / Banner items
      const volItems = document.querySelectorAll('.vol-item .value');
      if (volItems.length >= 5) {
        volItems[1].textContent = `${data.activeEmergencies + data.activePwdAssistance + 14} Warkaris`;
        volItems[2].textContent = `${data.rating || '4.8'} / 5`;
        volItems[4].textContent = `${data.requestsCompleted || 312} Warkaris`;
      }
    } catch (e) {
      console.warn('[Volunteer Stats] Notice:', e.message);
    }
  }

  loadVolunteerDashboardStats();
  setInterval(loadVolunteerDashboardStats, 5000);

  /* ---------- Volunteer Notifications ---------- */
  async function loadVolunteerNotifications() {
    try {
      const res = await fetch(`${VOLUNTEER_API_BASE}/notifications?audience=VOLUNTEER`);
      if (!res.ok) return;
      const result = await res.json();
      if (!result.success || !Array.isArray(result.data)) return;

      const offcanvasBody = document.querySelector('#notifOffcanvas .offcanvas-body');
      if (offcanvasBody && result.data.length > 0) {
        const offcanvasItems = result.data.slice(0, 5).map(n => {
          let bg = '#FEE2E2';
          let ic = 'bi-exclamation-octagon-fill text-danger';
          if (n.type.includes('PWD')) { bg = 'var(--pwd-10)'; ic = 'bi-universal-access-circle text-primary'; }
          else if (n.title.toLowerCase().includes('rain')) { bg = '#DBEAFE'; ic = 'bi-cloud-rain-fill text-primary'; }

          const diffMins = Math.max(0, Math.floor((Date.now() - new Date(n.createdAt).getTime()) / 60000));
          const timeLabel = diffMins < 1 ? 'Just now' : (diffMins < 60 ? `${diffMins} min ago` : `${Math.floor(diffMins/60)} hr ago`);

          return `<div class="notif-item"><div class="notif-ic" style="background:${bg};"><i class="bi ${ic}"></i></div>
            <div><div class="fw-semibold" style="font-size:.86rem;">${escapeHtml(n.title)}: ${escapeHtml(n.message)}</div><div class="notif-time">${timeLabel}</div></div></div>`;
        }).join('');

        const viewAllBtn = '<a href="notifications.html" class="btn w-100 mt-2" style="background:var(--emerald-10); color:var(--emerald); font-weight:600; border-radius:10px;">View All Notifications</a>';
        offcanvasBody.innerHTML = offcanvasItems + viewAllBtn;
      }

      // Check unread count
      const countRes = await fetch(`${VOLUNTEER_API_BASE}/notifications/unread-count?audience=VOLUNTEER`);
      if (countRes.ok) {
        const countData = await countRes.json();
        const dots = document.querySelectorAll('.notif-dot');
        dots.forEach(dot => {
          dot.style.display = countData.unreadCount > 0 ? '' : 'none';
        });
      }
    } catch (e) {}
  }

  loadVolunteerNotifications();
  setInterval(loadVolunteerNotifications, 8000);


  /* ---------- Map filter chips ---------- */
  document.querySelectorAll('.map-filter-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.map-filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  /* ---------- Generic tabs ---------- */
  document.querySelectorAll('.wc-tab[data-tab-target]').forEach(function (tab) {
    tab.addEventListener('click', function () {
      const target = tab.getAttribute('data-tab-target');
      document.querySelectorAll('.wc-tab[data-tab-target]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.tab-pane-content').forEach(function (pane) {
        pane.style.display = (pane.id === target) ? '' : 'none';
      });
    });
  });

  /* ---------- Notification filter tabs ---------- */
  document.querySelectorAll('.wc-tab[data-filter]').forEach(function (tab) {
    tab.addEventListener('click', function () {
      const filter = tab.getAttribute('data-filter');
      document.querySelectorAll('.wc-tab[data-filter]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.notif-item[data-category]').forEach(function (item) {
        item.style.display = (filter === 'all' || item.getAttribute('data-category') === filter) ? '' : 'none';
      });
    });
  });

  /* ---------- Simple form submit feedback ---------- */
  document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const alertBox = form.querySelector('.form-success-alert');
      if (alertBox) {
        alertBox.classList.remove('d-none');
        setTimeout(function () { alertBox.classList.add('d-none'); }, 3500);
      }
    });
  });

});
