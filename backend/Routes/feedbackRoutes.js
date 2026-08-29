import express from "express";
import {
  getFeedback,
  createFeedback,
  updateFeedbackStatus
} from "../controllers/feedbackController.js";

const router = express.Router();

router.get("/", getFeedback);
router.post("/", createFeedback);
router.patch("/:id/status", updateFeedbackStatus);

export default router;
