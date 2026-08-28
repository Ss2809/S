# PWD Assistance Module — Manual Test Checklist

This project is a static HTML/CSS/JS admin panel (no build step, no backend,
no test runner) — see `README.md`. The checklist below is the manual
equivalent of the 10 test cases requested for the ♿ PWD Assistance module,
written so a reviewer (or QA) can walk through them in a browser in a few
minutes. Serve the folder first:

```bash
npx serve .
# or
python3 -m http.server 8080
```

Then open `index.html` and `pwd-assistance.html` in the browser.

---

### 1. New PWD request appears in Admin
- Open `pwd-assistance.html`.
- Click **Simulate New Request** in the table toolbar.
- **Expect:** a new row appears at the top of the table with status
  `Pending`, a toast notification reading
  `Notification: New PWD assistance request PWD-31xx received`, and the
  **Total PWD Requests** / **Pending Requests** stat cards increment by 1.
- Also open `index.html` and refresh — the new request appears in the
  **♿ PWD Assistance — Live Overview** mini table on the dashboard.

### 2. Admin can view details
- Click the eye icon (**View**) on any row.
- **Expect:** modal opens showing Varkari name & ID, assistance type,
  description, location, request time, priority, assigned volunteer, status,
  and a masked **Emergency Contact** field (`•••• •••• (hidden)`).

### 3. Admin can assign volunteer
- On a row with `Volunteer = Unassigned`, click the person-plus icon
  (**Assign Volunteer**).
- Either pick a volunteer from the dropdown, or click
  **Assign Nearest Available** to auto-select the closest `AVAILABLE` PWD
  volunteer (distance shown under the dropdown), then set **Status** to
  `Accepted` and click **Save**.
- **Expect:** the table row updates with the volunteer's name and new
  status; a toast reads `Notification: <Volunteer> accepted PWD-xxxx`.

### 4. Volunteer assignment updates correctly
- Re-open the same request's **View** modal.
- **Expect:** **Assigned Volunteer** reflects the volunteer just assigned in
  step 3, and the **Available PWD Volunteers** stat card on the page (and on
  the dashboard) decreases if that volunteer was previously counted as
  available (volunteer roster status is separate from request status — see
  `assets/js/pwd-data.js`).

### 5. Status updates appear in real time / refresh
- With the Assign/Reassign modal, change **Status** through
  `Accepted → On the Way → Reached → Resolved` (save between each).
- **Expect:** each save immediately re-renders the table row's status badge,
  the 6 stat cards at the top of the page, and the 3 analytics charts
  (Pending vs Resolved chart shifts) — no page reload required.

### 6. Admin can reassign volunteer
- On a request that already has a volunteer, click the person-plus icon
  again (tooltip reads **Reassign Volunteer**).
- Pick a different volunteer from the dropdown and **Save**.
- **Expect:** the table's **Volunteer** column updates to the new name;
  `PWD_REQUESTS[i].volunteerId` in memory now points at the new volunteer.

### 7. Resolved requests are recorded
- Click the check-circle icon (**Mark Resolved**) on any active request, or
  set status to `Resolved` via the Assign modal.
- **Expect:** row's status badge turns to `Resolved` (closed style), the
  **Resolved Requests** stat card increments, **Resolution Rate** stat
  updates, the **View**/**Mark Resolved**/**Cancel** action buttons for that
  row disable, and it drops out of the dashboard's "active requests" mini
  table.

### 8. PWD emergency escalation connects to existing SOS
- Open **View** on any non-escalated request and click
  **Escalate to Emergency (SOS)**, then confirm the dialog.
- **Expect:** a toast reads
  `<id> escalated → new SOS request <EMG-xxxx> created`; the request row now
  shows a red **EMG-xxxx** tag next to its ID (links to `sos-requests.html`);
  the View modal shows "Escalated to existing SOS request EMG-xxxx".
- Open `sos-requests.html` — the new `EMG-xxxx` row is present in the
  **existing** Emergency Requests table with type
  `PWD Escalation — <assistance type>`, proving it was pushed into the same
  `EMERGENCY_REQUESTS` store rather than a new/parallel system.

### 9. Existing SOS functionality is not affected
- On `sos-requests.html`, `emergency-vans.html`, and `emergency-tracking.html`,
  confirm all original SOS requests, vans, filters, search, and the
  Update-status modal still work exactly as before (unchanged markup/JS in
  those files, aside from the one new escalated row that lands in the same
  table from test #8).
- On `index.html`, confirm the **Emergency Statistics** row and
  **Live Emergency Monitor** panel are visually and functionally identical
  to before — the new PWD panel sits in a separate `card-surface` block and
  does not alter the SOS panel's markup, data source, or scripts.
- On the dashboard's Live Map, toggle the **SOS** filter chip — only SOS
  markers show/hide; toggle **PWD Assistance** — only ♿/🟢 markers
  show/hide. The two layers are independent (`_wariType: 'sos'` vs
  `_wariType: 'pwd'`).

### 10. Sensitive PWD information is accessible only to authorized admin
- Open **View** on any request. The **Emergency Contact** box is masked by
  default (`•••• •••• (hidden)`).
- Click **Reveal** — the real contact value is shown, the button switches to
  **Hide**, and a toast logs
  `Sensitive contact info accessed — logged for audit`.
- Click **Hide** (or close and reopen the modal) — the value re-masks.
- **Expect:** the emergency contact is never rendered in the table, the
  dashboard mini table, or any public-facing view — only inside the gated
  View modal, and only after an explicit reveal action.

---

## Notes for a real backend integration
- Replace the arrays in `assets/js/pwd-data.js` with API calls (see the file
  header comment) — every page that reads `PWD_REQUESTS` / `PWD_VOLUNTEERS`
  will keep working unchanged as long as the same shape is returned.
- `pwdEscalateToSOS()` in `assets/js/pwd-common.js` is the single integration
  point for wiring escalation to a real SOS/Emergency API — it currently
  just pushes into the in-memory `EMERGENCY_REQUESTS` array.
