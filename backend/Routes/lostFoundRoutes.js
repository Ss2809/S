import express from "express";
import {
  getLostFoundItems,
  createLostFoundItem,
  updateLostFoundStatus,
  deleteLostFoundItem
} from "../controllers/lostFoundController.js";

const router = express.Router();

router.get("/", getLostFoundItems);
router.post("/", createLostFoundItem);
router.patch("/:id/status", updateLostFoundStatus);
router.delete("/:id", deleteLostFoundItem);

export default router;
