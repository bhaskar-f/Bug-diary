import dns from "node:dns";
import mongoose from "mongoose";

function configureDnsForMongo() {
  const raw = process.env.MONGO_DNS_SERVERS || "";
  if (!raw.trim()) return;

  const servers = raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (servers.length === 0) return;

  try {
    dns.setServers(servers);
    console.log(`Using custom DNS servers for MongoDB: ${servers.join(", ")}`);
  } catch (err) {
    console.warn("Invalid MONGO_DNS_SERVERS value:", err.message);
  }
}

export const connectDB = async () => {
  try {
    configureDnsForMongo();
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw err;
  }
};
