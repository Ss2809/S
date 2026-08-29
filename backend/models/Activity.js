import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      trim: true,
      default: "system"
    },
    userName: {
      type: String,
      trim: true,
      default: "System"
    },
    userRole: {
      type: String,
      enum: ["WARKARI", "VOLUNTEER", "ADMIN", "SYSTEM"],
      default: "SYSTEM"
    },
    actionType: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    relatedType: {
      type: String,
      trim: true,
      default: null
    },
    relatedId: {
      type: String,
      trim: true,
      default: null
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
