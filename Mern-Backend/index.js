import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import bugRoutes from "./routes/bug-routes.js";
import authRoutes from "./routes/auth-routes.js";
import statsRoutes from "./routes/stats-routes.js";
import exportRoutes from "./routes/export-routes.js";

dotenv.config();

const app = express();
const isVercel = Boolean(process.env.VERCEL);
let dbConnectionPromise = null;

function ensureDbConnection() {
  if (!dbConnectionPromise) {
    dbConnectionPromise = connectDB();
  }
  return dbConnectionPromise;
}

const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests and local dev when FRONTEND_URL is not set.
      if (!origin || allowedOrigins.length === 0) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await ensureDbConnection();
    next();
  } catch (error) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.use("/api/bugs", exportRoutes, bugRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/stats", statsRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Api is running" });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  await ensureDbConnection();
  app.listen(PORT, () => {
    console.log("server is running at port " + PORT);
  });
}

if (!isVercel) {
  startServer().catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
}

export default app;
