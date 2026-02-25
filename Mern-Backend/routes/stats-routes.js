import express from "express";
import { getStatusOverview } from "../controllers/stats-controller.js";
import { protect } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.get("/overview", protect, getStatusOverview);

export default router;
