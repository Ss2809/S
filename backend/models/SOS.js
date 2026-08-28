import mongoose from "mongoose";

const sosSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true
    },

    userName: {
      type: String,
      required: true,
      trim: true
    },

    userRole: {
      type: String,
      default: "WARKARI",
      trim: true
    },

    emergencyType: {
      type: String,
      required: true,
      trim: true
    },

    message: {
      type: String,
      trim: true
    },

    latitude: {
      type: Number,
      required: true
    },

    longitude: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "ASSIGNED",
        "ACCEPTED",
        "ON_THE_WAY",
        "REACHED",
        "RESOLVED",
        "CANCELLED"
      ],
      default: "PENDING"
    },

    assignedVolunteerId: {
      type: String,
      default: null,
      trim: true
    },

    assignedVolunteerName: {
      type: String,
      default: null,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const SOS = mongoose.model("SOS", sosSchema);

export default SOS;
