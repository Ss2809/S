import express from "express";
import {
  createSOS,
  getAllSOS,
  getSOSByUser,
  updateSOSStatus,
  assignVolunteer
} from "../controllers/sosController.js";

const router = express.Router();

router.post("/", createSOS);
router.get("/", getAllSOS);
router.get("/user/:userId", getSOSByUser);
router.patch("/:id/status", updateSOSStatus);
router.patch("/:id/assign", assignVolunteer);

export default router;
