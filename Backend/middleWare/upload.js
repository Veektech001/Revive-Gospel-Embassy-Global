import os from "node:os";
import multer from "multer";
import { config } from "../utils/config.js";
import { HttpError } from "../utils/httpError.js";

const AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/mp4", "audio/x-m4a", "audio/aac", "audio/wav", "audio/x-wav", "audio/ogg", "audio/webm"];
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Files are written to a temp folder first, then moved to storage
export const sermonUpload = multer({
  storage: multer.diskStorage({ destination: os.tmpdir() }),
  limits: { fileSize: config.maxAudioMb * 1024 * 1024, files: 2 },
  fileFilter(req, file, cb) {
    if (file.fieldname === "audio" && AUDIO_TYPES.includes(file.mimetype)) return cb(null, true);
    if (file.fieldname === "image" && IMAGE_TYPES.includes(file.mimetype)) return cb(null, true);
    const what = file.fieldname === "image" ? "Cover photo must be JPG, PNG or WebP." : "Audio must be MP3, M4A, AAC, WAV or OGG.";
    cb(new HttpError(400, what));
  },
}).fields([
  { name: "audio", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

// Images have a smaller limit than audio
export function checkImageSize(req, res, next) {
  const image = req.files?.image?.[0];
  if (image && image.size > config.maxImageMb * 1024 * 1024) {
    return next(new HttpError(400, `Cover photo must be smaller than ${config.maxImageMb} MB.`));
  }
  next();
}
