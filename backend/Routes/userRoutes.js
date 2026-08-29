import express from "express";
import {
  loginUser,
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/userController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
