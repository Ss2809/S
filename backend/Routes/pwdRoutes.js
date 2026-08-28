import express from "express";
import {
  createPWDRequest,
  getPWDRequests,
  updatePWDStatus,
  assignPWDVolunteer
} from "../controllers/pwdController.js";

const router = express.Router();

router.post("/", createPWDRequest);
router.get("/", getPWDRequests);
router.patch("/:id/status", updatePWDStatus);
router.patch("/:id/assign", assignPWDVolunteer);

export default router;
