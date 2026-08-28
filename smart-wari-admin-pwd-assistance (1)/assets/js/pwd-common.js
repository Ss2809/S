/* ==========================================================================
   Shared PWD Assistance helpers.
   Reuses the same visual language already defined in style.css (badge-status
   classes) — no new badge classes introduced, same approach as
   emergency-common.js for the existing SOS module.
   ========================================================================== */

function pwdStatusBadgeClass(status){
  const map = {
    "Pending": "badge-pending", "Accepted": "badge-info", "On the Way": "badge-critical",
    "Reached": "badge-active", "Resolved": "badge-closed", "Cancelled": "badge-blocked",
    "AVAILABLE": "badge-active", "BUSY": "badge-pending", "OFFLINE": "badge-closed"
  };
  return map[status] || "badge-info";
}

function pwdPriorityBadgeClass(priority){
  const map = { "High": "badge-blocked", "Medium": "badge-pending", "Low": "badge-info" };
  return map[priority] || "badge-info";
}

/* Straight-line distance in km between two lat/lng points (Haversine).
   Good enough for "closest available volunteer" on a route-corridor map. */
function pwdDistanceKm(lat1, lng1, lat2, lng2){
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

/* Returns the closest AVAILABLE PWD volunteer to a request, or null if none
   are available. Used by both the "Auto-assign nearest" action and the
   Assign/Reassign modal's suggestion chip. */
function pwdNearestAvailableVolunteer(request){
  const available = PWD_VOLUNTEERS.filter(v => v.status === "AVAILABLE");
  if (!available.length) return null;
  return available
    .map(v => ({ v, dist: pwdDistanceKm(request.lat, request.lng, v.lat, v.lng) }))
    .sort((a, b) => a.dist - b.dist)[0];
}

/* Escalate a PWD Assistance request into the EXISTING SOS workflow.
   This does NOT create a second SOS system: it pushes a normal record into
   the same EMERGENCY_REQUESTS array that sos-requests.html / dashboard.js /
   emergency-tracking.js already read from, and simply records the link back
   to the originating PWD request via `pwdOrigin`. The PWD request keeps its
   own status and gains an `escalatedToSOS` pointer so admins can see the
   connection from either side. */
function pwdEscalateToSOS(request){
  const newId = "EMG-" + (2000 + Math.floor(Math.random() * 900));
  EMERGENCY_REQUESTS.unshift({
    id: newId, varkariId: request.varkariId, varkariName: request.varkariName,
    type: "PWD Escalation — " + request.assistanceType, stop: request.stop,
    volunteer: request.volunteer, van: "—", time: "just now", status: "PENDING",
    lat: request.lat, lng: request.lng, pwdOrigin: request.id
  });
  request.escalatedToSOS = newId;
  return newId;
}
