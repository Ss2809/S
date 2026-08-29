import mongoose from "mongoose";

const wariServiceSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["FOOD", "WATER", "MEDICAL", "HOSPITAL", "STOP", "ROUTE"],
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    stop: {
      type: String,
      trim: true,
      default: "Pune"
    },
    location: {
      type: String,
      trim: true,
      default: ""
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    },
    details: {
      type: String,
      trim: true,
      default: ""
    },
    contact: {
      type: String,
      trim: true,
      default: ""
    },
    capacity: {
      type: String,
      trim: true,
      default: "Normal"
    },
    status: {
      type: String,
      enum: ["Active", "Busy", "Open", "Near Capacity", "Closed"],
      default: "Active"
    },
    managedBy: {
      type: String,
      trim: true,
      default: "Temple Trust / Seva Mandal"
    }
  },
  { timestamps: true }
);

const WariService = mongoose.model("WariService", wariServiceSchema);

export default WariService;
