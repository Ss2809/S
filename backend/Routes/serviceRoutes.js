import express from "express";
import {
  getWariServices,
  createWariService,
  updateWariService,
  deleteWariService
} from "../controllers/serviceController.js";

const router = express.Router();

router.get("/", getWariServices);
router.post("/", createWariService);
router.patch("/:id", updateWariService);
router.delete("/:id", deleteWariService);

export default router;
