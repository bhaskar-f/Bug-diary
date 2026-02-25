import express from "express";
import { protect } from "../middlewares/auth-middleware.js";
import { exportBugsAshtml } from "../controllers/export-controller.js";

const router = express.Router();

router.get("/export", protect, exportBugsAshtml);

export default router;
