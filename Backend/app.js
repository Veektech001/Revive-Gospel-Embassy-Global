import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./utils/config.js";
import { IMAGE_DIR } from "./utils/storage.js";
import { authRoutes, userRoutes } from "./routes/authRoutes.js";
import sermonRoutes from "./routes/sermonRoutes.js";
import { visitorRoutes, newsletterRoutes } from "./routes/formRoutes.js";
import { notFound, errorHandler } from "./middleWare/errorHandler.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1); // correct client IPs behind Render/Railway/Vercel proxies
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(
    cors({
      origin(origin, cb) {
        // Allow the website(s) in FRONTEND_URL, plus tools with no origin (curl, Postman)
        if (!origin || config.frontendUrls.includes(origin)) return cb(null, true);
        cb(null, false);
      },
    })
  );
  app.use(express.json({ limit: "100kb" }));

  app.get("/api/health", (req, res) => res.json({ ok: true }));

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/sermons", sermonRoutes);
  app.use("/api/visitors", visitorRoutes);
  app.use("/api/newsletter", newsletterRoutes);

  // Cover photos saved locally (when Cloudinary isn't set up). Audio is NOT served here.
  app.use("/uploads/images", express.static(IMAGE_DIR, { maxAge: "7d" }));

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
