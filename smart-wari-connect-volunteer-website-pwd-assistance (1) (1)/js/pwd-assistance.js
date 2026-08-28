/* ==========================================================
   Smart Wari Connect — ♿ PWD Assistance module
   Standalone script, kept fully separate from the existing
   SOS workflow (script.js is not modified). Reuses the same
   card / button / notification / map patterns already used
   across the Volunteer Dashboard.
   Hooks marked TODO(API) are where this should call the
   existing backend once it is wired up.
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {

  if (!document.querySelector('.pwd-card')) return; // only run where PWD Assistance exists

  let pwdAvailable = true; // volunteer's PWD-assistance availability (separate from general availability)
  const PWD_API_BASE = 'http://localhost:5000/api/pwd-requests';
  const PWD_VOLUNTEER_ID = 'test-volunteer-001';
  const PWD_VOLUNTEER_NAME = 'Test Volunteer';
  const pwdRequestGrid = document.getElementById('pwdRequestGrid');

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

  function formatTime(value) {
    const date = new Date(value);
    if (!value || Number.isNaN(date.getTime())) return 'Just now';
    const mins = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
    if (mins < 1) return 'Just now';
    if (mins < 60) return mins + ' min ago';
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + ' hr ago';
    return date.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  function priorityClass(priority) {
    return priority === 'High' ? 'high' : 'normal';
  }

  function statusClass(status) {
    if (status === 'Resolved') return 'open';
    if (status === 'Accepted' || status === 'On the Way' || status === 'Reached') return 'busy';
    return 'new';
  }

  function mapsUrl(request) {
    const lat = Number(request.latitude);
    const lng = Number(request.longitude);
    return Number.isFinite(lat) && Number.isFinite(lng)
      ? 'https://www.google.com/maps?q=' + encodeURIComponent(lat + ',' + lng)
      : 'live-map.html';
  }

  function renderPwdRequests(requests) {
    if (!pwdRequestGrid) return;
    const visible = requests.filter(function (request) {
      return request.status === 'Pending' || request.assignedVolunteerId === PWD_VOLUNTEER_ID;
    });

    if (!visible.length) {
      pwdRequestGrid.innerHTML = '<div class="col-12"><div class="swc-card text-center text-muted py-4">No available PWD assistance requests right now.</div></div>';
      return;
    }

    pwdRequestGrid.innerHTML = visible.map(function (request) {
      const id = escapeHtml(request._id);
      const assignedToMe = request.assignedVolunteerId === PWD_VOLUNTEER_ID;
      const accepted = assignedToMe && request.status !== 'Pending';
      const progressHidden = accepted ? '' : ' d-none';
      const onWayDisabled = request.status === 'Accepted' ? '' : ' disabled';
      const reachedDisabled = request.status === 'On the Way' ? '' : ' disabled';
      const resolvedDisabled = request.status === 'Reached' ? '' : ' disabled';

      return `
      <div class="col-md-6">
        <div class="pwd-card h-100" data-pwd-card data-request-id="${id}">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <span class="pwd-tag"><i class="bi bi-universal-access-circle"></i> PWD ASSISTANCE</span>
            <span class="section-sub">${id.slice(-6)} · ${formatTime(request.createdAt)}</span>
          </div>
          <div class="d-flex gap-3 align-items-center mb-2">
            <img src="images/warkari-photo.svg" class="req-photo" alt="${escapeHtml(request.userName)}">
            <div class="flex-grow-1">
              <div class="req-name">${escapeHtml(request.userName)}</div>
              <div class="req-meta"><i class="bi bi-geo-alt-fill me-1"></i>${escapeHtml(request.locationLabel || ('Lat: ' + request.latitude + ', Lng: ' + request.longitude))}</div>
              <div class="d-flex flex-wrap gap-2 mt-2">
                <span class="req-pill" style="background:var(--pwd-10); color:var(--pwd);">♿ ${escapeHtml(request.assistanceType)}</span>
                <span class="priority-pill ${priorityClass(request.priority)}">${escapeHtml(request.priority || 'Medium')} Priority</span>
                <span class="status-pill ${statusClass(request.status)} pwd-status-badge">${escapeHtml(request.status)}</span>
              </div>
            </div>
          </div>
          <div class="row g-2 pwd-action-row">
            <div class="col-6"><button class="btn-req pwd-accept w-100${accepted ? ' accepted-locked' : ''}" data-pwd-id="${id}" ${accepted ? 'disabled' : ''}><i class="bi bi-check2-circle"></i>${accepted ? ' Accepted' : 'Accept Request'}</button></div>
            <div class="col-6"><a href="${mapsUrl(request)}" target="_blank" rel="noopener" class="btn-req navigate w-100"><i class="bi bi-geo-alt-fill"></i>View Location</a></div>
          </div>
          <div class="pwd-progress-row${progressHidden} row g-2 mt-1">
            <div class="col-6 col-md-3"><button class="btn-req pwd-progress w-100" data-pwd-id="${id}" data-pwd-step="onway"${onWayDisabled}><i class="bi bi-signpost-2"></i>On the Way</button></div>
            <div class="col-6 col-md-3"><button class="btn-req pwd-progress w-100" data-pwd-id="${id}" data-pwd-step="reached"${reachedDisabled}><i class="bi bi-geo-alt-fill"></i>Reached</button></div>
            <div class="col-6 col-md-3"><button class="btn-req pwd-progress w-100" data-pwd-id="${id}" data-pwd-step="resolved"${resolvedDisabled}><i class="bi bi-check2-all"></i>Help Provided</button></div>
            <div class="col-6 col-md-3"><button class="btn-req unable w-100" data-pwd-id="${id}" data-pwd-unable><i class="bi bi-x-circle"></i>Unable to Help</button></div>
          </div>
          <div class="pwd-linked-sos-wrap mt-2">
            <button class="btn-req unable w-100" data-pwd-escalate data-bs-toggle="modal" data-bs-target="#sosModal"><i class="bi bi-exclamation-octagon-fill"></i>Convert to Emergency SOS</button>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  async function loadPwdRequests() {
    if (!pwdRequestGrid) return;
    try {
      const response = await fetch(PWD_API_BASE);
      if (!response.ok) throw new Error('PWD request failed with status ' + response.status);
      const result = await response.json();
      console.log('[Volunteer PWD] API response:', result);
      if (!result.success || !Array.isArray(result.data)) throw new Error('Invalid PWD API response');
      renderPwdRequests(result.data);
    } catch (error) {
      console.error('[Volunteer PWD] Failed to load requests:', error);
    }
  }

  async function assignPwdRequest(id) {
    const response = await fetch(PWD_API_BASE + '/' + encodeURIComponent(id) + '/assign', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assignedVolunteerId: PWD_VOLUNTEER_ID,
        assignedVolunteerName: PWD_VOLUNTEER_NAME,
        status: 'Accepted'
      })
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message || 'PWD accept failed');
  }

  async function updatePwdStatus(id, status) {
    const response = await fetch(PWD_API_BASE + '/' + encodeURIComponent(id) + '/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message || 'PWD status update failed');
  }

  if (pwdRequestGrid) {
    loadPwdRequests();
    setInterval(loadPwdRequests, 4000);

    pwdRequestGrid.addEventListener('click', async function (e) {
      const acceptBtn = e.target.closest('.pwd-accept[data-pwd-id]');
      const stepBtn = e.target.closest('.pwd-progress[data-pwd-id]');
      const unableBtn = e.target.closest('[data-pwd-unable][data-pwd-id]');
      if (!acceptBtn && !stepBtn && !unableBtn) return;

      e.preventDefault();
      e.stopPropagation();

      const btn = acceptBtn || stepBtn || unableBtn;
      const id = btn.getAttribute('data-pwd-id');
      btn.disabled = true;

      try {
        if (acceptBtn) await assignPwdRequest(id);
        if (stepBtn) {
          const statusMap = { onway: 'On the Way', reached: 'Reached', resolved: 'Resolved' };
          await updatePwdStatus(id, statusMap[stepBtn.getAttribute('data-pwd-step')]);
        }
        if (unableBtn) await updatePwdStatus(id, 'Pending');
        await loadPwdRequests();
      } catch (error) {
        console.error('[Volunteer PWD] Action failed:', error);
        notify(error.message || 'PWD action failed', '#FEE2E2', 'bi-exclamation-triangle text-danger');
        btn.disabled = false;
      }
    });
  }

  /* ---------- Push a notification into the existing notification UI
     (Recent Notifications card + the notifications offcanvas), reusing
     the same .notif-item markup already used for SOS/other alerts. ---------- */
  function notify(message, iconBg, icon) {
    const targets = [
      document.querySelector('#notifOffcanvas .offcanvas-body'),
      document.getElementById('activityNotifList') // optional hook if present on a page
    ].filter(Boolean);

    // Also drop into the "Recent Notifications" card on the dashboard, if present
    document.querySelectorAll('.swc-card').forEach(function (card) {
      const title = card.querySelector('.section-title');
      if (title && /Recent Notifications/i.test(title.textContent)) targets.push(card);
    });

    targets.forEach(function (target) {
      const row = document.createElement('div');
      row.className = 'notif-item mt-2';
      row.innerHTML = '<div class="notif-ic" style="background:' + iconBg + ';"><i class="bi ' + icon + '"></i></div>' +
        '<div><div class="fw-semibold" style="font-size:.84rem;">' + message + '</div><div class="notif-time">Just now</div></div>';
      target.prepend(row);
    });

    // TODO(API): POST /api/volunteer/pwd-assistance/notify -> also pushes to Admin dashboard
    // and to the Varkari's app using the existing notification service.
  }

  function setStatusBadge(card, text, pillClass) {
    const badge = card.querySelector('.pwd-status-badge');
    if (!badge) return;
    badge.textContent = text;
    badge.className = 'status-pill pwd-status-badge ' + pillClass;
  }

  function getReqName(card) {
    const el = card.querySelector('.req-name');
    return el ? el.textContent : 'Varkari';
  }
  function getReqId(card) {
    return card.getAttribute('data-request-id') || 'PWD-XXXX';
  }
  function getAssistType(card) {
    const el = card.querySelector('.req-pill');
    return el ? el.textContent.trim() : 'PWD Assistance';
  }

  /* ---------- Active PWD Assistance summary list (mirrors #activeAssistanceList pattern) ---------- */
  function upsertActiveRow(card) {
    const list = document.getElementById('activePwdList');
    if (!list) return;
    const placeholder = list.querySelector('.text-muted.small');
    if (placeholder) placeholder.remove();

    const reqId = getReqId(card);
    let row = list.querySelector('[data-active-for="' + reqId + '"]');
    const statusText = card.querySelector('.pwd-status-badge') ? card.querySelector('.pwd-status-badge').textContent : 'Accepted';

    if (!row) {
      row = document.createElement('div');
      row.className = 'active-card pwd mb-2';
      row.setAttribute('data-active-for', reqId);
      list.prepend(row);
    }
    row.innerHTML = '<i class="bi bi-universal-access-circle fs-4" style="color:var(--pwd);"></i>' +
      '<div class="flex-grow-1"><div class="fw-semibold" style="font-size:.88rem;">' + getReqName(card) + ' — ' + getAssistType(card) + '</div>' +
      '<div class="section-sub">' + reqId + ' · Status: ' + statusText + '</div></div>';
  }

  function removeActiveRow(card, fade) {
    const list = document.getElementById('activePwdList');
    if (!list) return;
    const row = list.querySelector('[data-active-for="' + getReqId(card) + '"]');
    if (!row) return;
    const doRemove = function () {
      row.remove();
      if (!list.querySelector('.active-card')) {
        const empty = document.createElement('div');
        empty.className = 'text-muted small';
        empty.textContent = 'No active PWD assistance right now.';
        list.appendChild(empty);
      }
    };
    if (fade) {
      row.style.transition = 'opacity .3s, transform .3s';
      row.style.opacity = '0';
      row.style.transform = 'translateX(20px)';
      setTimeout(doRemove, 300);
    } else {
      doRemove();
    }
  }

  /* ---------- 1. PWD availability toggle ---------- */
  document.querySelectorAll('.pwd-avail-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      pwdAvailable = !pwdAvailable;
      document.querySelectorAll('.pwd-avail-toggle').forEach(function (b) {
        b.classList.toggle('off', !pwdAvailable);
        const label = b.querySelector('.pwd-avail-label') || b.querySelector('span:last-child');
        if (label) label.textContent = pwdAvailable ? 'Available for PWD Assistance' : 'Unavailable for PWD Assistance';
      });
      // While OFF, this volunteer should not be offered new PWD assignments —
      // grey out "Accept Request" on requests still pending (already-accepted work is untouched).
      document.querySelectorAll('.pwd-card').forEach(function (card) {
        const acceptBtn = card.querySelector('.pwd-accept');
        if (acceptBtn && !acceptBtn.classList.contains('accepted-locked')) {
          acceptBtn.disabled = !pwdAvailable;
        }
      });
      // TODO(API): PATCH /api/volunteer/pwd-availability { available: pwdAvailable }
    });
  });

  /* ---------- 2. Accept Request ---------- */
  document.addEventListener('click', function (e) {
    const acceptBtn = e.target.closest('.pwd-accept');
    if (!acceptBtn) return;
    if (!pwdAvailable) {
      notify('Turn ON "Available for PWD Assistance" to accept new requests.', '#FEF3C7', 'bi-exclamation-triangle text-warning');
      return;
    }
    const card = acceptBtn.closest('.pwd-card');
    if (!card) return;

    acceptBtn.disabled = true;
    acceptBtn.classList.add('accepted-locked');
    acceptBtn.innerHTML = '<i class="bi bi-check2-circle"></i> Accepted';

    setStatusBadge(card, 'Accepted', 'busy');
    card.querySelectorAll('.pwd-progress-row').forEach(row => row.classList.remove('d-none'));
    const onwayBtn = card.querySelector('[data-pwd-step="onway"]');
    if (onwayBtn) onwayBtn.disabled = false;

    upsertActiveRow(card);
    notify('PWD assistance ' + getReqId(card) + ' accepted for ' + getReqName(card) + ' — Varkari & Admin notified.', '#EDE4FF', 'bi-check2-circle text-success');
    // TODO(API): POST /api/volunteer/pwd-assistance/{requestId}/accept
    // -> assigns this volunteer, sets status=ACCEPTED, notifies Varkari + Admin via existing service
  });

  /* ---------- 5. Assistance Progress: On the Way / Reached / Help Provided ---------- */
  document.addEventListener('click', function (e) {
    const stepBtn = e.target.closest('.pwd-progress[data-pwd-step]');
    if (!stepBtn) return;
    const card = stepBtn.closest('.pwd-card');
    if (!card) return;
    const step = stepBtn.getAttribute('data-pwd-step');

    if (step === 'onway') {
      setStatusBadge(card, 'On the Way', 'busy');
      stepBtn.disabled = true;
      const reachedBtn = card.querySelector('[data-pwd-step="reached"]');
      if (reachedBtn) reachedBtn.disabled = false;
      upsertActiveRow(card);
      notify('Volunteer is on the way to ' + getReqName(card) + '.', '#DBEAFE', 'bi-signpost-2 text-primary');
      // TODO(API): PATCH /api/volunteer/pwd-assistance/{requestId} { status: 'ON_THE_WAY' }
    }
    if (step === 'reached') {
      setStatusBadge(card, 'Reached', 'busy');
      stepBtn.disabled = true;
      const resolvedBtn = card.querySelector('[data-pwd-step="resolved"]');
      if (resolvedBtn) resolvedBtn.disabled = false;
      upsertActiveRow(card);
      notify('Volunteer has reached ' + getReqName(card) + '\'s location.', '#DCFCE7', 'bi-geo-alt-fill text-success');
      // TODO(API): PATCH /api/volunteer/pwd-assistance/{requestId} { status: 'REACHED' }
    }
    if (step === 'resolved') {
      setStatusBadge(card, 'Resolved', 'open');
      stepBtn.disabled = true;
      const unableBtn = card.querySelector('[data-pwd-unable]');
      if (unableBtn) unableBtn.disabled = true;
      const onwayBtn = card.querySelector('[data-pwd-step="onway"]');
      if (onwayBtn) onwayBtn.disabled = true;
      notify('Help provided for ' + getReqName(card) + ' — request marked Resolved. Admin notified.', '#DCFCE7', 'bi-check2-all text-success');
      removeActiveRow(card, true);
      // TODO(API): POST /api/volunteer/pwd-assistance/{requestId}/resolve -> status=RESOLVED, saved to history
    }
  });

  /* ---------- Unable to Help -> reassignment ---------- */
  document.addEventListener('click', function (e) {
    const unableBtn = e.target.closest('[data-pwd-unable]');
    if (!unableBtn) return;
    const card = unableBtn.closest('.pwd-card');
    if (!card) return;

    setStatusBadge(card, 'Reassigning…', 'alert');
    notify(getReqName(card) + '\'s request could not be completed — reassigning to another available volunteer.', '#FEE2E2', 'bi-arrow-repeat text-danger');
    removeActiveRow(card, false);

    setTimeout(function () {
      setStatusBadge(card, 'Pending', 'new');
      card.querySelectorAll('.pwd-progress-row').forEach(row => row.classList.add('d-none'));
      card.querySelectorAll('[data-pwd-step]').forEach(function (b) {
        b.disabled = (b.getAttribute('data-pwd-step') !== 'onway');
      });
      if (unableBtn) unableBtn.disabled = false;
      const acceptBtn = card.querySelector('.pwd-accept');
      if (acceptBtn) {
        acceptBtn.classList.remove('accepted-locked');
        acceptBtn.disabled = !pwdAvailable;
        acceptBtn.innerHTML = '<i class="bi bi-check2-circle"></i>Accept Request';
      }
    }, 900);
    // TODO(API): POST /api/volunteer/pwd-assistance/{requestId}/unable
    // -> backend reassigns the request to the next available volunteer
  });

  /* ---------- 7. Emergency escalation: reuse the EXISTING SOS modal/workflow.
     We never create a second SOS system — we just listen for the existing
     "Confirm & Send" click inside the page's existing #sosModal and, if the
     escalation was triggered from a PWD card, show the linked-SOS status on
     that card. The SOS modal itself and its own confirm action are untouched. ---------- */
  let escalatingCard = null;

  document.addEventListener('click', function (e) {
    const escalateBtn = e.target.closest('[data-pwd-escalate]');
    if (escalateBtn) {
      escalatingCard = escalateBtn.closest('.pwd-card');
    }
  });

  document.addEventListener('click', function (e) {
    // Matches the existing SOS modal's confirm button without modifying its markup.
    if (!e.target.closest('#sosModal .text-white')) return;
    if (!escalatingCard) return;

    const wrap = escalatingCard.querySelector('.pwd-linked-sos-wrap');
    if (wrap) {
      wrap.innerHTML = '<span class="linked-sos-badge"><i class="bi bi-exclamation-octagon-fill"></i>🔴 Linked SOS: ACTIVE — handled by the existing SOS workflow</span>';
    }
    setStatusBadge(escalatingCard, 'Escalated to SOS', 'alert');
    notify(getReqName(escalatingCard) + '\'s PWD assistance was escalated to an Emergency SOS.', '#FEE2E2', 'bi-exclamation-octagon-fill text-danger');
    escalatingCard = null;
    // NOTE: no new emergency workflow is created here — the existing SOS system
    // (sos-requests.html / emergency-van.js) owns everything from this point on.
  });

});
