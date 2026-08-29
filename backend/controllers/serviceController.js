import WariService from "../models/WariService.js";

const DEFAULT_SERVICES = [
  // Food Camps
  { category: "FOOD", name: "Sant Tukaram Annachhatra Mandal", stop: "Saswad", location: "Near Saswad Bus Stand", latitude: 18.3410, longitude: 74.0169, details: "Free Mahaprasad served 24x7 (Khichdi, Tea, Breakfast)", contact: "+91 98220 11987", capacity: "High (5,000/hr)", status: "Active" },
  { category: "FOOD", name: "Dnyaneshwar Maharaj Seva Samiti Food Camp", stop: "Jejuri", location: "Jejuri Bypass Ground", latitude: 18.2802, longitude: 74.1580, details: "Full lunch and dinner meal distribution", contact: "+91 90112 55621", capacity: "Normal", status: "Active" },
  { category: "FOOD", name: "Phaltan Annadan Seva Trust", stop: "Phaltan", location: "Phaltan Market Yard", latitude: 17.9906, longitude: 74.6438, details: "Fresh meals, fruits, and hydration drinks", contact: "+91 99001 34521", capacity: "High", status: "Active" },

  // Water Points
  { category: "WATER", name: "Saswad Municipal Tanker Station", stop: "Saswad", location: "Saswad Old Highway Crossing", latitude: 18.3425, longitude: 74.0185, details: "4 continuous RO water tankers available", contact: "+91 96552 87012", capacity: "High", status: "Open" },
  { category: "WATER", name: "Jejuri Purified Water Tanker Hub", stop: "Jejuri", location: "Temple Base Junction", latitude: 18.2820, longitude: 74.1600, details: "Chilled and mineral water distribution", contact: "+91 98230 11234", capacity: "Normal", status: "Open" },
  { category: "WATER", name: "Wakhri RO Water Station", stop: "Wakhri", location: "Wakhri Main Halt Ground", latitude: 17.7300, longitude: 75.3000, details: "20,000L RO purified water supply", contact: "+91 90210 44567", capacity: "High", status: "Open" },

  // Medical Camps
  { category: "MEDICAL", name: "Dr. Kulkarni Wari Medical Camp", stop: "Saswad", location: "Near Saswad Government School", latitude: 18.3400, longitude: 74.0150, details: "First aid, BP check, pain relief sprays, blister care", contact: "+91 98220 11987", capacity: "Busy", status: "Active" },
  { category: "MEDICAL", name: "Red Cross Mobile Emergency Medical Camp", stop: "Jejuri", location: "Jejuri Hospital Link Road", latitude: 18.2780, longitude: 74.1560, details: "Doctors on duty, ambulance standby, ORS packets", contact: "+91 90112 55621", capacity: "Normal", status: "Active" },
  { category: "MEDICAL", name: "Phaltan Seva Medical Relief Point", stop: "Phaltan", location: "Phaltan Bypass Tent 4", latitude: 17.9890, longitude: 74.6420, details: "Cardiac monitoring, glucose check, emergency response", contact: "+91 99001 34521", capacity: "Normal", status: "Active" },

  // Hospitals
  { category: "HOSPITAL", name: "Saswad Rural Hospital", stop: "Saswad", location: "Pune Road, Saswad", latitude: 18.3410, longitude: 74.0169, details: "Government hospital with ICU & 24x7 Casualty", contact: "02114-221190", capacity: "11 / 40 Beds", status: "Open" },
  { category: "HOSPITAL", name: "Civil Hospital Pandharpur", stop: "Pandharpur", location: "Station Road, Pandharpur", latitude: 17.6792, longitude: 75.3316, details: "Major district government hospital with trauma unit", contact: "02186-223344", capacity: "42 / 120 Beds", status: "Open" },
  { category: "HOSPITAL", name: "Phaltan Multispecialty Hospital", stop: "Phaltan", location: "Malshiras Road, Phaltan", latitude: 17.9906, longitude: 74.6438, details: "Empaneled private facility with emergency support", contact: "02166-241900", capacity: "6 / 25 Beds", status: "Near Capacity" },

  // Stops
  { category: "STOP", name: "Alandi Start Point", stop: "Alandi", location: "Indrayani River Ghat", latitude: 18.6633, longitude: 73.8828, details: "Palkhi Prasthan starting station", status: "Active" },
  { category: "STOP", name: "Pune Halt", stop: "Pune", location: "Bhavani Peth Palkhi Vithoba Mandir", latitude: 18.5204, longitude: 73.8567, details: "Major twin-city halt point", status: "Active" },
  { category: "STOP", name: "Saswad Halt", stop: "Saswad", location: "Saswad Camping Grounds", latitude: 18.3410, longitude: 74.0169, details: "Day 3 halt — Dive Ghat descent", status: "Active" },
  { category: "STOP", name: "Jejuri Halt", stop: "Jejuri", location: "Khandoba Foothills", latitude: 18.2802, longitude: 74.1580, details: "Day 4 halt point with massive congregation", status: "Active" },
  { category: "STOP", name: "Pandharpur Concluding Halt", stop: "Pandharpur", location: "Chandrabhaga River Bed", latitude: 17.6792, longitude: 75.3316, details: "Ashadhi Ekadashi final holy destination", status: "Active" }
];

export const seedWariServices = async () => {
  try {
    const count = await WariService.countDocuments();
    if (count === 0) {
      console.log("Seeding default Wari Services & Camp locations into MongoDB...");
      await WariService.insertMany(DEFAULT_SERVICES);
    }
  } catch (err) {
    console.error("Wari Services seed error:", err.message);
  }
};

export const getWariServices = async (req, res) => {
  try {
    const { category, stop, status, search } = req.query;
    const filter = {};

    if (category && category !== "ALL") filter.category = category.toUpperCase();
    if (stop && stop !== "All Stops") filter.stop = new RegExp(stop, "i");
    if (status && status !== "All Status") filter.status = status;

    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { name: searchRegex },
        { location: searchRegex },
        { details: searchRegex },
        { stop: searchRegex }
      ];
    }

    const services = await WariService.find(filter).sort({ category: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (err) {
    console.error("Get WariServices error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createWariService = async (req, res) => {
  try {
    const { category, name, stop, location, latitude, longitude, details, contact, capacity, status, managedBy } = req.body;

    if (!category || !name) {
      return res.status(400).json({ success: false, message: "Category and Name are required" });
    }

    const service = await WariService.create({
      category: category.toUpperCase(),
      name: name.trim(),
      stop: stop || "Pune",
      location: location || "",
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      details: details || "",
      contact: contact || "",
      capacity: capacity || "Normal",
      status: status || "Active",
      managedBy: managedBy || "Temple Trust"
    });

    return res.status(201).json({ success: true, data: service });
  } catch (err) {
    console.error("Create WariService error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateWariService = async (req, res) => {
  try {
    const service = await WariService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after", runValidators: true }
    );

    if (!service) return res.status(404).json({ success: false, message: "Service not found" });

    return res.status(200).json({ success: true, data: service });
  } catch (err) {
    console.error("Update WariService error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteWariService = async (req, res) => {
  try {
    const service = await WariService.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    return res.status(200).json({ success: true, message: "Service deleted successfully" });
  } catch (err) {
    console.error("Delete WariService error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
