

const SWC_API_BASE = 'http://localhost:5000/api';
const CURRENT_WARKARI = {
  id: 'SWC-2026-08412',
  name: 'Sunil Bhosale',
  role: 'WARKARI'
};

// Global GPS tracking across all Warkari pages
document.addEventListener("DOMContentLoaded", () => {
  if (!navigator.geolocation) {
    console.warn("Geolocation is not supported by this browser");
    return;
  }

  navigator.geolocation.watchPosition(
    async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      window.swcLiveLocation = { lat: latitude, lng: longitude, label: 'Live GPS location' };

      try {
        await fetch(`${SWC_API_BASE}/locations/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: CURRENT_WARKARI.id,
            name: CURRENT_WARKARI.name,
            role: CURRENT_WARKARI.role,
            latitude,
            longitude
          })
        });
      } catch (e) {
        // Silent catch for local network resilience
      }
    },
    (error) => {
      console.warn("GPS Notice:", error.message);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000
    }
  );
});

function initSmartWariApp() {

  /* ---------- Floating AI widget ---------- */
  const aiFab = document.getElementById('aiFabBtn');
  const aiPanel = document.getElementById('aiPanel');
  const aiClose = document.getElementById('aiCloseBtn');
  const mobileAi = document.getElementById('mobileAiBtn');

  function toggleAi() {
    if (aiPanel) aiPanel.classList.toggle('show');
  }
  if (aiFab) aiFab.addEventListener('click', toggleAi);
  if (aiClose) aiClose.addEventListener('click', toggleAi);
  if (mobileAi) {
    mobileAi.addEventListener('click', function (e) {
      if (aiPanel) {
        e.preventDefault();
        toggleAi();
      }
    });
  }

  /* ---------- Full page AI chat & Floating widget integration ---------- */
  function getChatWindow() {
    return document.getElementById('chatWindow') || document.querySelector('.chat-window');
  }

  const botReplies = {
    halt: 'आजचा मुक्काम जेजुरी येथे आहे, साधारण संध्याकाळी ६:३० वाजता पोहोचाल.',
    food: 'सर्वात जवळचे अन्नछत्र 0.4 किमी अंतरावर आहे आणि सध्या सुरू आहे.',
    water: 'जवळचा पाणी पॉईंट 0.2 किमी अंतरावर सासवड टँकर पॉईंटवर आहे.',
    medical: 'जवळचा वारी मेडिकल कॅम्प 0.6 किमी वर आहे, सध्या थोडा व्यस्त आहे.',
    weather: 'आज पावसाची शक्यता 65% आहे, जेजुरीजवळ जास्त पाऊस अपेक्षित आहे.',
    route: 'पुढचा मार्ग: सासवड → जेजुरी → लोणंद → फलटण.',
    sos: 'आपत्कालीन परिस्थितीत SOS बटन दाबा. तुमची live location Admin आणि Volunteer team कडे पाठवली जाईल.',
    pwd: 'PWD Assistance विभागातून व्हीलचेअर, चालण्यासाठी मदत किंवा इतर विशेष मदतीची विनंती पाठवू शकता.',
    default: 'मला हा प्रश्न पूर्णपणे समजला नाही. तुम्ही मुक्काम, route, food, water, medical, weather, SOS किंवा PWD assistance बद्दल विचारू शकता.'
  };

  function addMessage(message, type) {
    const chatWindow = getChatWindow();
    if (!chatWindow) return;

    const row = document.createElement('div');
    row.className = 'msg-row ' + type;

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar ' + type;
    const icon = document.createElement('i');
    icon.className = 'bi ' + (type === 'bot' ? 'bi-robot' : 'bi-person-fill');
    avatar.appendChild(icon);

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble devnagri';
    bubble.textContent = message;

    row.appendChild(avatar);
    row.appendChild(bubble);
    chatWindow.appendChild(row);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function getAiAnswerFallback(question) {
    const raw = String(question || '').trim().toLowerCase();
    if (!raw) return botReplies.default;

    const has = (terms) => {
      return terms.some(term => {
        if (/^[a-z0-9]+$/i.test(term)) {
          const reg = new RegExp('\\b' + term + '\\b', 'i');
          return reg.test(raw);
        } else {
          return raw.includes(term.toLowerCase());
        }
      });
    };

    if (has([
      'sos', 'emergency', 'urgent', 'panic', 'danger', 'accident', 'rescue', 'police',
      'आपत्काल', 'आपत्कालीन', 'आणीबाणी', 'संकट', 'आपातकाल', 'आपातकालीन', 'इमरजेंसी',
      'पोलीस', 'मदत हवी', 'तुरंत मदद', 'help me', 'save me', 'aapatkal', 'bachao'
    ])) {
      return botReplies.sos;
    }

    if (has([
      'pwd', 'divyang', 'wheelchair', 'disability', 'disabled', 'handicap', 'elderly',
      'senior citizen', 'blind', 'deaf', 'walker', 'walking assistance',
      'दिव्यांग', 'अपंग', 'विकलांग', 'व्हीलचेअर', 'व्हीलचेयर', 'ज्येष्ठ नागरिक', 'वृद्ध', 'बुजुर्ग',
      'चालण्यासाठी मदत', 'चलने में मदद'
    ])) {
      return botReplies.pwd;
    }

    if (has([
      'medical', 'doctor', 'hospital', 'clinic', 'ambulance', 'first aid', 'medicine',
      'health', 'sick', 'injury', 'injured', 'pain', 'dawa', 'aushadh',
      'वैद्यकीय', 'डॉक्टर', 'रुग्णालय', 'दवाखाना', 'औषध', 'प्रथमोपचार', 'आरोग्य', 'आजारी'
    ])) {
      return botReplies.medical;
    }

    if (has([
      'weather', 'rain', 'raining', 'rainy', 'cloudy', 'temperature', 'forecast', 'climate', 'monsoon',
      'paus', 'barish', 'havaman', 'पाऊस', 'हवामान', 'तापमान', 'मौसम', 'बारिश'
    ])) {
      return botReplies.weather;
    }

    if (has([
      'water', 'drinking water', 'tanker', 'pani', 'paani', 'jal', 'thirst',
      'पाणी', 'पाण्या', 'पानी', 'जल', 'टँकर'
    ])) {
      return botReplies.water;
    }

    if (has([
      'food', 'meal', 'lunch', 'dinner', 'breakfast', 'eat', 'jevan', 'khana',
      'annachhatra', 'anna', 'prasad', 'mahaprasad', 'अन्नछत्र', 'अन्न', 'जेवण', 'महाप्रसाद'
    ])) {
      return botReplies.food;
    }

    if (has([
      'route', 'rasta', 'raasta', 'marg', 'path', 'direction', 'destination', 'navigation',
      'next stop', 'मार्ग', 'रस्ता', 'दिशा'
    ])) {
      return botReplies.route;
    }

    if (has([
      'halt', 'mukkam', 'mukkaam', 'padav', 'stay', 'night stop', 'night stay',
      'मुक्काम', 'थांब', 'विश्राम', 'पड़ाव'
    ])) {
      return botReplies.halt;
    }

    return botReplies.default;
  }

  async function sendAiQuestion(question) {
    const cleanQuestion = String(question || '').trim();
    if (!cleanQuestion) return;

    const chatWindow = getChatWindow();
    if (chatWindow) {
      addMessage(cleanQuestion, 'user');

      try {
        const response = await fetch(`${SWC_API_BASE}/chatbot/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: cleanQuestion,
            userId: CURRENT_WARKARI.id,
            userName: CURRENT_WARKARI.name
          })
        });
        const result = await response.json();
        if (result.success && result.data && result.data.answer) {
          addMessage(result.data.answer, 'bot');
          return;
        }
      } catch (e) {
        console.warn("Chatbot API fallback to offline model:", e);
      }

      setTimeout(function () {
        const answer = getAiAnswerFallback(cleanQuestion);
        addMessage(answer, 'bot');
      }, 300);
    } else {
      window.location.href = 'ai-assistant.html?q=' + encodeURIComponent(cleanQuestion);
    }
  }

  // Handle suggested question chip clicks
  document.addEventListener('click', function (e) {
    const chip = e.target.closest('.ai-chip');
    if (!chip) return;

    chip.style.background = 'var(--emerald-10)';
    chip.style.borderColor = 'var(--emerald)';
    setTimeout(function () {
      chip.style.background = '';
      chip.style.borderColor = '';
    }, 600);

    const question = chip.getAttribute('data-question') || chip.textContent.trim();
    sendAiQuestion(question);
  });

  // Handle full-page chat form submission
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');

  function handleChatSubmit(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const input = document.getElementById('chatInput') || (chatForm && chatForm.querySelector('input'));
    if (!input) return;
    const question = input.value.trim();
    if (!question) return;
    input.value = '';
    sendAiQuestion(question);
  }

  if (chatForm) {
    chatForm.addEventListener('submit', handleChatSubmit);
  }

  if (chatInput) {
    chatInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        handleChatSubmit(e);
      }
    });
  }

  // Floating AI panel input submit handler
  if (aiPanel && !getChatWindow()) {
    const panelInput = aiPanel.querySelector('input');
    const panelSendBtn = aiPanel.querySelector('button:not(#aiCloseBtn)');
    const handlePanelSubmit = function (e) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      if (!panelInput) return;
      const q = panelInput.value.trim();
      if (!q) return;
      panelInput.value = '';
      sendAiQuestion(q);
    };
    if (panelSendBtn) panelSendBtn.addEventListener('click', handlePanelSubmit);
    if (panelInput) {
      panelInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          handlePanelSubmit(e);
        }
      });
    }
  }

  // Handle URL query parameter on ai-assistant.html load (e.g., ?q=...)
  const liveChatWindow = getChatWindow();
  if (liveChatWindow) {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const initialQ = urlParams.get('q') || urlParams.get('question');
      if (initialQ) {
        sendAiQuestion(initialQ);
      }
    } catch (e) {
      console.error('Error reading URL question:', e);
    }
  }

  /* ---------- Notifications Backend Integration ---------- */
  async function loadWarkariNotifications() {
    try {
      const res = await fetch(`${SWC_API_BASE}/notifications?audience=WARKARI`);
      if (!res.ok) return;
      const result = await res.json();
      if (!result.success || !Array.isArray(result.data)) return;

      const notifListContainer = document.querySelector('.swc-card .notif-item')?.parentElement;
      const offcanvasBody = document.querySelector('#notifOffcanvas .offcanvas-body');

      if (notifListContainer && window.location.pathname.includes('notifications.html') && result.data.length > 0) {
        const itemsHtml = result.data.map(n => {
          let bg = '#FEF3C7';
          let ic = 'bi-bell-fill text-warning';
          let cat = 'weather';

          if (n.type.includes('SOS')) { bg = '#FEE2E2'; ic = 'bi-shield-check text-danger'; cat = 'emergency'; }
          else if (n.type.includes('PWD')) { bg = '#EDE9FE'; ic = 'bi-universal-access-circle text-primary'; cat = 'medical'; }
          else if (n.title.toLowerCase().includes('medical')) { bg = 'var(--emerald-10)'; ic = 'bi-heart-pulse text-success'; cat = 'medical'; }
          else if (n.title.toLowerCase().includes('road')) { bg = 'var(--saffron-10)'; ic = 'bi-signpost-split text-warning'; cat = 'road'; }

          const timeAgo = formatTimeAgo(n.createdAt);

          return `<div class="notif-item" data-category="${cat}">
            <div class="notif-ic" style="background:${bg};"><i class="bi ${ic}"></i></div>
            <div class="flex-grow-1">
              <div class="fw-semibold">${escapeHtml(n.title)}</div>
              <div class="section-sub">${escapeHtml(n.message)}</div>
              <div class="notif-time">${timeAgo}</div>
            </div>
          </div>`;
        }).join('');

        notifListContainer.innerHTML = itemsHtml;
      }

      if (offcanvasBody && result.data.length > 0) {
        const offcanvasItems = result.data.slice(0, 5).map(n => {
          let bg = '#FEF3C7';
          let ic = 'bi-bell text-warning';
          if (n.type.includes('SOS')) { bg = '#FEE2E2'; ic = 'bi-shield-check text-danger'; }
          else if (n.type.includes('PWD')) { bg = '#EDE9FE'; ic = 'bi-universal-access text-primary'; }
          const timeAgo = formatTimeAgo(n.createdAt);

          return `<div class="notif-item">
            <div class="notif-ic" style="background:${bg};"><i class="bi ${ic}"></i></div>
            <div><div class="fw-semibold" style="font-size:.86rem;">${escapeHtml(n.title)}: ${escapeHtml(n.message)}</div><div class="notif-time">${timeAgo}</div></div>
          </div>`;
        }).join('');

        const viewAllBtn = '<a class="btn w-100 mt-2" href="notifications.html" style="background:var(--saffron-10); color:var(--deep-orange); font-weight:600; border-radius:10px;">View All Notifications</a>';
        offcanvasBody.innerHTML = offcanvasItems + viewAllBtn;
      }

      // Check unread count
      const countRes = await fetch(`${SWC_API_BASE}/notifications/unread-count?audience=WARKARI`);
      if (countRes.ok) {
        const countData = await countRes.json();
        const dots = document.querySelectorAll('.notif-dot');
        dots.forEach(dot => {
          dot.style.display = countData.unreadCount > 0 ? '' : 'none';
        });
      }
    } catch (e) {
      console.warn("Notifications fetch error:", e);
    }
  }

  function formatTimeAgo(isoString) {
    if (!isoString) return 'Just now';
    const date = new Date(isoString);
    const mins = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
    if (mins < 1) return 'Just now';
    if (mins < 60) return mins + ' min ago';
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + ' hr ago';
    return date.toLocaleDateString();
  }

  loadWarkariNotifications();
  setInterval(loadWarkariNotifications, 8000);

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

  /* ==========================================================
     🚨 Global SOS Emergency Modal & Submission
     ========================================================== */
  let pendingSosLinkId = null;

  function initSosEmergency() {
    const sosModalEl = document.getElementById('sosModal');
    const sosConfirmBtn = document.getElementById('sosConfirmBtn');
    let sosSubmitting = false;

    // Fallback click handler to guarantee modal opens if Bootstrap data attribute fails
    document.addEventListener('click', function (e) {
      const trigger = e.target.closest('[data-bs-target="#sosModal"], .qa-sos, .em-btn.primary, .mobile-sos-fab');
      if (trigger && sosModalEl && window.bootstrap) {
        try {
          const modalInstance = bootstrap.Modal.getOrCreateInstance(sosModalEl);
          modalInstance.show();
        } catch (err) {
          console.warn('Bootstrap modal open notice:', err);
        }
      }
    });

    if (sosConfirmBtn) {
      sosConfirmBtn.addEventListener('click', async function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (sosSubmitting) return;

        sosSubmitting = true;
        sosConfirmBtn.disabled = true;
        const origContent = sosConfirmBtn.innerHTML;
        sosConfirmBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Sending SOS...';

        let lat = 18.3410;
        let lng = 74.0169;

        if (window.swcLiveLocation && Number.isFinite(Number(window.swcLiveLocation.lat))) {
          lat = Number(window.swcLiveLocation.lat);
          lng = Number(window.swcLiveLocation.lng);
        }

        try {
          const payload = {
            userId: CURRENT_WARKARI.id,
            userName: CURRENT_WARKARI.name,
            userRole: 'WARKARI',
            emergencyType: 'GENERAL_EMERGENCY',
            message: 'Urgent emergency SOS from Warkari App',
            latitude: lat,
            longitude: lng
          };

          const response = await fetch(`${SWC_API_BASE}/sos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(result.message || 'SOS request failed');
          }

          if (pendingSosLinkId && typeof window.swcLinkSosWithPwd === 'function') {
            window.swcLinkSosWithPwd(pendingSosLinkId);
            pendingSosLinkId = null;
          }

          alert('🚨 SOS alert sent successfully! Admin and nearby Volunteers have been notified with your live GPS location.');

          if (sosModalEl && window.bootstrap) {
            const modalInstance = bootstrap.Modal.getOrCreateInstance(sosModalEl);
            modalInstance.hide();
          }

          if (typeof loadWarkariActiveSos === 'function') {
            loadWarkariActiveSos();
          }
        } catch (error) {
          console.error('[SOS Error]:', error);
          alert(error.message || 'SOS request failed. Please call 108 or reach nearest medical point.');
        } finally {
          sosSubmitting = false;
          sosConfirmBtn.disabled = false;
          sosConfirmBtn.innerHTML = origContent;
        }
      });
    }
  }

  initSosEmergency();

  /* ==========================================================
     ♿ PWD Assistance & Real Backend Sync
     ========================================================== */
  (function initPwdAssistance() {
    const LS_PROFILE = 'swc_pwd_profile';
    const LS_REQUESTS = 'swc_pwd_requests';
    const LS_ACTIVE_ID = 'swc_pwd_active_id';

    const TYPE_LABELS = {
      wheelchair: { en: 'Wheelchair assistance', mr: 'व्हीलचेअर मदत', icon: '🦽' },
      walking: { en: 'Walking assistance', mr: 'चालण्यासाठी मदत', icon: '🚶' },
      visual: { en: 'Visual assistance', mr: 'दृष्टी मदत', icon: '👁️' },
      hearing: { en: 'Hearing assistance', mr: 'श्रवण मदत', icon: '👂' },
      medical: { en: 'Medical support', mr: 'वैद्यकीय मदत', icon: '🏥' },
      route: { en: 'Route/Camp assistance', mr: 'मार्ग/कॅम्प मदत', icon: '📍' },
      general: { en: 'General assistance', mr: 'सर्वसाधारण मदत', icon: '🤝' },
      elderly: { en: 'Elderly assistance', mr: 'ज्येष्ठ नागरिक मदत', icon: '🧓' },
      other: { en: 'Other assistance', mr: 'इतर मदत', icon: '➕' }
    };

    const STATUS_CLASS = {
      'Pending': 'pending',
      'Accepted': 'accepted',
      'On the Way': 'onway',
      'Reached': 'reached',
      'Resolved': 'resolved',
      'Cancelled': 'offline'
    };

    function safeGet(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) { return fallback; }
    }
    function safeSet(key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
    }

    /* ---------------- Profile Settings ---------------- */
    const profileModalEl = document.getElementById('pwdProfileModal');
    const reqYes = document.getElementById('pwdReqYes');
    const reqNo = document.getElementById('pwdReqNo');
    const profileDetails = document.getElementById('pwdProfileDetails');
    const profileNotes = document.getElementById('pwdProfileNotes');
    const profileSaveBtn = document.getElementById('pwdProfileSaveBtn');

    function toggleProfileDetails() {
      const show = reqYes && reqYes.checked;
      if (profileDetails) profileDetails.classList.toggle('d-none', !show);
    }
    if (reqYes) reqYes.addEventListener('change', toggleProfileDetails);
    if (reqNo) reqNo.addEventListener('change', toggleProfileDetails);

    if (profileModalEl) {
      profileModalEl.addEventListener('show.bs.modal', function () {
        const profile = safeGet(LS_PROFILE, null);
        document.querySelectorAll('#pwdProfileTypes input[type="checkbox"]').forEach(cb => { cb.checked = false; });
        if (profile && profile.requiresAssistance) {
          if (reqYes) reqYes.checked = true;
          (profile.types || []).forEach(function (t) {
            const cb = document.querySelector('#pwdProfileTypes input[value="' + t + '"]');
            if (cb) cb.checked = true;
          });
          if (profileNotes) profileNotes.value = profile.notes || '';
        } else {
          if (reqNo) reqNo.checked = true;
          if (profileNotes) profileNotes.value = (profile && profile.notes) || '';
        }
        toggleProfileDetails();
      });
    }

    if (profileSaveBtn) {
      profileSaveBtn.addEventListener('click', function () {
        const requiresAssistance = !!(reqYes && reqYes.checked);
        const types = Array.from(document.querySelectorAll('#pwdProfileTypes input[type="checkbox"]:checked')).map(cb => cb.value);
        const profile = {
          requiresAssistance: requiresAssistance,
          types: requiresAssistance ? types : [],
          notes: profileNotes ? profileNotes.value.trim() : '',
          updatedAt: new Date().toISOString()
        };
        safeSet(LS_PROFILE, profile);
        const modal = bootstrap.Modal.getOrCreateInstance(profileModalEl);
        modal.hide();
      });
    }

    /* ---------------- Request Assistance ---------------- */
    const requestModalEl = document.getElementById('pwdRequestModal');
    const typeGrid = document.getElementById('pwdTypeGrid');
    const requestDesc = document.getElementById('pwdRequestDesc');
    const locationChip = document.getElementById('pwdLocationChip');
    const locationText = document.getElementById('pwdLocationText');
    const submitBtn = document.getElementById('pwdRequestSubmitBtn');
    let selectedType = null;
    let currentLocation = null;

    function selectType(btn) {
      document.querySelectorAll('.pwd-type-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedType = btn.getAttribute('data-type');
      if (submitBtn) submitBtn.disabled = false;
    }
    if (typeGrid) {
      typeGrid.addEventListener('click', function (e) {
        const btn = e.target.closest('.pwd-type-btn');
        if (btn) selectType(btn);
      });
    }

    function attachLocation() {
      currentLocation = null;
      if (locationText) locationText.textContent = 'Attaching your current location…';
      if (locationChip) locationChip.classList.remove('d-none');
      if (window.swcLiveLocation) {
        currentLocation = window.swcLiveLocation;
        if (locationText) locationText.textContent = 'Location attached: ' + currentLocation.lat.toFixed(5) + ', ' + currentLocation.lng.toFixed(5);
      } else {
        currentLocation = { lat: 18.3410, lng: 74.0169, label: 'Saswad, near Jejuri Road (Live GPS)' };
        if (locationText) locationText.textContent = 'Location attached: 18.34100, 74.01690';
      }
    }

    if (requestModalEl) {
      requestModalEl.addEventListener('show.bs.modal', function () {
        selectedType = null;
        document.querySelectorAll('.pwd-type-btn').forEach(b => b.classList.remove('selected'));
        if (requestDesc) requestDesc.value = '';
        const prioNormal = document.getElementById('pwdPrioNormal');
        if (prioNormal) prioNormal.checked = true;
        if (submitBtn) submitBtn.disabled = true;
        attachLocation();
      });
    }

    function getRequests() { return safeGet(LS_REQUESTS, []); }
    function saveRequests(list) { safeSet(LS_REQUESTS, list); }
    function setActiveId(id) { safeSet(LS_ACTIVE_ID, id); }
    function getActiveId() { return safeGet(LS_ACTIVE_ID, null); }

    function findRequest(id) {
      return getRequests().find(r => r.id === id || r._id === id) || null;
    }
    function updateRequest(updated) {
      const list = getRequests().map(r => (r.id === updated.id || r._id === updated._id) ? updated : r);
      saveRequests(list);
    }

    async function getPwdRequestLocation() {
      if (window.swcLiveLocation && Number.isFinite(Number(window.swcLiveLocation.lat)) && Number.isFinite(Number(window.swcLiveLocation.lng))) {
        return window.swcLiveLocation;
      }
      return {
        lat: 18.3410,
        lng: 74.0169,
        label: 'Live GPS location'
      };
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', async function () {
        if (!selectedType) return;
        submitBtn.disabled = true;

        try {
          currentLocation = await getPwdRequestLocation();
        } catch (error) {
          currentLocation = { lat: 18.3410, lng: 74.0169, label: 'Saswad, near Jejuri Road' };
        }

        const prioInput = document.querySelector('input[name="pwdPriority"]:checked');
        const prioVal = (prioInput && prioInput.value === 'High') ? 'High' : 'Medium';
        const assistLabel = (TYPE_LABELS[selectedType] || {}).en || selectedType;

        const payload = {
          userId: CURRENT_WARKARI.id,
          userName: CURRENT_WARKARI.name,
          assistanceType: assistLabel,
          description: requestDesc ? requestDesc.value.trim() : '',
          priority: prioVal,
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
          locationLabel: currentLocation.label || 'Live GPS location'
        };

        try {
          const response = await fetch(`${SWC_API_BASE}/pwd-requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(result.message || 'PWD assistance request failed');
          }

          const backendReq = result.data;
          const localReq = {
            id: backendReq._id,
            _id: backendReq._id,
            varkariId: CURRENT_WARKARI.id,
            assistanceType: selectedType,
            description: backendReq.description,
            location: { lat: backendReq.latitude, lng: backendReq.longitude, label: backendReq.locationLabel },
            priority: backendReq.priority,
            status: backendReq.status,
            volunteer: backendReq.assignedVolunteerName ? { name: backendReq.assignedVolunteerName, phone: '+91 98xxxxx341' } : null,
            createdAt: backendReq.createdAt,
            synced: true,
            linkedSOS: false
          };

          const list = getRequests();
          list.unshift(localReq);
          saveRequests(list);
          setActiveId(localReq.id);

          renderActiveRequest(localReq.id);
          startPwdStatusPolling(localReq.id);
        } catch (error) {
          console.error('PWD creation error:', error);
          alert(error.message || 'Unable to submit PWD request to backend.');
        } finally {
          const modal = bootstrap.Modal.getOrCreateInstance(requestModalEl);
          modal.hide();
          submitBtn.disabled = false;
        }
      });
    }

    /* ---------------- Real-time status polling from MongoDB ---------------- */
    let pwdPollTimer = null;

    async function pollActivePwdStatus(id) {
      if (!id) return;
      try {
        const res = await fetch(`${SWC_API_BASE}/pwd-requests/${encodeURIComponent(id)}`);
        if (!res.ok) return;
        const result = await res.json();
        if (result.success && result.data) {
          const b = result.data;
          let req = findRequest(id);
          if (!req) {
            req = { id: b._id, _id: b._id, assistanceType: b.assistanceType };
          }
          req.status = b.status;
          req.priority = b.priority;
          req.description = b.description;
          if (b.assignedVolunteerName) {
            req.volunteer = { name: b.assignedVolunteerName, phone: '+91 98xxxxx341' };
          }
          updateRequest(req);
          renderActiveRequest(id);

          if (b.status === 'Resolved' || b.status === 'Cancelled') {
            if (pwdPollTimer) {
              clearInterval(pwdPollTimer);
              pwdPollTimer = null;
            }
          }
        }
      } catch (e) {}
    }

    function startPwdStatusPolling(id) {
      if (pwdPollTimer) clearInterval(pwdPollTimer);
      pollActivePwdStatus(id);
      pwdPollTimer = setInterval(() => pollActivePwdStatus(id), 3000);
    }

    /* ---------------- Emergency escalation (Existing SOS) ---------------- */
    const sosModalEl = document.getElementById('sosModal');
    const sosLinkedEl = document.getElementById('sosLinkedRequest');

    function triggerEmergencyFromRequest(id) {
      const req = findRequest(id);
      if (!req) return;
      const ok = window.confirm('🚨 Emergency confirm करायचं का? / Confirm this is an emergency?\n\nThis will send an emergency SOS to the Admin and Volunteer team with your live location.');
      if (!ok) return;
      pendingSosLinkId = id;
      if (sosLinkedEl) {
        sosLinkedEl.textContent = '🔗 Linked to PWD Assistance Request #' + req.id;
        sosLinkedEl.classList.remove('d-none');
      }
      if (sosModalEl && window.bootstrap) {
        bootstrap.Modal.getOrCreateInstance(sosModalEl).show();
      }
    }

    window.swcLinkSosWithPwd = function (linkId) {
      const linkedRequest = findRequest(linkId);
      if (linkedRequest) {
        linkedRequest.linkedSOS = true;
        linkedRequest.priority = 'High';
        updateRequest(linkedRequest);
        if (getActiveId() === linkId) renderActiveRequest(linkId);
      }
    };

    /* ---------------- Render active request card ---------------- */
    const activeBox = document.getElementById('pwdActiveRequest');

    function fmtTime(iso) {
      try {
        return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
      } catch (e) { return iso; }
    }

    function renderActiveRequest(id) {
      const req = findRequest(id);
      if (!activeBox) return;
      if (!req) { activeBox.classList.add('d-none'); activeBox.innerHTML = ''; return; }

      const typeInfo = TYPE_LABELS[req.assistanceType] || { en: req.assistanceType, mr: '', icon: '♿' };
      const statusClass = STATUS_CLASS[req.status] || 'pending';
      const statusLabel = req.status || 'Pending';
      const locLabel = req.location && req.location.lat
        ? (Number(req.location.lat).toFixed(5) + ', ' + Number(req.location.lng).toFixed(5))
        : (req.location ? req.location.label : 'Live GPS location');

      let volunteerHtml = '';
      if (req.volunteer) {
        volunteerHtml =
          '<div class="pwd-volunteer-box"><div class="pwd-volunteer-avatar"><i class="bi bi-person-fill"></i></div>' +
          '<div><div class="fw-bold" style="font-size:.86rem;">' + escapeHtml(req.volunteer.name) + '</div>' +
          '<div class="section-sub">Assigned Volunteer · ' + escapeHtml(req.volunteer.phone) + '</div></div></div>';
      }

      let linkedHtml = '';
      if (req.linkedSOS) {
        linkedHtml = '<div class="pwd-emergency-linked"><i class="bi bi-shield-exclamation"></i> Emergency SOS triggered &amp; linked to this request</div>';
      }

      const resolved = req.status === 'Resolved';
      const newRequestLink = resolved
        ? '<div class="text-center mt-2"><a href="#" class="pwd-new-request-link" id="pwdNewRequestLink" data-bs-toggle="modal" data-bs-target="#pwdRequestModal">+ Start a new assistance request</a></div>'
        : '';

      activeBox.innerHTML =
        '<div class="pwd-status-box mt-3">' +
        '<div class="pwd-status-head">' +
        '<div><div class="pwd-req-id">REQUEST ID · ' + escapeHtml(req.id) + '</div>' +
        '<div class="fw-bold" style="font-size:.95rem;">' + typeInfo.icon + ' ' + escapeHtml(typeInfo.en) + '</div></div>' +
        '<span class="pwd-status-pill ' + statusClass + '">' + escapeHtml(statusLabel) + '</span>' +
        '</div>' +
        (req.description ? '<div class="pwd-detail-row"><strong>Note:</strong><span>' + escapeHtml(req.description) + '</span></div>' : '') +
        '<div class="pwd-detail-row"><strong>Location:</strong><span>' + escapeHtml(locLabel) + '</span></div>' +
        '<div class="pwd-detail-row"><strong>Priority:</strong><span>' + escapeHtml(req.priority || 'Medium') + '</span></div>' +
        '<div class="pwd-detail-row"><strong>Requested:</strong><span>' + fmtTime(req.createdAt) + '</span></div>' +
        volunteerHtml + linkedHtml +
        (!resolved ?
          '<button type="button" class="pwd-emergency-btn" data-request-id="' + escapeHtml(req.id) + '" aria-label="This is an emergency, escalate to SOS">' +
          '<i class="bi bi-exclamation-octagon-fill"></i> 🚨 This is an Emergency</button>' : '') +
        newRequestLink +
        '</div>';

      activeBox.classList.remove('d-none');
    }

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str || '';
      return div.innerHTML;
    }

    if (activeBox) {
      activeBox.addEventListener('click', function (e) {
        const btn = e.target.closest('.pwd-emergency-btn');
        if (btn) {
          triggerEmergencyFromRequest(btn.getAttribute('data-request-id'));
        }
      });
    }

    /* ---------------- Restore state on page load ---------------- */
    (function restore() {
      const activeId = getActiveId();
      if (!activeId) return;
      renderActiveRequest(activeId);
      startPwdStatusPolling(activeId);
    })();
  })();

  /* ==========================================================
     Warkari Profile, Dashboard Stats, Activities & Live SOS
     ========================================================== */

  // 1. Load Warkari User Profile
  async function loadWarkariUserProfile() {
    try {
      const res = await fetch(`${SWC_API_BASE}/users/${CURRENT_WARKARI.id}`);
      if (!res.ok) return;
      const result = await res.json();
      if (!result.success || !result.data) return;

      const u = result.data;
      CURRENT_WARKARI.name = u.name || CURRENT_WARKARI.name;

      // Update navbar
      const navNames = document.querySelectorAll('.top-navbar .avatar-ring + span, .top-navbar .fw-semibold');
      navNames.forEach(el => {
        if (el && !el.classList.contains('d-none')) el.textContent = u.name;
      });

      // Update Digital ID card on index.html
      const widName = document.querySelector('.wid-card .fw-bold');
      if (widName) widName.textContent = u.name;

      const widValues = document.querySelectorAll('.wid-card .wid-value');
      if (widValues.length >= 4) {
        if (u.district) widValues[0].textContent = u.district;
        if (u.bloodGroup) widValues[1].textContent = u.bloodGroup;
        if (u.phone) widValues[3].textContent = u.phone;
      }

      // Update profile.html fields
      const profileName = document.querySelector('.swc-card .fs-5');
      if (profileName && window.location.pathname.includes('profile.html')) {
        profileName.textContent = u.name;
      }
    } catch (e) {
      console.warn('[Warkari Profile] Notice:', e.message);
    }
  }

  // 2. Load Real Dashboard Stats & Nearby Services
  async function loadWarkariDashboardStats() {
    try {
      // Fetch field services
      const svcRes = await fetch(`${SWC_API_BASE}/services`);
      if (svcRes.ok) {
        const svcResult = await svcRes.json();
        if (svcResult.success && Array.isArray(svcResult.data)) {
          const foodCount = svcResult.data.filter(s => s.category === 'FOOD').length;
          const waterCount = svcResult.data.filter(s => s.category === 'WATER').length;
          const medCount = svcResult.data.filter(s => s.category === 'MEDICAL' || s.category === 'HOSPITAL').length;

          const statNums = document.querySelectorAll('.row.g-3.mb-4 .stat-num');
          if (statNums.length >= 6) {
            if (foodCount > 0) statNums[2].textContent = foodCount;
            if (waterCount > 0) statNums[3].textContent = waterCount;
            if (medCount > 0) statNums[4].textContent = medCount;
          }

          // Populate nearby services list on index.html if container exists
          const nearbyRow = document.querySelector('.swc-card .row.g-3');
          if (nearbyRow && svcResult.data.length >= 4 && window.location.pathname.endsWith('index.html')) {
            const icons = { FOOD: '🍛', WATER: '🚰', MEDICAL: '🏥', HOSPITAL: '🏥', POLICE: '👮' };
            const sample = svcResult.data.slice(0, 4);
            nearbyRow.innerHTML = sample.map(s => `
              <div class="col-md-6"><div class="svc-card"><div class="svc-emoji">${icons[s.category] || '📍'}</div>
              <div class="flex-grow-1"><div class="svc-name">${escapeHtml(s.name)}</div>
              <div class="svc-meta"><span>${s.stop || 'Nearby'} ·</span><span class="text-success fw-semibold">Open</span></div></div>
              <a class="btn btn-sm" href="live-map.html" style="background:var(--saffron-10); color:var(--deep-orange); font-weight:600;">Navigate</a></div></div>
            `).join('');
          }
        }
      }

      // Fetch Volunteers count
      const volRes = await fetch(`${SWC_API_BASE}/users?role=VOLUNTEER`);
      if (volRes.ok) {
        const volResult = await volRes.json();
        if (volResult.success) {
          const statNums = document.querySelectorAll('.row.g-3.mb-4 .stat-num');
          if (statNums.length >= 6) {
            statNums[5].textContent = volResult.count || 34;
          }
        }
      }
    } catch (e) {
      console.warn('[Warkari Dashboard Stats] Notice:', e.message);
    }
  }

  // 3. Live Active SOS Tracking for Warkari
  async function loadWarkariActiveSos() {
    try {
      const res = await fetch(`${SWC_API_BASE}/sos`);
      if (!res.ok) return;
      const result = await res.json();
      if (!result.success || !Array.isArray(result.data)) return;

      const myActiveSos = result.data.find(s =>
        (s.userId === CURRENT_WARKARI.id || s.userName === CURRENT_WARKARI.name) &&
        ['PENDING', 'ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'REACHED'].includes(s.status)
      );

      const sosStatusAlert = document.getElementById('userActiveSosAlert');
      if (myActiveSos) {
        if (!sosStatusAlert) {
          const emCard = document.querySelector('.emergency-card');
          if (emCard) {
            const alertDiv = document.createElement('div');
            alertDiv.id = 'userActiveSosAlert';
            alertDiv.className = 'alert alert-danger mt-2 mb-0 d-flex align-items-center justify-content-between';
            alertDiv.style.borderRadius = '12px';
            alertDiv.innerHTML = `
              <div>
                <i class="bi bi-exclamation-octagon-fill me-2"></i>
                <strong>Active Emergency SOS:</strong> ${escapeHtml(myActiveSos.emergencyType || 'Emergency')} (${myActiveSos.status})
                ${myActiveSos.assignedVolunteerName ? `<br><small class="text-success"><i class="bi bi-person-check-fill me-1"></i>Volunteer <strong>${escapeHtml(myActiveSos.assignedVolunteerName)}</strong> is responding</small>` : ''}
              </div>
              <span class="badge bg-danger">${myActiveSos.status}</span>
            `;
            emCard.appendChild(alertDiv);
          }
        } else {
          sosStatusAlert.innerHTML = `
            <div>
              <i class="bi bi-exclamation-octagon-fill me-2"></i>
              <strong>Active Emergency SOS:</strong> ${escapeHtml(myActiveSos.emergencyType || 'Emergency')} (${myActiveSos.status})
              ${myActiveSos.assignedVolunteerName ? `<br><small class="text-success"><i class="bi bi-person-check-fill me-1"></i>Volunteer <strong>${escapeHtml(myActiveSos.assignedVolunteerName)}</strong> is responding</small>` : ''}
            </div>
            <span class="badge bg-danger">${myActiveSos.status}</span>
          `;
        }
      } else if (sosStatusAlert) {
        sosStatusAlert.remove();
      }
    } catch (e) {}
  }

  // 4. Activities Participation
  async function joinWarkariActivity(activityId, title) {
    try {
      const res = await fetch(`${SWC_API_BASE}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: CURRENT_WARKARI.id,
          userName: CURRENT_WARKARI.name,
          userRole: 'WARKARI',
          actionType: 'WARKARI_JOINED_ACTIVITY',
          title: `Joined: ${title || 'Community Activity'}`,
          description: `${CURRENT_WARKARI.name} participated in ${title || 'Activity'}`,
          relatedType: 'ACTIVITY',
          relatedId: activityId || 'ACT-01'
        })
      });
      if (res.ok) {
        alert('🎉 Successfully registered for activity!');
      }
    } catch (e) {
      console.error('[Activity Join Error]:', e);
    }
  }

  // 5. Digital ID PNG Download & Share Engine
  async function downloadDigitalIdPng() {
    const card = document.querySelector('.wid-card');
    const name = (document.querySelector('.wid-card .fw-bold')?.textContent || CURRENT_WARKARI.name || 'Sunil Bhosale').trim();
    const id = CURRENT_WARKARI.id || 'SWC-2026-08412';
    const filename = `Warkari_Digital_ID_${id}.png`;

    // Method 1: Use html2canvas if available
    if (window.html2canvas && card) {
      try {
        const canvas = await html2canvas(card, {
          scale: 3,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#0f172a'
        });
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      } catch (e) {
        console.warn('html2canvas render notice, using pure canvas renderer:', e);
      }
    }

    // Method 2: High-Resolution Pure HTML5 Canvas Drawing (100% offline & reliable)
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1050;
      const ctx = canvas.getContext('2d');

      // Card gradient background
      const grad = ctx.createLinearGradient(0, 0, 800, 1050);
      grad.addColorStop(0, '#1e293b');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(0, 0, 800, 1050, 24);
      } else {
        ctx.rect(0, 0, 800, 1050);
      }
      ctx.fill();

      // Header Saffron Badge
      ctx.fillStyle = '#FF8C00';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(40, 40, 720, 80, 16);
      } else {
        ctx.rect(40, 40, 720, 80);
      }
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText('SMART WARI CONNECT', 70, 92);

      ctx.font = 'bold 20px sans-serif';
      ctx.fillStyle = '#FEF3C7';
      ctx.fillText('DIGITAL WARKARI ID', 510, 92);

      // Photo placeholder
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(60, 160, 140, 140, 16);
      } else {
        ctx.rect(60, 160, 140, 140);
      }
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '64px sans-serif';
      ctx.fillText('🧍', 95, 255);

      // Name & ID
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(name, 230, 215);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '22px sans-serif';
      ctx.fillText(`ID: ${id}`, 230, 260);

      // Detail fields container
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(60, 330, 680, 420, 16);
      } else {
        ctx.rect(60, 330, 680, 420);
      }
      ctx.fill();

      const fields = [
        ['District', 'Pune'],
        ['Blood Group', 'B+'],
        ['Dindi Name', 'Sant Tukaram Dindi'],
        ['Emergency Contact', '+91 98xxxxx210'],
        ['Warkari Since', '2014'],
        ['Validity', 'Valid for Wari 2026']
      ];

      fields.forEach(([lbl, val], idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const x = 90 + col * 340;
        const y = 390 + row * 120;

        ctx.fillStyle = '#FDBA74';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(lbl.toUpperCase(), x, y);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(val, x, y + 40);
      });

      // Bottom Verified Banner
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(60, 780, 680, 210, 16);
      } else {
        ctx.rect(60, 780, 680, 210);
      }
      ctx.fill();

      ctx.fillStyle = '#15803D';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('✓ OFFICIAL VERIFIED DIGITAL WARKARI ID', 95, 845);

      ctx.fillStyle = '#334155';
      ctx.font = '20px sans-serif';
      ctx.fillText('Pandharpur Wari 2026 Assistance System', 95, 890);
      ctx.fillStyle = '#64748B';
      ctx.font = '17px sans-serif';
      ctx.fillText('Government of Maharashtra & Smart Wari Connect Authority', 95, 935);

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Digital ID render error:', err);
      alert('Unable to generate PNG image.');
    }
  }

  window.downloadDigitalIdPng = downloadDigitalIdPng;

  // Click handler for Download ID button
  document.addEventListener('click', function (e) {
    const downloadBtn = e.target.closest('#downloadIdBtn, [data-download-id], button:has(i.bi-download)');
    if (downloadBtn && (window.location.pathname.includes('digital-id.html') || document.querySelector('.wid-card'))) {
      e.preventDefault();
      downloadDigitalIdPng();
    }
  });

  // 6. Global Google Maps Navigation Click Handler for Water, Food & Medical Points
  document.addEventListener('click', function (e) {
    const navBtn = e.target.closest('button:has(i.bi-compass), .btn:has(i.bi-compass), [data-navigate-service]');
    if (navBtn) {
      const href = navBtn.getAttribute('href');
      // If it's a button or an anchor without external link, open Google Maps
      if (!href || href === '#' || href.startsWith('javascript:')) {
        e.preventDefault();
        const card = navBtn.closest('.swc-card, .svc-card, .col-md-6, .col-xl-4');
        let placeName = 'Saswad Water Tanker, Maharashtra';
        if (card) {
          const nameEl = card.querySelector('.svc-name, h5, h6, .fw-bold');
          if (nameEl && nameEl.textContent.trim()) {
            placeName = nameEl.textContent.trim() + ', Saswad, Maharashtra';
          }
        }
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`;
        window.open(mapsUrl, '_blank');
      }
    }
  });

  loadWarkariUserProfile();
  loadWarkariDashboardStats();
  loadWarkariActiveSos();
  setInterval(loadWarkariActiveSos, 4000);
  setInterval(loadWarkariDashboardStats, 10000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSmartWariApp);
} else {
  initSmartWariApp();
}

