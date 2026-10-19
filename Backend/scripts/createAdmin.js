// Creates an admin account, or turns an existing member into an admin.
//
//   npm run create-admin -- "Full Name" email@example.com "a-strong-password"
//
import { checkConfig } from "../utils/config.js";
import { connectDB, disconnectDB } from "../database/db.js";
import { User } from "../models/userModels.js";

const [name, emailArg, password] = process.argv.slice(2);
const email = (emailArg || "").toLowerCase().trim();

if (!name || !email || !password) {
  console.log('Usage: npm run create-admin -- "Full Name" email@example.com "password"');
  process.exit(1);
}
if (password.length < 8) {
  console.log("Password must be at least 8 characters.");
  process.exit(1);
}

checkConfig();
await connectDB();
let user = await User.findOne({ email });
if (user) {
  user.role = "admin";
  await user.setPassword(password);
  console.log(`✓ ${email} already existed. It is now an admin and the password was updated.`);
} else {
  user = new User({ name, email, role: "admin" });
  await user.setPassword(password);
  console.log(`✓ Admin account created for ${email}.`);
}
await user.save();
await disconnectDB();
