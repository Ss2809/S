import express from "express";
import {
  updateLocation,
  getLocations
} from "../controllers/locationController.js";

const router = express.Router();

router.post("/update", updateLocation);
router.get("/", getLocations);

export default router;