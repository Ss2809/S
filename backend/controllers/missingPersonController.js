import MissingPerson from "../models/MissingPerson.js";
import Activity from "../models/Activity.js";

const DEFAULT_MISSING_PERSONS = [
  {
    name: "Baban Kale",
    age: 68,
    gender: "Male",
    lastSeenLocation: "Saswad Junction",
    description: "Wearing white shirt, saffron dhoti, carrying a wooden stick",
    contactNumber: "+91 88880 23145",
    reporterName: "Volunteer — Ramesh K.",
    reporterRole: "VOLUNTEER",
    status: "Searching"
  },
  {
    name: "Yamuna Bhosale",
    age: 74,
    gender: "Female",
    lastSeenLocation: "Alandi Start Point",
    description: "Green navari saree, carrying cloth bag with tulsi mala",
    contactNumber: "+91 98765 43210",
    reporterName: "Family member",
    reporterRole: "WARKARI",
    status: "Pending Verification"
  },
  {
    name: "Sunita More",
    age: 54,
    gender: "Female",
    lastSeenLocation: "Pune crossing",
    description: "Green saree, gold nose ring, carrying a cloth bag",
    contactNumber: "+91 99870 78123",
    reporterName: "Dindi Member",
    reporterRole: "WARKARI",
    status: "Searching"
  },
  {
    name: "Kisan Pawar",
    age: 59,
    gender: "Male",
    lastSeenLocation: "Wakhri Crossing",
    description: "White kurta, Marathi cap, glasses",
    contactNumber: "+91 90210 44567",
    reporterName: "Self-registered",
    reporterRole: "WARKARI",
    status: "Found"
  },
  {
    name: "Lata Gaikwad",
    age: 66,
    gender: "Female",
    lastSeenLocation: "Jejuri Junction",
    description: "Red saree, walking with stick",
    contactNumber: "+91 90112 55621",
    reporterName: "Volunteer — Anita J.",
    reporterRole: "VOLUNTEER",
    status: "Closed"
  }
];

export const seedMissingPersons = async () => {
  try {
    const count = await MissingPerson.countDocuments();
    if (count === 0) {
      console.log("Seeding default Missing Persons reports into MongoDB...");
      await MissingPerson.insertMany(DEFAULT_MISSING_PERSONS);
    }
  } catch (err) {
    console.error("Missing Persons seed error:", err.message);
  }
};

export const getMissingPersons = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== "All Status") filter.status = status;
    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { name: searchRegex },
        { lastSeenLocation: searchRegex },
        { description: searchRegex },
        { reporterName: searchRegex }
      ];
    }

    const reports = await MissingPerson.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (err) {
    console.error("Get MissingPersons error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createMissingPersonReport = async (req, res) => {
  try {
    const { name, age, gender, lastSeenLocation, description, contactNumber, reporterName, reporterRole } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Person name is required" });
    }

    const report = await MissingPerson.create({
      name: name.trim(),
      age: age ? Number(age) : null,
      gender: gender || "Male",
      lastSeenLocation: lastSeenLocation ? lastSeenLocation.trim() : "Wari Route",
      description: description ? description.trim() : "",
      contactNumber: contactNumber ? contactNumber.trim() : "",
      reporterName: reporterName ? reporterName.trim() : "Family Member",
      reporterRole: reporterRole || "WARKARI",
      status: reporterRole === "ADMIN" ? "Searching" : "Pending Verification"
    });

    await Activity.create({
      userId: req.body.userId || "user",
      userName: report.reporterName,
      userRole: report.reporterRole,
      actionType: "MISSING_PERSON_REPORTED",
      title: `Missing Person Reported: ${report.name}`,
      description: `Last seen at ${report.lastSeenLocation}`,
      relatedType: "MISSING_PERSON",
      relatedId: report._id.toString()
    });

    return res.status(201).json({ success: true, data: report });
  } catch (err) {
    console.error("Create MissingPerson error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateMissingPersonStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const report = await MissingPerson.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after", runValidators: true }
    );

    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    await Activity.create({
      userId: req.body.adminId || "admin",
      userName: "Admin",
      userRole: "ADMIN",
      actionType: "MISSING_PERSON_STATUS_CHANGED",
      title: `Report Updated: ${report.name}`,
      description: `Status changed to ${status}`,
      relatedType: "MISSING_PERSON",
      relatedId: report._id.toString()
    });

    return res.status(200).json({ success: true, data: report });
  } catch (err) {
    console.error("Update MissingPerson status error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteMissingPersonReport = async (req, res) => {
  try {
    const report = await MissingPerson.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });
    return res.status(200).json({ success: true, message: "Report deleted successfully" });
  } catch (err) {
    console.error("Delete MissingPerson error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
