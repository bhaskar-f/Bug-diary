import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import bugRoutes from "./routes/bug-routes.js";
import authRoutes from "./routes/auth-routes.js";
import statsRoutes from "./routes/stats-routes.js";
import exportRoutes from "./routes/export-routes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/bugs", exportRoutes, bugRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/stats", statsRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Api is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("server is running at port" + PORT);
});
