/* ==========================================================================
   Smart Wari Connect — PWD (Persons with Disabilities) Assistance module
   sample data. Mirrors the pattern used in emergency-data.js: one place to
   swap in real API/database calls later, every PWD Assistance page below
   just reads from these arrays.

   IMPORTANT: this module is intentionally separate from EMERGENCY_REQUESTS /
   EMERGENCY_VANS (emergency-data.js). PWD Assistance is a distinct workflow
   from SOS. A PWD request can be *linked* to an SOS request via the
   `escalatedToSOS` field when an admin escalates it (see pwd-common.js),
   but the two record types and lists are never merged.
   ========================================================================== */

const PWD_ASSISTANCE_TYPES = [
  "Wheelchair Assistance", "Visual Impairment Guide", "Hearing Assistance",
  "Mobility Support", "Medical Equipment Help", "Elderly / Frail Support", "Other"
];

/* Volunteers who have opted in / are trained for PWD Assistance duty.
   Deliberately a separate roster field from the general Volunteer
   Management list (volunteers.html) — same people can appear in both,
   this list just tracks PWD-duty specific availability & location. */
const PWD_VOLUNTEERS = [
  { id: "PWDV-01", name: "Sneha Bhosale",  mobile: "98811 22034", stop: "Wakhari",     lat: 17.7300, lng: 75.3000, status: "AVAILABLE", requestsHandled: 34 },
  { id: "PWDV-02", name: "Arjun Nikam",    mobile: "97711 90045", stop: "Pandharpur",  lat: 17.6792, lng: 75.3316, status: "BUSY",      requestsHandled: 51 },
  { id: "PWDV-03", name: "Komal Thorat",   mobile: "90099 44112", stop: "Saswad",      lat: 18.3410, lng: 74.0169, status: "AVAILABLE", requestsHandled: 19 },
  { id: "PWDV-04", name: "Digvijay Pisal", mobile: "93244 61120", stop: "Jejuri",      lat: 18.2802, lng: 74.1580, status: "AVAILABLE", requestsHandled: 27 },
  { id: "PWDV-05", name: "Manisha Gaikwad",mobile: "91122 30987", stop: "Phaltan",     lat: 17.9906, lng: 74.6438, status: "OFFLINE",   requestsHandled: 12 },
  { id: "PWDV-06", name: "Suresh Londhe",  mobile: "88990 12233", stop: "Alandi",      lat: 18.6633, lng: 73.8828, status: "AVAILABLE", requestsHandled: 40 }
];

/* `emergencyContact` is sensitive — never render it in a public/unauthenticated
   view. Admin pages must gate it behind the authorized-access check in
   pwd-assistance.html (see pwdRevealContact()). */
const PWD_REQUESTS = [
  {
    id: "PWD-3081", varkariId: "VKW-90211", varkariName: "Ashok Bhandare",
    assistanceType: "Wheelchair Assistance",
    description: "Needs a wheelchair and an escort from the Wakhari halt to the medical tent — knee mobility issue.",
    stop: "Wakhari", lat: 17.7295, lng: 75.3010,
    requestTime: "10:05 AM", priority: "High",
    volunteer: "Unassigned", volunteerId: null,
    status: "Pending", emergencyContact: "94211 30988 (son — Prakash)",
    escalatedToSOS: null
  },
  {
    id: "PWD-3080", varkariId: "VKW-88450", varkariName: "Shalan Pawar",
    assistanceType: "Visual Impairment Guide",
    description: "Visually impaired Varkari requesting a guide for the darshan queue at Pandharpur.",
    stop: "Pandharpur", lat: 17.6798, lng: 75.3320,
    requestTime: "09:52 AM", priority: "Medium",
    volunteer: "Arjun Nikam", volunteerId: "PWDV-02",
    status: "On the Way", emergencyContact: "90210 44556 (daughter — Kavita)",
    escalatedToSOS: null
  },
  {
    id: "PWD-3079", varkariId: "VKW-77320", varkariName: "Namdev Jagtap",
    assistanceType: "Mobility Support",
    description: "Elderly Varkari with a walking frame needs support crossing the Saswad crowd junction.",
    stop: "Saswad", lat: 18.3415, lng: 74.0175,
    requestTime: "09:30 AM", priority: "Medium",
    volunteer: "Komal Thorat", volunteerId: "PWDV-03",
    status: "Accepted", emergencyContact: "98230 11290 (wife — Sunanda)",
    escalatedToSOS: null
  },
  {
    id: "PWD-3078", varkariId: "VKW-65120", varkariName: "Yamuna Kale",
    assistanceType: "Hearing Assistance",
    description: "Hearing-impaired Varkari needs help understanding announcements near the Jejuri stop.",
    stop: "Jejuri", lat: 18.2808, lng: 74.1585,
    requestTime: "09:12 AM", priority: "Low",
    volunteer: "Digvijay Pisal", volunteerId: "PWDV-04",
    status: "Reached", emergencyContact: "96330 77812 (son — Vitthal)",
    escalatedToSOS: null
  },
  {
    id: "PWD-3077", varkariId: "VKW-51033", varkariName: "Ramabai Salunkhe",
    assistanceType: "Medical Equipment Help",
    description: "Needs a spare oxygen cannula tube and help setting up a portable concentrator.",
    stop: "Phaltan", lat: 17.9910, lng: 74.6445,
    requestTime: "08:40 AM", priority: "High",
    volunteer: "Manisha Gaikwad", volunteerId: "PWDV-05",
    status: "Resolved", emergencyContact: "97700 55321 (grandson — Omkar)",
    escalatedToSOS: null
  },
  {
    id: "PWD-3076", varkariId: "VKW-40988", varkariName: "Tukaram Bhosale",
    assistanceType: "Wheelchair Assistance",
    description: "Wheelchair broke down mid-route; became unresponsive on arrival, escalated to Emergency.",
    stop: "Alandi", lat: 18.6640, lng: 73.8835,
    requestTime: "Yesterday", priority: "High",
    volunteer: "Suresh Londhe", volunteerId: "PWDV-06",
    status: "Resolved", emergencyContact: "99887 20044 (nephew — Ganesh)",
    escalatedToSOS: "EMG-1037"
  },
  {
    id: "PWD-3075", varkariId: "VKW-38210", varkariName: "Indira Shelar",
    assistanceType: "Elderly / Frail Support",
    description: "Frail elderly Varkari requesting an escort and rest breaks between Barad and Natepute.",
    stop: "Barad", lat: 17.9500, lng: 74.7600,
    requestTime: "Yesterday", priority: "Low",
    volunteer: "Unassigned", volunteerId: null,
    status: "Cancelled", emergencyContact: "93421 66710 (daughter — Meera)",
    escalatedToSOS: null
  }
];
