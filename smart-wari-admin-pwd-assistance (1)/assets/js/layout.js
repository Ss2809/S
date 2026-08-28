/* ==========================================================================
   Smart Wari Connect — shared layout injector
   Builds the sidebar + topbar on every page from one source of truth,
   so every page stays visually identical without copy-pasted markup.
   Also wires up the language switcher (EN / मराठी / हिंदी) and mobile nav.
   ========================================================================== */

const WARI_NAV = [
  { groupKey: "overview", items: [
    { href: "index.html", icon: "bi-speedometer2", key: "dashboard" }
  ]},
  { groupKey: "people", items: [
    { href: "users.html", icon: "bi-people", key: "users" },
    { href: "volunteers.html", icon: "bi-person-badge", key: "volunteers" }
  ]},
  { groupKey: "fieldServices", items: [
    { href: "routes.html", icon: "bi-signpost-split", key: "routes" },
    { href: "wari-stops.html", icon: "bi-signpost-2", key: "wari-stops" },
    { href: "food-camps.html", icon: "bi-cup-hot", key: "food-camps" },
    { href: "water-points.html", icon: "bi-droplet", key: "water-points" },
    { href: "medical-camps.html", icon: "bi-heart-pulse", key: "medical-camps" },
    { href: "hospitals.html", icon: "bi-hospital", key: "hospitals" }
  ]},
  { groupKey: "emergencyResponse", items: [
    { href: "sos-requests.html", icon: "bi-exclamation-triangle", key: "sos-requests", badge: "7" },
    { href: "emergency-vans.html", icon: "bi-truck-front", key: "emergency-vans" },
    { href: "emergency-tracking.html", icon: "bi-broadcast", key: "emergency-tracking" }
  ]},
  { groupKey: "pwdAssistance", items: [
    { href: "pwd-assistance.html", icon: "bi-universal-access-circle", key: "pwd-assistance", badge: "3" }
  ]},
  { groupKey: "safetyReports", items: [
    { href: "missing-persons.html", icon: "bi-person-bounding-box", key: "missing-persons" }
  ]},
  { groupKey: "engagement", items: [
    { href: "notifications.html", icon: "bi-megaphone", key: "notifications" },
    { href: "chatbot.html", icon: "bi-robot", key: "chatbot" },
    { href: "digital-id.html", icon: "bi-person-vcard", key: "digital-id" }
  ]},
  { groupKey: "system", items: [
    { href: "reports.html", icon: "bi-graph-up-arrow", key: "reports" },
    { href: "feedback.html", icon: "bi-chat-square-heart", key: "feedback" },
    { href: "settings.html", icon: "bi-gear", key: "settings" },
    { href: "login.html", icon: "bi-box-arrow-right", key: "logout" }
  ]}
];

function renderSidebar(activeKey){
  const groups = WARI_NAV.map(g => {
    const items = g.items.map(it => `
      <li class="${it.key === activeKey ? 'active' : ''}">
        <a href="${it.href}">
          <i class="bi ${it.icon}"></i>
          <span>${t('nav.items.' + it.key)}</span>
          ${it.badge ? `<span class="badge-count">${it.badge}</span>` : ''}
        </a>
      </li>`).join('');
    return `<div class="nav-section-label">${t('nav.groups.' + g.groupKey)}</div>${items}`;
  }).join('');

  return `
    <button id="sidebarClose" aria-label="Close menu"><i class="bi bi-x-lg"></i></button>
    <div class="sidebar-brand">
      <img src="assets/images/logo.svg" alt="Smart Wari Connect logo">
      <div>
        <div class="brand-title">Smart Wari Connect</div>
        <div class="brand-sub">${t('topbar.brandSub')}</div>
      </div>
    </div>
    <ul class="sidebar-nav">${groups}</ul>
  `;
}

function renderLangSwitcher(){
  const current = getLang();
  const options = WARI_LANGS.map(l => `
    <button class="lang-option ${l.code === current ? 'active' : ''}" data-lang="${l.code}">
      <span class="lang-native">${l.native}</span>
      <span class="lang-en">${l.label}</span>
      ${l.code === current ? '<i class="bi bi-check2"></i>' : ''}
    </button>`).join('');
  return `
    <div class="lang-switcher">
      <button class="icon-btn lang-trigger" title="${t('topbar.language')}" data-i18n-title="topbar.language">
        <i class="bi bi-translate"></i>
      </button>
      <div class="lang-menu">${options}</div>
    </div>
  `;
}

function renderTopbar(pageTitle){
  return `
    <button id="sidebarToggle" aria-label="Toggle menu"><i class="bi bi-list"></i></button>
    <span class="topbar-title">${pageTitle || 'Smart Wari Connect Admin'}</span>
    <div class="global-search d-none d-md-block">
      <i class="bi bi-search"></i>
      <input type="text" placeholder="${t('topbar.search')}" data-i18n-placeholder="topbar.search">
    </div>
    <div class="topbar-actions">
      ${renderLangSwitcher()}
      <button class="icon-btn" title="${t('topbar.notifications')}" data-i18n-title="topbar.notifications"><i class="bi bi-bell"></i><span class="dot"></span></button>
      <button class="icon-btn d-none d-sm-flex" title="${t('topbar.messages')}" data-i18n-title="topbar.messages"><i class="bi bi-chat-dots"></i><span class="dot"></span></button>
      <button class="icon-btn d-none d-sm-flex" title="${t('topbar.settings')}" data-i18n-title="topbar.settings" onclick="window.location.href='settings.html'"><i class="bi bi-gear"></i></button>
      <div class="admin-chip">
        <img src="assets/images/avatar-placeholder.svg" alt="Admin avatar">
        <div>
          <div class="nm">Admin — R. Deshmukh</div>
          <div class="rl">${t('topbar.role')}</div>
        </div>
        <i class="bi bi-chevron-down" style="font-size:.7rem;color:var(--muted);margin-left:2px;"></i>
      </div>
    </div>
  `;
}

function closeSidebar(sidebarEl){
  sidebarEl.classList.remove('open');
  document.body.style.overflow = '';
  const backdrop = document.querySelector('.overlay-backdrop');
  if (backdrop) backdrop.remove();
}

function openSidebar(sidebarEl){
  sidebarEl.classList.add('open');
  if (window.innerWidth <= 991.98) document.body.style.overflow = 'hidden';
  if (!document.querySelector('.overlay-backdrop')){
    const backdrop = document.createElement('div');
    backdrop.className = 'overlay-backdrop';
    backdrop.addEventListener('click', () => closeSidebar(sidebarEl));
    document.body.appendChild(backdrop);
  }
}

function wireLangSwitcher(){
  const trigger = document.querySelector('.lang-trigger');
  const menu = document.querySelector('.lang-menu');
  if (!trigger || !menu) return;
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('.lang-option').forEach(btn => {
    btn.addEventListener('click', () => {
      setLang(btn.getAttribute('data-lang'));
      rebuildLayout();
      translatePage();
      menu.classList.remove('open');
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.lang-switcher')) menu.classList.remove('open');
  });
}

function rebuildLayout(){
  const body = document.body;
  const activeKey = body.getAttribute('data-page') || 'dashboard';
  const pageTitleKey = 'pages.' + activeKey + '.title';
  const translatedTitle = t(pageTitleKey);
  const pageTitle = (translatedTitle && translatedTitle !== pageTitleKey) ? translatedTitle : (body.getAttribute('data-title') || 'Smart Wari Connect Admin');

  const sidebarEl = document.getElementById('sidebar');
  const topbarEl = document.getElementById('topbar');
  const wasOpen = sidebarEl && sidebarEl.classList.contains('open');
  if (sidebarEl) sidebarEl.innerHTML = renderSidebar(activeKey);
  if (topbarEl) topbarEl.innerHTML = renderTopbar(pageTitle);
  if (wasOpen && sidebarEl) sidebarEl.classList.add('open');

  const toggleBtn = document.getElementById('sidebarToggle');
  if (toggleBtn){
    toggleBtn.addEventListener('click', () => {
      sidebarEl.classList.contains('open') ? closeSidebar(sidebarEl) : openSidebar(sidebarEl);
    });
  }
  const closeBtn = document.getElementById('sidebarClose');
  if (closeBtn) closeBtn.addEventListener('click', () => closeSidebar(sidebarEl));

  // close mobile menu after navigating
  sidebarEl?.querySelectorAll('.sidebar-nav a').forEach(a => {
    a.addEventListener('click', () => { if (window.innerWidth <= 991.98) closeSidebar(sidebarEl); });
  });

  wireLangSwitcher();
}

function initLayout(){
  setLang(getLang());
  rebuildLayout();
  translatePage();

  document.querySelectorAll('.fade-up').forEach((el, i) => {
    el.style.animationDelay = (i * 40) + 'ms';
  });
}

document.addEventListener('DOMContentLoaded', initLayout);
