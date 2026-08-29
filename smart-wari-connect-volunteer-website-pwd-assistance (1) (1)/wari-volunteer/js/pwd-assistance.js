/* ==========================================================
   Smart Wari Connect — ♿ PWD Assistance module
   Standalone script for Volunteer Dashboard & PWD Assistance page.
   Fully integrated with Node.js + Express + MongoDB backend.
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {

  const pwdContainer = document.getElementById('pwdRequestGrid') || document.getElementById('pwdRequestRow');
  if (!pwdContainer && !document.querySelector('.pwd-card')) return;

  let pwdAvailable = true;
  const PWD_API_BASE = 'http://localhost:5000/api/pwd-requests';
  const PWD_VOLUNTEER_ID = 'SWCV-2026-1042';
  const PWD_VOLUNTEER_NAME = 'Anita Kulkarni';

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
    const target = document.getElementById('pwdRequestGrid') || document.getElementById('pwdRequestRow');
    const activeList = document.getElementById('activePwdList');

    const pendingRequests = requests.filter(function (request) {
      return request.status === 'Pending';
    });

    const myActiveRequests = requests.filter(function (request) {
      const isMine = request.assignedVolunteerId === PWD_VOLUNTEER_ID || request.assignedVolunteerName === PWD_VOLUNTEER_NAME;
      return isMine && ['Accepted', 'On the Way', 'Reached'].includes(request.status);
    });

    if (target) {
      if (!pendingRequests.length) {
        target.innerHTML = '<div class="col-12"><div class="swc-card text-center text-muted py-4"><i class="bi bi-check2-circle fs-3 d-block mb-2" style="color:var(--emerald);"></i>No pending PWD assistance requests right now.</div></div>';
      } else {
        target.innerHTML = pendingRequests.map(function (request) {
          const id = escapeHtml(request._id);
          return `
          <div class="col-md-6 col-lg-6 mb-3">
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
                  ${request.description ? `<div class="section-sub mt-1 mb-1">${escapeHtml(request.description)}</div>` : ''}
                  <div class="d-flex flex-wrap gap-2 mt-2">
                    <span class="req-pill" style="background:var(--pwd-10); color:var(--pwd);">♿ ${escapeHtml(request.assistanceType)}</span>
                    <span class="priority-pill ${priorityClass(request.priority)}">${escapeHtml(request.priority || 'Medium')} Priority</span>
                    <span class="status-pill ${statusClass(request.status)} pwd-status-badge">${escapeHtml(request.status)}</span>
                  </div>
                </div>
              </div>
              <div class="row g-2 pwd-action-row mt-2">
                <div class="col-6"><button class="btn-req pwd-accept w-100" data-pwd-id="${id}"><i class="bi bi-check2-circle"></i>Accept Request</button></div>
                <div class="col-6"><a href="${mapsUrl(request)}" target="_blank" rel="noopener" class="btn-req navigate w-100"><i class="bi bi-geo-alt-fill"></i>View Location</a></div>
              </div>
            </div>
          </div>`;
        }).join('');
      }
    }

    if (activeList) {
      if (!myActiveRequests.length) {
        activeList.innerHTML = '<div class="text-muted small">No active PWD assistance right now.</div>';
      } else {
        activeList.innerHTML = myActiveRequests.map(function (request) {
          const id = escapeHtml(request._id);
          const onWayDisabled = request.status === 'Accepted' ? '' : ' disabled';
          const reachedDisabled = request.status === 'On the Way' ? '' : ' disabled';
          const resolvedDisabled = request.status === 'Reached' ? '' : ' disabled';

          return `
          <div class="active-card mb-2" data-active-pwd="${id}">
            <i class="bi bi-universal-access-circle fs-4" style="color:var(--pwd);"></i>
            <div class="flex-grow-1">
              <div class="fw-semibold" style="font-size:.88rem;">${escapeHtml(request.userName)} — ${escapeHtml(request.assistanceType)}</div>
              <div class="section-sub">${escapeHtml(request.locationLabel || 'Near Wari Route')} · Status: <span class="badge bg-warning text-dark">${escapeHtml(request.status)}</span></div>
              <div class="d-flex flex-wrap gap-2 mt-2">
                <button class="btn-req pwd-progress btn-sm" data-pwd-id="${id}" data-pwd-step="onway"${onWayDisabled}><i class="bi bi-signpost-2 me-1"></i>On the Way</button>
                <button class="btn-req pwd-progress btn-sm" data-pwd-id="${id}" data-pwd-step="reached"${reachedDisabled}><i class="bi bi-geo-alt-fill me-1"></i>Reached</button>
                <button class="btn-req pwd-progress btn-sm" data-pwd-id="${id}" data-pwd-step="resolved"${resolvedDisabled} style="background:var(--emerald-10); color:var(--emerald);"><i class="bi bi-check2-all me-1"></i>Help Provided</button>
              </div>
            </div>
          </div>`;
        }).join('');
      }
    }
  }

  async function loadPwdRequests() {
    try {
      const response = await fetch(PWD_API_BASE);
      if (!response.ok) throw new Error('PWD request failed with status ' + response.status);
      const result = await response.json();
      if (!result.success || !Array.isArray(result.data)) throw new Error('Invalid PWD API response');
      renderPwdRequests(result.data);
    } catch (error) {
      console.warn('[Volunteer PWD] Load notice:', error.message);
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

  document.addEventListener('click', async function (e) {
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
      if (acceptBtn) {
        await assignPwdRequest(id);
        alert('PWD request accepted. Warkari notified.');
      }
      if (stepBtn) {
        const statusMap = { onway: 'On the Way', reached: 'Reached', resolved: 'Resolved' };
        const nextStatus = statusMap[stepBtn.getAttribute('data-pwd-step')];
        await updatePwdStatus(id, nextStatus);
        alert(`Status updated to: ${nextStatus}`);
      }
      if (unableBtn) {
        await updatePwdStatus(id, 'Pending');
      }
      await loadPwdRequests();
    } catch (error) {
      console.error('[Volunteer PWD] Action failed:', error);
      alert(error.message || 'PWD action failed');
      btn.disabled = false;
    }
  });

  /* ---------- Availability toggle ---------- */
  document.querySelectorAll('.pwd-avail-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      pwdAvailable = !pwdAvailable;
      document.querySelectorAll('.pwd-avail-toggle').forEach(function (b) {
        b.classList.toggle('off', !pwdAvailable);
        const label = b.querySelector('.pwd-avail-label') || b.querySelector('span:last-child');
        if (label) label.textContent = pwdAvailable ? 'Available for PWD Assistance' : 'Unavailable for PWD Assistance';
      });
      document.querySelectorAll('.pwd-card').forEach(function (card) {
        const acceptBtn = card.querySelector('.pwd-accept');
        if (acceptBtn && !acceptBtn.classList.contains('accepted-locked')) {
          acceptBtn.disabled = !pwdAvailable;
        }
      });
    });
  });

  loadPwdRequests();
  setInterval(loadPwdRequests, 3000);
});
