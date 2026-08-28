# Smart Wari Connect — Admin Dashboard

A static, responsive Admin Panel for the "Smart Wari Connect – AI Powered Warkari
Assistance Platform", built with plain HTML, CSS and JavaScript (Bootstrap 5,
Bootstrap Icons, Chart.js and Leaflet via CDN — no build step required).

## How to run

Just open `index.html` in a browser, or serve the folder with any static
server, e.g.:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Folder structure

```
smart-wari-admin/
├── index.html              Dashboard (KPIs, live emergency panel, live map, analytics)
├── users.html               User Management
├── volunteers.html          Volunteer Management
├── routes.html               Route Management
├── food-camps.html           Food Camp Management
├── water-points.html         Water Point Management
├── medical-camps.html        Medical Camp Management
├── hospitals.html            Hospital Network
├── missing-persons.html      Missing Person Management + approval workflow
├── lost-found.html           Lost & Found
├── sos-requests.html         SOS Requests
├── pwd-assistance.html       ♿ PWD Assistance Management (separate from SOS — stats, request table,
│                              assign/reassign volunteer, view details, escalate-to-SOS link, analytics)
├── notifications.html        Notification composer
├── chatbot.html               AI Chatbot Analytics
├── digital-id.html           Digital Warkari ID (generate / verify / deactivate)
├── reports.html               Reports & Analytics + System Activity / Audit Log
├── feedback.html              Feedback
├── settings.html              System Settings
├── login.html                 Admin login screen
└── assets/
    ├── css/style.css          Design tokens + all shared component styles
    ├── js/layout.js            Injects sidebar + topbar on every page
    ├── js/app.js               Shared toast / confirm / table-search helpers
    ├── js/dashboard.js         Leaflet map + Chart.js analytics (dashboard only)
    ├── js/emergency-data.js    SOS module sample data (EMERGENCY_REQUESTS, EMERGENCY_VANS, ...)
    ├── js/emergency-common.js  SOS status → badge-class helper
    ├── js/pwd-data.js          ♿ PWD Assistance sample data (PWD_REQUESTS, PWD_VOLUNTEERS, ...) — separate store
    ├── js/pwd-common.js        PWD status/priority badge helpers, nearest-volunteer assignment, SOS escalation link
    └── images/                 Logo and placeholder avatar (SVG)
```

## ♿ PWD Assistance module

A second, independent monitoring module alongside the existing SOS / Emergency
Response system — added without touching any SOS code, data or pages.

- **Data**: `assets/js/pwd-data.js` (`PWD_REQUESTS`, `PWD_VOLUNTEERS`,
  `PWD_ASSISTANCE_TYPES`) is a separate in-memory store from
  `emergency-data.js`'s `EMERGENCY_REQUESTS` / `EMERGENCY_VANS`. Swap either
  file for real API calls independently.
- **Dedicated page**: `pwd-assistance.html` — stats cards, filterable request
  table, View/Assign/Reassign/Mark Resolved/Cancel actions, nearest-available
  auto-assign, gated "Emergency Contact" reveal, analytics charts.
- **Dashboard**: `index.html` gained its own "♿ PWD Assistance — Live
  Overview" panel with its own stat cards, placed next to (not merged with)
  the existing "Emergency Statistics" row and "Live Emergency Monitor" panel.
- **Shared map**: PWD requests (♿) and available PWD volunteers (🟢) are
  added as extra marker layers on the existing dashboard Leaflet map in
  `dashboard.js` — no second map is created. A new "PWD Assistance" filter
  chip toggles them, and `pwd-assistance.html`'s "View on Map" button deep
  links back to the dashboard map via `index.html?pwd=<id>`.
- **SOS link, not a second SOS system**: from a request's detail view, admins
  can "Escalate to Emergency (SOS)". This pushes one record into the
  *existing* `EMERGENCY_REQUESTS` array (read by `sos-requests.html`,
  `emergency-vans.html`, `emergency-tracking.html`, and the dashboard) and
  stores the link both ways (`escalatedToSOS` on the PWD request,
  `pwdOrigin` on the new SOS request). It never creates a parallel SOS
  workflow.
- **Notifications**: reuses the existing `wariToast()` helper
  (`assets/js/app.js`) for every event — new request received, volunteer
  assignment/status changes, resolution, and SOS escalation — the same
  mechanism already used across the rest of the admin panel.
- See `TESTING-pwd-assistance.md` for a manual test checklist covering the
  module end-to-end, including that existing SOS functionality is
  unaffected.

## Design notes

- **Sidebar**: dark indigo ("dindi-dusk") panel with a small saffron pennant
  (pataka) marker next to the active nav item — a nod to the flags carried
  along the Wari route.
- **Page headers**: carry a thin repeating saffron / orange / emerald stripe,
  echoing the banners strung along the pilgrimage.
- **KPI cards**: each has a small triangular flag notch at the top-left corner.
- **Fonts**: Poppins (UI/body, as specified), Baloo 2 (headings — a warm,
  rounded display face) and JetBrains Mono (numeric/data values, for a more
  data-oriented control-room feel).
- All data shown (users, camps, SOS logs, chatbot logs, etc.) is sample data
  for demonstration — wire up the tables/forms to your backend API of choice.

## Adding a new page

Copy any existing page, keep the `#sidebar` / `#topbar` placeholders and the
`data-page` / `data-title` attributes on `<body>`, add your entry to the
`WARI_NAV` array in `assets/js/layout.js`, and the new page will automatically
appear in the sidebar with the correct active state.
