/* ==========================================================
   Smart Wari Connect — Volunteer Dashboard Script
   ========================================================== */

/* ---------- Centralized language system (EN / MR / HI) ----------
   Applies to every Volunteer page that includes this file. Add more
   data-i18n="key" attributes + dictionary entries as pages are extended. */
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

  /* ---------- Accept SOS / request buttons -> move card to Active Assistance ---------- */
  document.querySelectorAll('.btn-req.accept').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const card = btn.closest('.sos-card, .swc-card');
      if (!card) return;
      btn.innerHTML = '<i class="bi bi-check2-circle"></i> Accepted';
      btn.disabled = true;
      btn.style.opacity = '.75';
      const activeList = document.getElementById('activeAssistanceList');
      if (activeList) {
        const name = card.querySelector('.req-name');
        const nameText = name ? name.textContent : 'Request';
        const row = document.createElement('div');
        row.className = 'active-card mb-2';
        row.innerHTML = '<i class="bi bi-person-check-fill fs-4" style="color:var(--emerald);"></i>' +
          '<div class="flex-grow-1"><div class="fw-semibold" style="font-size:.88rem;">' + nameText + '</div>' +
          '<div class="section-sub">Accepted just now · In progress</div></div>' +
          '<button class="btn-req resolve">Mark Resolved</button>';
        activeList.prepend(row);
      }
    });
  });

  /* ---------- Resolve buttons ---------- */
  document.addEventListener('click', function (e) {
    if (e.target.closest('.btn-req.resolve')) {
      const btn = e.target.closest('.btn-req.resolve');
      const row = btn.closest('.active-card, .sos-card, .swc-card');
      if (row) {
        row.style.transition = 'opacity .3s, transform .3s';
        row.style.opacity = '0';
        row.style.transform = 'translateX(20px)';
        setTimeout(function () { row.remove(); }, 300);
      }
    }
  });

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
