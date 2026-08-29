import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true
    },
    phone: {
      type: String,
      trim: true
    },
    password: {
      type: String,
      default: "123456"
    },
    role: {
      type: String,
      enum: ["WARKARI", "VOLUNTEER", "ADMIN"],
      default: "WARKARI"
    },
    district: {
      type: String,
      default: "Pune",
      trim: true
    },
    bloodGroup: {
      type: String,
      default: "O+",
      trim: true
    },
    dindiName: {
      type: String,
      default: "Dnyaneshwar Maharaj Palkhi",
      trim: true
    },
    digitalId: {
      type: String,
      default: "Issued",
      trim: true
    },
    emergencyContactName: {
      type: String,
      default: "",
      trim: true
    },
    emergencyContactPhone: {
      type: String,
      default: "",
      trim: true
    },
    status: {
      type: String,
      enum: ["Active", "Pending", "Blocked", "Disabled"],
      default: "Active"
    },
    assignedArea: {
      type: String,
      default: "",
      trim: true
    },
    vanNumber: {
      type: String,
      default: "—",
      trim: true
    },
    availability: {
      type: String,
      enum: ["Available", "Busy", "On Emergency", "Off Duty", "Offline"],
      default: "Available"
    },
    requestsCompleted: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 4.8
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;
