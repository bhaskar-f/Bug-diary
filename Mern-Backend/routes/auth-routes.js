import express from "express";

import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  deleteProfile,
} from "../controllers/auth-controller.js";
import { protect } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/profile", protect, getMe);
router.put("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteProfile);

export default router;
