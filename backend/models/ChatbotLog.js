import mongoose from "mongoose";

const chatbotLogSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: "guest",
      trim: true
    },
    userName: {
      type: String,
      default: "Warkari",
      trim: true
    },
    question: {
      type: String,
      required: true,
      trim: true
    },
    answer: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ["Route", "Medical", "Food", "Water", "Weather", "Halt", "SOS", "PWD", "Lost & Found", "Other"],
      default: "Other"
    },
    outcome: {
      type: String,
      enum: ["Answered", "Unanswered", "Escalated"],
      default: "Answered"
    }
  },
  {
    timestamps: true
  }
);

const ChatbotLog = mongoose.model("ChatbotLog", chatbotLogSchema);

export default ChatbotLog;
