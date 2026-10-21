// Checks the MongoDB connection string in .env without showing the password.
import fs from "node:fs";
import dns from "node:dns";
import dotenv from "dotenv";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const fromSystem = process.env.MONGODB_URI;           // set in Windows itself?
const fileText = fs.existsSync(".env") ? fs.readFileSync(".env", "utf8") : null;
if (!fileText) { console.log("✗ No .env file found in this folder. Run this from the Backend folder."); process.exit(1); }

const lines = fileText.split(/\r?\n/).filter((l) => l.trim().startsWith("MONGODB_URI"));
console.log(`MONGODB_URI lines in .env: ${lines.length}${lines.length > 1 ? "  ✗ more than one! Delete the extras." : ""}`);
if (fromSystem) console.log("✗ MONGODB_URI is ALSO set in Windows environment variables. That one wins over .env.");

dotenv.config();
const uri = process.env.MONGODB_URI || "";
const m = uri.match(/^mongodb(\+srv)?:\/\/([^:]*):(.*)@([^@/?]+)(\/[^?]*)?/);
if (!m) { console.log("✗ The connection string doesn't look like mongodb+srv://USER:PASSWORD@HOST/rge"); process.exit(1); }
const [, , user, pass, host, db] = m;

console.log(`Username: "${user}"`);
console.log(`Password: ${pass.length} characters, starts "${pass[0] || ""}…", ends "…${pass.slice(-1)}"`);
console.log(`Host: ${host}   Database: ${db || "(none)"}`);
if (/[<>]/.test(uri)) console.log("✗ Contains < or > : remove the angle brackets around the password.");
if (/["'\s]/.test(uri)) console.log("✗ Contains quotes or spaces : remove them.");
if (/[@:/?#%[\]]/.test(pass)) console.log("✗ Password has special characters (@ : / ? # %). Use letters and numbers only.");

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  console.log("✓ Connected to MongoDB successfully!");
} catch (e) {
  console.log("✗ Still failing:", e.message);
}
await mongoose.disconnect();