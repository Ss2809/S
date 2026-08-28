import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["WARKARI", "VOLUNTEER"],
      required: true
    },

    latitude: {
      type: Number,
      required: true
    },

    longitude: {
      type: Number,
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Location = mongoose.model("Location", locationSchema);

export default Location;