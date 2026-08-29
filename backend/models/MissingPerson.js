import mongoose from "mongoose";

const missingPersonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number,
      default: null
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Male"
    },
    lastSeenLocation: {
      type: String,
      trim: true,
      default: "Wari Route"
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    contactNumber: {
      type: String,
      trim: true,
      default: ""
    },
    reporterName: {
      type: String,
      trim: true,
      default: "Family / Dindi Member"
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
      enum: ["Pending Verification", "Searching", "Approved", "Found", "Closed"],
      default: "Pending Verification"
    }
  },
  { timestamps: true }
);

const MissingPerson = mongoose.model("MissingPerson", missingPersonSchema);

export default MissingPerson;
