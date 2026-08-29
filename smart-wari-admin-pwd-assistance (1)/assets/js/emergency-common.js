/* Shared status → existing badge-status class mapping, so every emergency
   page (requests, vans, volunteers) uses the same visual language already
   defined in style.css — no new badge classes introduced. */
function emStatusBadgeClass(status){
  const normalized = String(status || '').toUpperCase().trim();
  const map = {
    "PENDING": "badge-pending",
    "ASSIGNED": "badge-info",
    "ACCEPTED": "badge-info",
    "ON_THE_WAY": "badge-critical",
    "ON THE WAY": "badge-critical",
    "REACHED": "badge-active",
    "ARRIVED": "badge-active",
    "RESOLVED": "badge-active",
    "COMPLETED": "badge-closed",
    "CANCELLED": "badge-blocked",
    "AVAILABLE": "badge-active",
    "BUSY": "badge-pending",
    "ON EMERGENCY": "badge-critical",
    "OFFLINE": "badge-closed",
    "DISPATCHED": "badge-pending",
    "GPS LIVE": "badge-critical",
    "OPEN": "badge-active",
    "NEAR CAPACITY": "badge-pending",
    "CLOSED": "badge-closed"
  };
  return map[normalized] || "badge-info";
}
