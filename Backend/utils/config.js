// All settings come from environment variables (see .env.example).
import "dotenv/config";

const env = process.env;

export const config = {
  env: env.NODE_ENV || "development",
  port: Number(env.PORT) || 5000,
  mongoUri: env.MONGODB_URI || "mongodb://127.0.0.1:27017/rge",
  jwtSecret: env.JWT_SECRET || "",
  jwtExpiresIn: env.JWT_EXPIRES_IN || "7d",

  // Where the website lives. Used for CORS and for password-reset links.
  // Several addresses can be separated by commas.
  frontendUrls: (env.FRONTEND_URL || "http://localhost:5173")
    .split(",")
    .map((u) => u.trim().replace(/\/$/, ""))
    .filter(Boolean),

  // Public address of this API (used for local-storage download links)
  publicApiUrl: (env.PUBLIC_API_URL || "").replace(/\/$/, ""),

  maxAudioMb: Number(env.MAX_AUDIO_MB) || 100,
  maxImageMb: Number(env.MAX_IMAGE_MB) || 5,
  downloadLinkMinutes: Number(env.DOWNLOAD_LINK_MINUTES) || 10,

  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: env.CLOUDINARY_API_KEY || "",
    apiSecret: env.CLOUDINARY_API_SECRET || "",
    folder: env.CLOUDINARY_FOLDER || "rge",
  },

  smtp: {
    host: env.SMTP_HOST || "",
    port: Number(env.SMTP_PORT) || 587,
    user: env.SMTP_USER || "",
    pass: env.SMTP_PASS || "",
    from: env.EMAIL_FROM || "Revive Gospel Embassy <no-reply@rge.church>",
  },
};

export const isProduction = config.env === "production";
export const useCloudinary = Boolean(
  config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret
);

export function checkConfig() {
  if (!config.jwtSecret || config.jwtSecret.length < 32) {
    if (isProduction) {
      throw new Error("JWT_SECRET must be set to a random string of at least 32 characters.");
    }
    config.jwtSecret = "dev-only-secret-change-me-dev-only-secret-change-me";
    console.warn("⚠ JWT_SECRET is not set. Using a development secret. Never do this in production.");
  }
  if (isProduction && !useCloudinary) {
    console.warn("⚠ Cloudinary is not configured. Sermon files will be stored on this server's disk.");
  }
}
