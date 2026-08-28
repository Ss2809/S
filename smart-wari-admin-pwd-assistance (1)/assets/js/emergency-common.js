/* Shared status → existing badge-status class mapping, so every emergency
   page (requests, vans, volunteers) uses the same visual language already
   defined in style.css — no new badge classes introduced. */
function emStatusBadgeClass(status){
  const map = {
    "PENDING": "badge-pending", "ACCEPTED": "badge-info", "ON THE WAY": "badge-critical",
    "ARRIVED": "badge-active", "COMPLETED": "badge-closed", "CANCELLED": "badge-blocked",
    "AVAILABLE": "badge-active", "BUSY": "badge-pending", "ON EMERGENCY": "badge-critical",
    "OFFLINE": "badge-closed", "DISPATCHED": "badge-pending", "GPS LIVE": "badge-critical",
    "Open": "badge-active", "Near Capacity": "badge-pending", "Closed": "badge-closed"
  };
  return map[status] || "badge-info";
}
