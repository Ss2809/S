/* ==========================================================================
   Smart Wari Connect — Emergency module sample data
   Single source of truth for every emergency page (requests, vans,
   volunteers, wari stops, medical centers). This is demo data only —
   this file is the one place to swap in real API/database calls; every
   page below just reads from these arrays.
   ========================================================================== */

/* Official Wari route order, start to finish */
const WARI_STOPS = [
  "Alandi","Pune","Saswad","Jejuri","Valhe","Taradgaon","Phaltan","Barad",
  "Natepute","Purandawade","Barapur","Bhandishegaon","Wakhari","Pandharpur"
];

/* lat/lng for the map — approximate points along the route corridor */
const WARI_STOP_COORDS = {
  "Alandi": [18.6633, 73.8828], "Pune": [18.5204, 73.8567], "Saswad": [18.3410, 74.0169],
  "Jejuri": [18.2802, 74.1580], "Valhe": [18.2277, 74.1972], "Taradgaon": [18.1450, 74.3100],
  "Phaltan": [17.9906, 74.6438], "Barad": [17.9500, 74.7600], "Natepute": [17.9350, 74.9300],
  "Purandawade": [17.9101, 75.0300], "Barapur": [17.8961, 75.1300], "Bhandishegaon": [17.8700, 75.2000],
  "Wakhari": [17.7300, 75.3000], "Pandharpur": [17.6792, 75.3316]
};

const EMERGENCY_REQUESTS = [
  { id: "EMG-1042", varkariId: "VKW-88210", varkariName: "Sunita Pawar", type: "Fall / Injury", stop: "Wakhari", volunteer: "Ramesh Kadam", van: "AMB-001", time: "10:42 AM", status: "ON THE WAY", lat: 17.7280, lng: 75.3050 },
  { id: "EMG-1041", varkariId: "VKW-77104", varkariName: "Dattatray Shinde", type: "Dehydration", stop: "Pandharpur", volunteer: "Anita Jagtap", van: "AMB-003", time: "10:31 AM", status: "PENDING", lat: 17.6792, lng: 75.3316 },
  { id: "EMG-1040", varkariId: "VKW-65590", varkariName: "Baban Kale", type: "Heat Stroke", stop: "Saswad", volunteer: "Unassigned", van: "—", time: "09:58 AM", status: "PENDING", lat: 18.3410, lng: 74.0169 },
  { id: "EMG-1039", varkariId: "VKW-51287", varkariName: "Meera Kulkarni", type: "Fracture", stop: "Jejuri", volunteer: "Vikram Salunkhe", van: "AMB-002", time: "09:20 AM", status: "ARRIVED", lat: 18.2802, lng: 74.1580 },
  { id: "EMG-1038", varkariId: "VKW-40033", varkariName: "Ganesh More", type: "Chest Pain", stop: "Phaltan", volunteer: "Pooja Deshmukh", van: "AMB-004", time: "08:47 AM", status: "COMPLETED", lat: 17.9906, lng: 74.6438 },
  { id: "EMG-1037", varkariId: "VKW-38821", varkariName: "Kaveri Jadhav", type: "Fall / Injury", stop: "Alandi", volunteer: "Ramesh Kadam", van: "AMB-001", time: "Yesterday", status: "CANCELLED", lat: 18.6633, lng: 73.8828 }
];

const EMERGENCY_VANS = [
  { number: "AMB-001", type: "Ambulance", volunteer: "Ramesh Kadam", stop: "Wakhari", status: "ON THE WAY", lat: 17.7280, lng: 75.3050, emergency: "EMG-1042", updated: "3s ago" },
  { number: "AMB-002", type: "Ambulance", volunteer: "Vikram Salunkhe", stop: "Jejuri", status: "AVAILABLE", lat: 18.2802, lng: 74.1580, emergency: "—", updated: "12s ago" },
  { number: "AMB-003", type: "Mini Van", volunteer: "Anita Jagtap", stop: "Pandharpur", status: "DISPATCHED", lat: 17.6805, lng: 75.3288, emergency: "EMG-1041", updated: "5s ago" },
  { number: "AMB-004", type: "Ambulance", volunteer: "Pooja Deshmukh", stop: "Phaltan", status: "AVAILABLE", lat: 17.9906, lng: 74.6438, emergency: "—", updated: "40s ago" },
  { number: "AMB-005", type: "Mini Van", volunteer: "Unassigned", stop: "Saswad", status: "OFFLINE", lat: 18.3410, lng: 74.0169, emergency: "—", updated: "1h ago" }
];

/* Mirrors the existing Hospital Network rows (hospitals.html), extended
   with the Wari Stop / lat-lng / medical-center fields the emergency
   module needs — same entities, no duplicate list. */
const MEDICAL_CENTERS = [
  { name: "Civil Hospital Pandharpur", type: "Government", address: "Station Road, Pandharpur", contact: "02186-223344", beds: "42 / 120", stop: "Pandharpur", lat: 17.6792, lng: 75.3316, status: "Open" },
  { name: "Saswad Rural Hospital", type: "Government", address: "Pune Road, Saswad", contact: "02114-221190", beds: "11 / 40", stop: "Saswad", lat: 18.3410, lng: 74.0169, status: "Open" },
  { name: "Phaltan Multispecialty", type: "Private (Empaneled)", address: "Malshiras Road, Phaltan", contact: "02166-241900", beds: "6 / 25", stop: "Phaltan", lat: 17.9906, lng: 74.6438, status: "Near Capacity" }
];
