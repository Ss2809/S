/* ==========================================================
   Smart Wari Connect — Shared Script
   Handles: AI widget toggle, chip interactions, chat demo,
   settings toggles, lost & found tabs, basic form feedback
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById('pwdCard')) return;

  if (!navigator.geolocation) {
    console.error("Geolocation is not supported by this browser");
    return;
  }

  navigator.geolocation.watchPosition(
    async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      window.swcLiveLocation = { lat: latitude, lng: longitude, label: 'Live GPS location' };
      console.log("LIVE GPS:", latitude, longitude);

      await fetch("http://localhost:5000/api/locations/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: "test-warkari-001",
          name: "Test Warkari",
          role: "WARKARI",
          latitude,
          longitude
        })
      });
    },
    (error) => {
      console.error("GPS ERROR:", error.code, error.message);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000
    }
  );
});

document.addEventListener('DOMContentLoaded', function () {

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
  if (mobileAi) mobileAi.addEventListener('click', function (e) {
    e.preventDefault();
    toggleAi();
  });

  document.querySelectorAll('.ai-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      chip.style.background = 'var(--emerald-10)';
      chip.style.borderColor = 'var(--emerald)';
      setTimeout(function () {
        chip.style.background = '';
        chip.style.borderColor = '';
      }, 600);
    });
  });

  /* ---------- Full page AI chat demo (ai-assistant.html) ---------- */
  const chatWindow = document.getElementById('chatWindow');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');

  const botReplies = {
    "आजचा मुक्काम कुठे आहे?": "आजचा मुक्काम जेजुरी येथे आहे, साधारण संध्याकाळी ६:३० वाजता पोहोचाल.",
    "जवळचं अन्नछत्र कुठे आहे?": "सर्वात जवळचे अन्नछत्र 0.4 किमी अंतरावर आहे आणि सध्या सुरू आहे.",
    "जवळचं पाणी कुठे मिळेल?": "जवळचा पाणी पॉईंट 0.2 किमी अंतरावर सासवड टँकर पॉईंटवर आहे.",
    "जवळची medical help कुठे आहे?": "जवळचा वारी मेडिकल कॅम्प 0.6 किमी वर आहे, सध्या थोडा व्यस्त आहे.",
    "आज पाऊस पडेल का?": "आज पावसाची शक्यता 65% आहे, जेजुरीजवळ जास्त पाऊस अपेक्षित आहे.",
    "पुढचा route कोणता आहे?": "पुढचा मार्ग: सासवड → जेजुरी → लोणंद → फलटण."
  };

  function addMessage(text, sender) {
    if (!chatWindow) return;
    const row = document.createElement('div');
    row.className = 'msg-row ' + sender;
    row.innerHTML =
      '<div class="msg-avatar ' + sender + '"><i class="bi ' + (sender === 'bot' ? 'bi-robot' : 'bi-person-fill') + '"></i></div>' +
      '<div class="msg-bubble">' + text + '</div>';
    chatWindow.appendChild(row);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  document.querySelectorAll('.ai-chip[data-question]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      const q = chip.getAttribute('data-question');
      addMessage(q, 'user');
      setTimeout(function () {
        addMessage(botReplies[q] || "मला याबद्दल अधिक माहिती मिळवण्यास थोडा वेळ लागेल, कृपया थांबा.", 'bot');
      }, 500);
    });
  });

  if (chatForm) {
    chatForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const val = chatInput.value.trim();
      if (!val) return;
      addMessage(val, 'user');
      chatInput.value = '';
      setTimeout(function () {
        addMessage("धन्यवाद! आमची AI प्रणाली लवकरच तुम्हाला अचूक माहिती देईल.", 'bot');
      }, 500);
    });
  }

  /* ---------- Lost & Found tabs ---------- */
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
      form.reset();
    });
  });

  /* ==========================================================
     ♿ PWD Assistance (Varkari Dashboard only)
     Reuses existing swc-card styling, sosModal (SOS system),
     localStorage (as the demo "database"), and notif patterns.
     ========================================================== */
  (function initPwdAssistance() {
    const pwdCard = document.getElementById('pwdCard');
    if (!pwdCard) return; // Only runs on the dashboard

    const LS_PROFILE = 'swc_pwd_profile';
    const LS_REQUESTS = 'swc_pwd_requests';
    const LS_ACTIVE_ID = 'swc_pwd_active_id';
    const LS_QUEUE = 'swc_pwd_offline_queue';

    const VARKARI = { id: 'SWC-2026-08412', name: 'Sunil Bhosale' };

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

    const STATUS_FLOW = ['Pending', 'Volunteer Assigned', 'Accepted', 'On the Way', 'Reached', 'Resolved'];
    const STATUS_CLASS = {
      'Pending': 'pending', 'Volunteer Assigned': 'assigned', 'Accepted': 'accepted',
      'On the Way': 'onway', 'Reached': 'reached', 'Resolved': 'resolved'
    };
    const DEMO_VOLUNTEERS = [
      { name: 'Ganesh More', phone: '+91 98xxxxx341' },
      { name: 'Savita Jadhav', phone: '+91 97xxxxx762' },
      { name: 'Prakash Shinde', phone: '+91 99xxxxx518' }
    ];

    function safeGet(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) { return fallback; }
    }
    function safeSet(key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* storage unavailable */ }
    }

    /* ---------------- 1. PWD Assistance Profile (optional) ---------------- */
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

    /* ---------------- 2. Request Assistance ---------------- */
    const requestModalEl = document.getElementById('pwdRequestModal');
    const typeGrid = document.getElementById('pwdTypeGrid');
    const requestDesc = document.getElementById('pwdRequestDesc');
    const locationChip = document.getElementById('pwdLocationChip');
    const locationText = document.getElementById('pwdLocationText');
    const submitBtn = document.getElementById('pwdRequestSubmitBtn');
    let selectedType = null;
    let currentLocation = null; // { lat, lng, label }

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
      if (!('geolocation' in navigator)) {
        if (locationText) locationText.textContent = 'Location unavailable — using last known location (Saswad, near Jejuri Road)';
        currentLocation = { lat: null, lng: null, label: 'Saswad, near Jejuri Road (last known)' };
        return;
      }
      if (window.swcLiveLocation) {
        currentLocation = window.swcLiveLocation;
        if (locationText) locationText.textContent = 'Location attached: ' + currentLocation.lat.toFixed(5) + ', ' + currentLocation.lng.toFixed(5);
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

    function genRequestId() {
      return 'PWD-' + Date.now().toString(36).toUpperCase();
    }

    function getRequests() { return safeGet(LS_REQUESTS, []); }
    function saveRequests(list) { safeSet(LS_REQUESTS, list); }
    function getQueue() { return safeGet(LS_QUEUE, []); }
    function saveQueue(q) { safeSet(LS_QUEUE, q); }

    function setActiveId(id) { safeSet(LS_ACTIVE_ID, id); }
    function getActiveId() { return safeGet(LS_ACTIVE_ID, null); }

    function findRequest(id) {
      return getRequests().find(r => r.id === id) || null;
    }
    function updateRequest(updated) {
      const list = getRequests().map(r => r.id === updated.id ? updated : r);
      saveRequests(list);
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        if (!selectedType) return;
        const online = navigator.onLine;
        const request = {
          id: genRequestId(),
          varkariId: VARKARI.id,
          assistanceType: selectedType,
          description: requestDesc ? requestDesc.value.trim() : '',
          location: currentLocation || { lat: null, lng: null, label: 'Location unavailable' },
          priority: (document.querySelector('input[name="pwdPriority"]:checked') || {}).value || 'Normal',
          status: 'Pending',
          volunteer: null,
          createdAt: new Date().toISOString(),
          synced: online,
          linkedSOS: false
        };

        const list = getRequests();
        list.push(request);
        saveRequests(list);
        setActiveId(request.id);

        if (!online) {
          const q = getQueue();
          q.push(request.id);
          saveQueue(q);
          showOfflineNotice(true);
        } else {
          showOfflineNotice(false);
          // Simulate sending to the existing backend/notification system
          setTimeout(function () { simulateLifecycle(request.id); }, 1500);
        }

        renderActiveRequest(request.id);
        const modal = bootstrap.Modal.getOrCreateInstance(requestModalEl);
        modal.hide();
      });
    }

    /* ---------------- 5. Offline support ---------------- */
    const offlineNoticeEl = document.getElementById('pwdOfflineNotice');
    const syncedNoticeEl = document.getElementById('pwdSyncedNotice');

    function showOfflineNotice(show) {
      if (!offlineNoticeEl) return;
      offlineNoticeEl.classList.toggle('d-none', !show);
    }
    function flashSyncedNotice() {
      if (!syncedNoticeEl) return;
      syncedNoticeEl.classList.remove('d-none');
      setTimeout(function () { syncedNoticeEl.classList.add('d-none'); }, 4000);
    }

    function syncOfflineQueue() {
      const q = getQueue();
      if (!q.length) return;
      q.forEach(function (id) {
        const req = findRequest(id);
        if (!req || req.synced) return;
        req.synced = true;
        updateRequest(req);
        setTimeout(function () { simulateLifecycle(req.id); }, 800);
      });
      saveQueue([]);
      showOfflineNotice(false);
      flashSyncedNotice();
      const activeId = getActiveId();
      if (activeId && q.indexOf(activeId) !== -1) renderActiveRequest(activeId);
    }
    window.addEventListener('online', syncOfflineQueue);

    /* ---------------- 3. Status simulation (demo "server" updates) ---------------- */
    function simulateLifecycle(id) {
      const req = findRequest(id);
      if (!req || !req.synced || req.status === 'Resolved') return;
      const idx = STATUS_FLOW.indexOf(req.status);
      const nextIdx = idx + 1;
      if (nextIdx >= STATUS_FLOW.length) return;
      const next = STATUS_FLOW[nextIdx];
      req.status = next;
      if (next === 'Volunteer Assigned' && !req.volunteer) {
        req.volunteer = DEMO_VOLUNTEERS[Math.floor(Math.random() * DEMO_VOLUNTEERS.length)];
      }
      updateRequest(req);
      if (getActiveId() === id) renderActiveRequest(id);
      if (next !== 'Resolved') {
        setTimeout(function () { simulateLifecycle(id); }, 5000);
      }
    }

    /* ---------------- 4. Emergency escalation (reuses EXISTING SOS, no duplication) ---------------- */
    const sosModalEl = document.getElementById('sosModal');
    const sosLinkedEl = document.getElementById('sosLinkedRequest');
    const sosConfirmBtn = document.getElementById('sosConfirmBtn');
    let pendingSosLinkId = null;

    function triggerEmergencyFromRequest(id) {
      const req = findRequest(id);
      if (!req) return;
      const ok = window.confirm('🚨 Emergency confirm karायचं का? / Confirm this is an emergency?\n\nHe SOS system la kळवेल ani tumcha PWD Assistance request tyala link होईल.');
      if (!ok) return;
      pendingSosLinkId = id;
      if (sosLinkedEl) {
        sosLinkedEl.textContent = '🔗 Linked to PWD Assistance Request #' + req.id + ' (' + (TYPE_LABELS[req.assistanceType] || {}).en + ')';
        sosLinkedEl.classList.remove('d-none');
      }
      if (sosModalEl && window.bootstrap) {
        bootstrap.Modal.getOrCreateInstance(sosModalEl).show();
      }
    }

    let sosSubmitting = false;

    function showSosFeedback(message, isError) {
      if (!sosLinkedEl) return;
      sosLinkedEl.textContent = message;
      sosLinkedEl.classList.remove('d-none');
    }

    if (sosConfirmBtn) console.log('SOS BUTTON READY');
    sosConfirmBtn?.addEventListener('click', async function (event) {
      const clickedSosButton = event.currentTarget;
      console.log("SOS CLICK DETECTED");
      event.preventDefault();
      event.stopPropagation();
      if (sosSubmitting) return;

      if (!navigator.geolocation) {
        const error = new Error('Geolocation is not supported by this browser');
        console.error('SOS GPS error:', error.message);
        showSosFeedback(error.message, true);
        return;
      }

      sosSubmitting = true;
      clickedSosButton.disabled = true;

      try {
        const position = await new Promise(function (resolve, reject) {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000
          });
        });
        console.log("SOS FORM SUBMITTED");

        const payload = {
          userId: 'test-warkari-001',
          userName: 'Test Warkari',
          userRole: 'WARKARI',
          emergencyType: 'GENERAL_EMERGENCY',
          message: '',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };

        console.log('Sending SOS:', payload);
        const response = await fetch('http://localhost:5000/api/sos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        console.log('SOS API STATUS:', response.status);
        console.log('SOS API RESPONSE:', result);

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'SOS request failed');
        }

        const linkedRequest = pendingSosLinkId ? findRequest(pendingSosLinkId) : null;
        if (linkedRequest) {
          linkedRequest.linkedSOS = true;
          linkedRequest.priority = 'High';
          updateRequest(linkedRequest);
          if (getActiveId() === pendingSosLinkId) renderActiveRequest(pendingSosLinkId);
          pendingSosLinkId = null;
        }

        showSosFeedback('SOS sent successfully.', false);
        if (document.activeElement === clickedSosButton) clickedSosButton.blur();
        bootstrap.Modal.getOrCreateInstance(sosModalEl).hide();
      } catch (error) {
        if (error && typeof error.code === 'number') {
          console.error('SOS GPS error:', error.code, error.message);
        } else {
          console.error('SOS API error:', error);
        }
        showSosFeedback(error.message || 'SOS request failed', true);
      } finally {
        sosSubmitting = false;
        clickedSosButton.disabled = false;
      }
    }, true);
    if (sosModalEl) {
      sosModalEl.addEventListener('hidden.bs.modal', function () {
        if (sosLinkedEl) sosLinkedEl.classList.add('d-none');
      });
    }

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
      const statusClass = req.synced ? (STATUS_CLASS[req.status] || 'pending') : 'offline';
      const statusLabel = req.synced ? req.status : 'Pending (Offline — will send automatically)';
      const locLabel = req.location && req.location.lat
        ? (req.location.lat + ', ' + req.location.lng)
        : (req.location ? req.location.label : 'Not available');

      let volunteerHtml = '';
      if (req.volunteer) {
        volunteerHtml =
          '<div class="pwd-volunteer-box"><div class="pwd-volunteer-avatar"><i class="bi bi-person-fill"></i></div>' +
          '<div><div class="fw-bold" style="font-size:.86rem;">' + req.volunteer.name + '</div>' +
          '<div class="section-sub">Assigned Volunteer · ' + req.volunteer.phone + '</div></div></div>';
      }

      let linkedHtml = '';
      if (req.linkedSOS) {
        linkedHtml = '<div class="pwd-emergency-linked"><i class="bi bi-shield-exclamation"></i> Emergency SOS triggered &amp; linked to this request</div>';
      }

      const resolved = req.status === 'Resolved' && req.synced;
      const newRequestLink = resolved
        ? '<div class="text-center mt-2"><a href="#" class="pwd-new-request-link" id="pwdNewRequestLink" data-bs-toggle="modal" data-bs-target="#pwdRequestModal">+ Start a new assistance request</a></div>'
        : '';

      activeBox.innerHTML =
        '<div class="pwd-status-box mt-3">' +
        '<div class="pwd-status-head">' +
        '<div><div class="pwd-req-id">REQUEST ID · ' + req.id + '</div>' +
        '<div class="fw-bold" style="font-size:.95rem;">' + typeInfo.icon + ' ' + typeInfo.en + '</div></div>' +
        '<span class="pwd-status-pill ' + statusClass + '">' + statusLabel + '</span>' +
        '</div>' +
        (req.description ? '<div class="pwd-detail-row"><strong>Note:</strong><span>' + escapeHtml(req.description) + '</span></div>' : '') +
        '<div class="pwd-detail-row"><strong>Location:</strong><span>' + escapeHtml(locLabel) + '</span></div>' +
        '<div class="pwd-detail-row"><strong>Priority:</strong><span>' + req.priority + '</span></div>' +
        '<div class="pwd-detail-row"><strong>Requested:</strong><span>' + fmtTime(req.createdAt) + '</span></div>' +
        volunteerHtml + linkedHtml +
        (!resolved ?
          '<button type="button" class="pwd-emergency-btn" data-request-id="' + req.id + '" aria-label="This is an emergency, escalate to SOS">' +
          '<i class="bi bi-exclamation-octagon-fill"></i> 🚨 This is an Emergency</button>' : '') +
        newRequestLink +
        '</div>';

      activeBox.classList.remove('d-none');
    }

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
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
      const req = findRequest(activeId);
      if (!req) return;
      renderActiveRequest(activeId);
      if (!req.synced) {
        showOfflineNotice(true);
      } else if (req.status !== 'Resolved') {
        // Resume simulated progress after a reload
        setTimeout(function () { simulateLifecycle(activeId); }, 3000);
      }
      // If we came back online since last visit, sync any queued requests
      if (navigator.onLine) syncOfflineQueue();
    })();
  })();

});
