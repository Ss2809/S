import Activity from "../models/Activity.js";

const DEFAULT_ACTIVITIES = [
  { userId: "SWCV-2026-1042", userName: "Anita Kulkarni", userRole: "VOLUNTEER", actionType: "SOS_ACCEPTED", title: "Accepted Cardiac Distress SOS", description: "Dispatched Emergency Van AMB-004 to Saswad crossing", relatedType: "SOS" },
  { userId: "SWCV-2026-1042", userName: "Anita Kulkarni", userRole: "VOLUNTEER", actionType: "PWD_ACCEPTED", title: "Accepted Wheelchair Assistance", description: "Assisted senior warkari at Jejuri base camp", relatedType: "PWD" },
  { userId: "ADMIN-001", userName: "System Administrator", userRole: "ADMIN", actionType: "BROADCAST_SENT", title: "Weather Broadcast Alert", description: "Broadcast alert sent to All Warkaris regarding rain", relatedType: "NOTIFICATION" },
  { userId: "VOL-001", userName: "Ramesh Kadam", userRole: "VOLUNTEER", actionType: "SOS_RESOLVED", title: "Resolved Fall / Injury SOS", description: "Warkari escorted to primary medical camp", relatedType: "SOS" }
];

export const seedActivities = async () => {
  try {
    const count = await Activity.countDocuments();
    if (count === 0) {
      console.log("Seeding default Activity / Audit log entries into MongoDB...");
      await Activity.insertMany(DEFAULT_ACTIVITIES);
    }
  } catch (err) {
    console.error("Activity seed error:", err.message);
  }
};

export const getActivities = async (req, res) => {
  try {
    const { userId, role, actionType, limit = 50 } = req.query;
    const filter = {};

    if (userId) filter.userId = userId;
    if (role) filter.userRole = role.toUpperCase();
    if (actionType) filter.actionType = actionType;

    const activities = await Activity.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (err) {
    console.error("Get activities error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createActivity = async (req, res) => {
  try {
    const { userId, userName, userRole, actionType, title, description, relatedType, relatedId, metadata } = req.body;

    if (!actionType || !title) {
      return res.status(400).json({ success: false, message: "actionType and title are required" });
    }

    const activity = await Activity.create({
      userId: userId || "user",
      userName: userName || "User",
      userRole: userRole || "WARKARI",
      actionType,
      title,
      description: description || "",
      relatedType: relatedType || null,
      relatedId: relatedId || null,
      metadata: metadata || {}
    });

    return res.status(201).json({ success: true, data: activity });
  } catch (err) {
    console.error("Create activity error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
