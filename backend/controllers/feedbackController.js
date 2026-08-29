import Feedback from "../models/Feedback.js";
import Activity from "../models/Activity.js";

const DEFAULT_FEEDBACK = [
  { name: "Sunil Bhosale", phone: "+91 98xxxxx210", role: "WARKARI", category: "Food", rating: 5, message: "Annachhatra food distribution near Saswad was well organized and hygienic.", status: "Reviewed" },
  { name: "Anita Kulkarni", phone: "+91 90xxxxx341", role: "VOLUNTEER", category: "Medical", rating: 5, message: "Emergency Van dispatch workflow is very responsive and fast.", status: "Reviewed" },
  { name: "Dattatray Shinde", phone: "90210 44567", role: "WARKARI", category: "Water", rating: 4, message: "More water tankers needed near the afternoon climb at Dive Ghat.", status: "New" },
  { name: "Ramesh Kadam", phone: "98220 11987", role: "VOLUNTEER", category: "Security", rating: 5, message: "Volunteer live tracking helped locate the missing elderly warkari in 15 minutes.", status: "Reviewed" }
];

export const seedFeedback = async () => {
  try {
    const count = await Feedback.countDocuments();
    if (count === 0) {
      console.log("Seeding default Feedback entries into MongoDB...");
      await Feedback.insertMany(DEFAULT_FEEDBACK);
    }
  } catch (err) {
    console.error("Feedback seed error:", err.message);
  }
};

export const getFeedback = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    const filter = {};

    if (category && category !== "All Categories") filter.category = category;
    if (status && status !== "All Status") filter.status = status;
    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { name: searchRegex },
        { message: searchRegex },
        { category: searchRegex }
      ];
    }

    const items = await Feedback.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (err) {
    console.error("Get feedback error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createFeedback = async (req, res) => {
  try {
    const { name, phone, role, category, rating, message, userId } = req.body;

    if (!name || !message) {
      return res.status(400).json({ success: false, message: "Name and message are required" });
    }

    const item = await Feedback.create({
      userId: userId || "guest",
      name: name.trim(),
      phone: phone ? phone.trim() : "",
      role: role || "WARKARI",
      category: category || "General",
      rating: rating ? Number(rating) : 5,
      message: message.trim(),
      status: "New"
    });

    await Activity.create({
      userId: item.userId,
      userName: item.name,
      userRole: item.role,
      actionType: "FEEDBACK_SUBMITTED",
      title: `Feedback: ${item.category} (${item.rating}★)`,
      description: item.message,
      relatedType: "FEEDBACK",
      relatedId: item._id.toString()
    });

    return res.status(201).json({ success: true, data: item });
  } catch (err) {
    console.error("Create feedback error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const item = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after", runValidators: true }
    );

    if (!item) return res.status(404).json({ success: false, message: "Feedback not found" });

    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    console.error("Update feedback status error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
