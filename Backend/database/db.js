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
