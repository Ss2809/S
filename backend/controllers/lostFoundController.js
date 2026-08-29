import LostFound from "../models/LostFound.js";
import Activity from "../models/Activity.js";

const DEFAULT_LOST_FOUND = [
  {
    type: "Lost",
    itemName: "Black Backpack",
    description: "Contains medicines & a water bottle",
    location: "Saswad crossing",
    date: "22 Aug",
    contactNumber: "+91 98230 11234",
    reporterName: "Sunita Pawar",
    reporterRole: "WARKARI",
    status: "Pending"
  },
  {
    type: "Lost",
    itemName: "Steel Water Bottle",
    description: "Blue colour, name tag 'Ganesh'",
    location: "Pune halt",
    date: "22 Aug",
    contactNumber: "+91 97663 33221",
    reporterName: "Ganesh Jadhav",
    reporterRole: "WARKARI",
    status: "Pending"
  },
  {
    type: "Found",
    itemName: "Prescription Glasses",
    description: "Found near Annachhatra camp · Held at Volunteer Desk",
    location: "Saswad Halt",
    date: "22 Aug",
    contactNumber: "+91 90xxxxx341",
    reporterName: "Pooja D.",
    reporterRole: "VOLUNTEER",
    status: "Approved"
  },
  {
    type: "Found",
    itemName: "Cloth Bag with Documents",
    description: "Found near Saswad water point · Held at Police Chowki",
    location: "Saswad water point",
    date: "21 Aug",
    contactNumber: "+91 98220 11987",
    reporterName: "Ramesh K.",
    reporterRole: "VOLUNTEER",
    status: "Claimed"
  },
  {
    type: "Found",
    itemName: "Identity Card & Documents",
    description: "Wari registration card and Aadhar photocopy",
    location: "Wakhri Crossing",
    date: "19 Aug",
    contactNumber: "+91 90112 55621",
    reporterName: "Anita J.",
    reporterRole: "VOLUNTEER",
    status: "Closed"
  }
];

export const seedLostFound = async () => {
  try {
    const count = await LostFound.countDocuments();
    if (count === 0) {
      console.log("Seeding default Lost & Found items into MongoDB...");
      await LostFound.insertMany(DEFAULT_LOST_FOUND);
    }
  } catch (err) {
    console.error("Lost & Found seed error:", err.message);
  }
};

export const getLostFoundItems = async (req, res) => {
  try {
    const { type, status, search } = req.query;
    const filter = {};

    if (type && type !== "All") filter.type = type;
    if (status && status !== "All Status") filter.status = status;
    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { itemName: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
        { reporterName: searchRegex }
      ];
    }

    const items = await LostFound.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (err) {
    console.error("Get LostFound error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createLostFoundItem = async (req, res) => {
  try {
    const { type, itemName, description, location, contactNumber, reporterName, reporterRole } = req.body;

    if (!itemName) {
      return res.status(400).json({ success: false, message: "Item name is required" });
    }

    const item = await LostFound.create({
      type: type || "Lost",
      itemName: itemName.trim(),
      description: description ? description.trim() : "",
      location: location ? location.trim() : "Wari Route",
      contactNumber: contactNumber ? contactNumber.trim() : "",
      reporterName: reporterName ? reporterName.trim() : "Warkari",
      reporterRole: reporterRole || "WARKARI",
      status: reporterRole === "ADMIN" ? "Approved" : "Pending"
    });

    await Activity.create({
      userId: req.body.userId || "user",
      userName: item.reporterName,
      userRole: item.reporterRole,
      actionType: "LOST_FOUND_REPORTED",
      title: `New ${item.type} Item Reported`,
      description: `${item.itemName} at ${item.location}`,
      relatedType: "LOST_FOUND",
      relatedId: item._id.toString()
    });

    return res.status(201).json({ success: true, data: item });
  } catch (err) {
    console.error("Create LostFound error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateLostFoundStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const item = await LostFound.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after", runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    await Activity.create({
      userId: req.body.adminId || "admin",
      userName: "Admin",
      userRole: "ADMIN",
      actionType: "LOST_FOUND_STATUS_CHANGED",
      title: `Item Status: ${status}`,
      description: `${item.itemName} marked as ${status}`,
      relatedType: "LOST_FOUND",
      relatedId: item._id.toString()
    });

    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    console.error("Update LostFound status error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteLostFoundItem = async (req, res) => {
  try {
    const item = await LostFound.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    return res.status(200).json({ success: true, message: "Item deleted successfully" });
  } catch (err) {
    console.error("Delete LostFound error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
