import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import mongoose from "mongoose";
import { config } from "../utils/config.js";

export async function connectDB(uri = config.mongoUri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log(`✓ MongoDB connected (${mongoose.connection.name})`);
  return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
