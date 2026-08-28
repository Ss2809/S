import mongoose from "mongoose";

const pwdRequestSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, trim: true },
    userName: { type: String, required: true, trim: true },
    assistanceType: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    locationLabel: { type: String, trim: true, default: "Live GPS location" },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "On the Way", "Reached", "Resolved", "Cancelled"],
      default: "Pending"
    },
    assignedVolunteerId: { type: String, trim: true, default: null },
    assignedVolunteerName: { type: String, trim: true, default: null },
    emergencyContact: { type: String, trim: true, default: "" },
    escalatedToSOS: { type: String, trim: true, default: null }
  },
  { timestamps: true }
);

const PWDRequest = mongoose.model("PWDRequest", pwdRequestSchema);

export default PWDRequest;
