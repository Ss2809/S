import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    audience: {
      type: String,
      enum: ["ALL", "ADMIN", "VOLUNTEER", "WARKARI"],
      default: "ALL"
    },
    userId: { type: String, trim: true, default: null },
    type: {
      type: String,
      trim: true,
      default: "SYSTEM"
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    relatedType: { type: String, trim: true, default: null },
    relatedId: { type: String, trim: true, default: null },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
