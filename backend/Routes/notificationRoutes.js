import express from "express";
import {
  getNotifications,
  getUnreadCount,
  createCustomNotification,
  markNotificationRead,
  markAllNotificationsRead
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.post("/", createCustomNotification);
router.patch("/read-all", markAllNotificationsRead);
router.patch("/:id/read", markNotificationRead);

export default router;
