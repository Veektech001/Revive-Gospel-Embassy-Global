// ─────────────────────────────────────────────────────────────
// File storage for sermon audio and cover photos.
//
// • With Cloudinary settings in .env → files go to Cloudinary.
//   Audio is stored as "authenticated" (private): it can only be
//   fetched with a signed, expiring link that this API creates
//   for logged-in members.
// • Without them → files are saved in Backend/uploads/ (handy for
//   local development; not recommended on most hosts).
// ─────────────────────────────────────────────────────────────
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { v2 as cloudinary } from "cloudinary";
import { config, useCloudinary } from "./config.js";
import { compressAudio } from "./audio.js";

const here = path.dirname(fileURLToPath(import.meta.url));
export const UPLOAD_DIR = path.resolve(here, "../uploads");
export const AUDIO_DIR = path.join(UPLOAD_DIR, "audio"); // private, never served directly
export const IMAGE_DIR = path.join(UPLOAD_DIR, "images"); // public

if (useCloudinary) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure: true,
  });
}

const extOf = (name) => (path.extname(name || "").slice(1) || "mp3").toLowerCase();
const slug = (s) =>
  String(s || "file")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50) || "file";

/** Save an uploaded audio file. `file` is a multer file saved to a temp path. */
export async function saveAudio(file, title) {
  const base = `${slug(title)}-${crypto.randomBytes(4).toString("hex")}`;

  // Shrink to a small mono MP3 first (see utils/audio.js)
  let small;
  try {
    small = await compressAudio(file.path);
  } finally {
    await fs.rm(file.path, { force: true }); // the large original is no longer needed
  }

  try {
    if (useCloudinary) {
      const res = await new Promise((resolve, reject) =>
        cloudinary.uploader.upload_large(
          small.path,
          {
            resource_type: "video", // Cloudinary treats audio as "video"
            type: "authenticated", // private
            folder: `${config.cloudinary.folder}/sermons`,
            public_id: base,
            chunk_size: 20 * 1024 * 1024,
          },
          (err, result) => (err ? reject(err) : resolve(result))
        )
      );
      return {
        provider: "cloudinary",
        publicId: res.public_id,
        format: "mp3",
        bytes: res.bytes || small.bytes,
        durationSec: res.duration ? Math.round(res.duration) : small.durationSec,
        originalName: file.originalname,
      };
    }

    await fs.mkdir(AUDIO_DIR, { recursive: true });
    const name = `${base}.mp3`;
    await fs.copyFile(small.path, path.join(AUDIO_DIR, name));
    return {
      provider: "local",
      localPath: name,
      format: "mp3",
      bytes: small.bytes,
      durationSec: small.durationSec,
      originalName: file.originalname,
    };
  } finally {
    await fs.rm(small.path, { force: true });
  }
}

/** Save a cover photo. Returns a public URL. */
export async function saveImage(file, title) {
  const base = `${slug(title)}-${crypto.randomBytes(4).toString("hex")}`;

  if (useCloudinary) {
    const res = await cloudinary.uploader.upload(file.path, {
      folder: `${config.cloudinary.folder}/covers`,
      public_id: base,
      transformation: [{ width: 1600, crop: "limit", quality: "auto", fetch_format: "auto" }],
    });
    await fs.rm(file.path, { force: true });
    return { provider: "cloudinary", url: res.secure_url, publicId: res.public_id };
  }

  await fs.mkdir(IMAGE_DIR, { recursive: true });
  const name = `${base}.${extOf(file.originalname)}`;
  await fs.copyFile(file.path, path.join(IMAGE_DIR, name));
  await fs.rm(file.path, { force: true });
  return { provider: "local", localPath: name, url: `${config.publicApiUrl}/uploads/images/${name}` };
}

export async function deleteAudio(audio) {
  if (!audio?.provider) return;
  try {
    if (audio.provider === "cloudinary") {
      await cloudinary.uploader.destroy(audio.publicId, { resource_type: "video", type: "authenticated" });
    } else {
      await fs.rm(path.join(AUDIO_DIR, path.basename(audio.localPath)), { force: true });
    }
  } catch (err) {
    console.error("Could not delete audio file:", err.message);
  }
}

export async function deleteImage(image) {
  if (!image?.provider) return;
  try {
    if (image.provider === "cloudinary") {
      await cloudinary.uploader.destroy(image.publicId);
    } else {
      await fs.rm(path.join(IMAGE_DIR, path.basename(image.localPath)), { force: true });
    }
  } catch (err) {
    console.error("Could not delete image file:", err.message);
  }
}

/**
 * A Cloudinary link that works for a few minutes only.
 * `attachment: true` makes the browser download instead of play.
 */
export function cloudinaryDownloadUrl(audio, { attachment }) {
  const expiresAt = Math.floor(Date.now() / 1000) + config.downloadLinkMinutes * 60;
  return cloudinary.utils.private_download_url(audio.publicId, audio.format, {
    resource_type: "video",
    type: "authenticated",
    expires_at: expiresAt,
    attachment: Boolean(attachment),
  });
}
