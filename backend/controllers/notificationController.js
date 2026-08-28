import Notification from "../models/Notification.js";

export const createNotificationRecord = async ({
  audience = "ALL",
  userId = null,
  type = "SYSTEM",
  title,
  message,
  relatedType = null,
  relatedId = null
}) => {
  const notification = await Notification.create({
    audience,
    userId,
    type,
    title,
    message,
    relatedType,
    relatedId
  });

  return notification;
};

export const emitNotification = async (req, payload) => {
  const notification = await createNotificationRecord(payload);
  req.app.get("io")?.emit("notification:created", notification);
  return notification;
};

export const getNotifications = async (req, res) => {
  try {
    const { audience, userId } = req.query;
    const filter = {};

    if (audience) filter.audience = { $in: ["ALL", audience] };
    if (userId) filter.$or = [{ userId }, { userId: null }];

    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(100);

    return res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { returnDocument: "after", runValidators: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    console.error("Mark notification read error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
