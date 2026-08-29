import express from "express";
import {
  createPWDRequest,
  getPWDRequests,
  getPWDRequestById,
  updatePWDStatus,
  assignPWDVolunteer
} from "../controllers/pwdController.js";

const router = express.Router();

router.post("/", createPWDRequest);
router.get("/", getPWDRequests);
router.get("/:id", getPWDRequestById);
router.patch("/:id/status", updatePWDStatus);
router.patch("/:id/assign", assignPWDVolunteer);

export default router;
