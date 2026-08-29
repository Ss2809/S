import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      trim: true,
      default: "guest"
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true,
      default: ""
    },
    role: {
      type: String,
      enum: ["WARKARI", "VOLUNTEER", "ADMIN", "GUEST"],
      default: "WARKARI"
    },
    category: {
      type: String,
      enum: ["General", "Food", "Water", "Medical", "Cleanliness", "Security", "App Experience"],
      default: "General"
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["New", "Reviewed", "Resolved"],
      default: "New"
    }
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
