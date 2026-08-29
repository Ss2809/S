import express from "express";
import {
  askQuestion,
  getChatbotLogs
} from "../controllers/chatbotController.js";

const router = express.Router();

router.post("/ask", askQuestion);
router.get("/logs", getChatbotLogs);

export default router;
