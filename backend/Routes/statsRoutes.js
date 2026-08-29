import express from "express";
import {
  getAdminStats,
  getVolunteerStats
} from "../controllers/statsController.js";

const router = express.Router();

router.get("/admin", getAdminStats);
router.get("/volunteer", getVolunteerStats);
router.get("/dashboard", getAdminStats); // alias

export default router;
