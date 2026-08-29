import express from "express";
import {
  getMissingPersons,
  createMissingPersonReport,
  updateMissingPersonStatus,
  deleteMissingPersonReport
} from "../controllers/missingPersonController.js";

const router = express.Router();

router.get("/", getMissingPersons);
router.post("/", createMissingPersonReport);
router.patch("/:id/status", updateMissingPersonStatus);
router.delete("/:id", deleteMissingPersonReport);

export default router;
