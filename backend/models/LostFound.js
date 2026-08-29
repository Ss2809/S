import mongoose from "mongoose";

const lostFoundSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Lost", "Found"],
      required: true,
      default: "Lost"
    },
    itemName: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    location: {
      type: String,
      trim: true,
      default: "Wari Route"
    },
    date: {
      type: String,
      default: () => new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
    },
    contactNumber: {
      type: String,
      trim: true,
      default: ""
    },
    reporterName: {
      type: String,
      trim: true,
      default: "Warkari"
    },
    reporterRole: {
      type: String,
      enum: ["WARKARI", "VOLUNTEER", "ADMIN"],
      default: "WARKARI"
    },
    photoUrl: {
      type: String,
      default: "assets/images/avatar-placeholder.svg"
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Claimed", "Closed"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

const LostFound = mongoose.model("LostFound", lostFoundSchema);

export default LostFound;
