import { config, checkConfig, useCloudinary } from "./utils/config.js";
import { connectDB } from "./database/db.js";
import { createApp } from "./app.js";

async function start() {
  checkConfig();
  await connectDB();
  const app = createApp();
  app.listen(config.port, () => {
    console.log(`✓ RGE API running on http://localhost:${config.port}`);
    console.log(`  Storage: ${useCloudinary ? "Cloudinary" : "local disk (Backend/uploads)"}`);
    console.log(`  Website allowed: ${config.frontendUrls.join(", ")}`);
  });
}

start().catch((err) => {
  console.error("✗ Could not start the API:", err.message);
  process.exit(1);
});
