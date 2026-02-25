import express from "express";
import {
  createBug,
  getBugs,
  updateBug,
  deleteBug,
  togglePin,
  toggleArchive,
} from "../controllers/bug-controler.js";
import { protect } from "../middlewares/auth-middleware.js";

const router = express.Router();

//public
router.get("/", protect, getBugs);

// Protected
router.post("/", protect, createBug);
router.put("/:id", protect, updateBug);
router.delete("/:id", protect, deleteBug);
router.patch("/:id/pin", protect, togglePin);
router.patch("/:id/archive", protect, toggleArchive);

export default router;
