import path from "node:path";
import fs from "node:fs/promises";
import jwt from "jsonwebtoken";
import { Sermon } from "../models/sermonModels.js";
import { HttpError, asyncHandler } from "../utils/httpError.js";
import { config } from "../utils/config.js";
import {
  AUDIO_DIR,
  saveAudio,
  saveImage,
  deleteAudio,
  deleteImage,
  cloudinaryDownloadUrl,
} from "../utils/storage.js";

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const downloadName = (s) =>
  `${s.date.toISOString().slice(0, 10)} - ${s.title} - ${s.speaker}`.replace(/[^\w\s.-]/g, "").trim() +
  `.${s.audio.format || "mp3"}`;

async function findSermon(id, { publishedOnly = true } = {}) {
  const sermon = await Sermon.findById(id);
  if (!sermon || (publishedOnly && !sermon.published)) throw new HttpError(404, "Sermon not found.");
  return sermon;
}

function buildFilter(query, { includeUnpublished = false } = {}) {
  const filter = includeUnpublished ? {} : { published: true };
  const search = typeof query.search === "string" ? query.search.trim().slice(0, 100) : "";
  if (search) {
    const re = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ title: re }, { series: re }, { speaker: re }];
  }
  if (typeof query.series === "string" && query.series && query.series !== "All") {
    filter.series = query.series;
  }
  return filter;
}

async function paginate(filter, query, admin) {
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
  const page = Math.max(Number(query.page) || 1, 1);
  const [items, total] = await Promise.all([
    Sermon.find(filter).sort({ date: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Sermon.countDocuments(filter),
  ]);
  return {
    sermons: items.map((s) => s.toPublic({ admin })),
    page,
    pages: Math.max(Math.ceil(total / limit), 1),
    total,
  };
}

// ── Public ───────────────────────────────────────────────────

// GET /api/sermons?search=&series=&page=&limit=
export const listSermons = asyncHandler(async (req, res) => {
  res.json(await paginate(buildFilter(req.query), req.query, false));
});

// GET /api/sermons/series
export const listSeries = asyncHandler(async (req, res) => {
  const series = await Sermon.distinct("series", { published: true });
  res.json({ series: series.filter(Boolean).sort() });
});

// GET /api/sermons/:id
export const getSermon = asyncHandler(async (req, res) => {
  const sermon = await findSermon(req.params.id);
  res.json({ sermon: sermon.toPublic() });
});

// ── Members ──────────────────────────────────────────────────

// GET /api/sermons/:id/download?mode=download|listen
// Gives a logged-in member a link that only works for a few minutes.
export const getDownloadLink = asyncHandler(async (req, res) => {
  const sermon = await findSermon(req.params.id);
  if (!sermon.audio?.provider) throw new HttpError(404, "The audio for this sermon hasn't been uploaded yet.");

  const attachment = req.query.mode !== "listen";
  let url;
  if (sermon.audio.provider === "cloudinary") {
    url = cloudinaryDownloadUrl(sermon.audio, { attachment });
  } else {
    const fileToken = jwt.sign(
      { sid: sermon.id, purpose: "sermon-file", att: attachment },
      config.jwtSecret,
      { expiresIn: `${config.downloadLinkMinutes}m` }
    );
    const base = config.publicApiUrl || `${req.protocol}://${req.get("host")}`;
    url = `${base}/api/sermons/${sermon.id}/file?token=${fileToken}`;
  }

  if (attachment) await Sermon.updateOne({ _id: sermon._id }, { $inc: { downloads: 1 } });
  res.json({ url, filename: downloadName(sermon), expiresInMinutes: config.downloadLinkMinutes });
});

// GET /api/sermons/:id/file?token=   (local storage only)
export const serveLocalFile = asyncHandler(async (req, res) => {
  let payload;
  try {
    payload = jwt.verify(String(req.query.token || ""), config.jwtSecret);
  } catch {
    throw new HttpError(403, "This download link has expired. Go back to the sermons page and try again.");
  }
  if (payload.purpose !== "sermon-file" || payload.sid !== req.params.id) {
    throw new HttpError(403, "This download link is not valid.");
  }
  const sermon = await findSermon(req.params.id);
  if (sermon.audio?.provider !== "local") throw new HttpError(404, "File not found.");

  const filePath = path.join(AUDIO_DIR, path.basename(sermon.audio.localPath));
  await fs.access(filePath).catch(() => {
    throw new HttpError(404, "The audio file is missing on the server.");
  });
  if (payload.att) res.attachment(downloadName(sermon));
  res.sendFile(filePath, { headers: { "Cache-Control": "private, no-store" } });
});

// ── Admin ────────────────────────────────────────────────────

// GET /api/sermons/admin/all
export const adminListSermons = asyncHandler(async (req, res) => {
  res.json(await paginate(buildFilter(req.query, { includeUnpublished: true }), req.query, true));
});

function readFields(body) {
  const fields = {};
  for (const key of ["title", "speaker", "series", "description"]) {
    if (typeof body[key] === "string") fields[key] = body[key].trim();
  }
  if (body.date) {
    const d = new Date(body.date);
    if (Number.isNaN(d.getTime())) throw new HttpError(400, "Enter a valid date.", { date: "Enter a valid date." });
    fields.date = d;
  }
  if (body.published !== undefined) fields.published = body.published === true || body.published === "true";
  return fields;
}

async function removeTempFiles(req) {
  for (const f of Object.values(req.files || {}).flat()) await fs.rm(f.path, { force: true });
}

// POST /api/sermons  (multipart: fields + audio + image)
export const createSermon = asyncHandler(async (req, res) => {
  try {
    const sermon = new Sermon({ ...readFields(req.body), createdBy: req.user._id });
    await sermon.validate(); // check fields before uploading big files

    const audioFile = req.files?.audio?.[0];
    const imageFile = req.files?.image?.[0];
    if (audioFile) sermon.audio = await saveAudio(audioFile, sermon.title);
    if (imageFile) sermon.image = await saveImage(imageFile, sermon.title);

    await sermon.save();
    res.status(201).json({ sermon: sermon.toPublic({ admin: true }) });
  } finally {
    await removeTempFiles(req);
  }
});

// PATCH /api/sermons/:id  (multipart; any field optional; new files replace old ones)
export const updateSermon = asyncHandler(async (req, res) => {
  try {
    const sermon = await findSermon(req.params.id, { publishedOnly: false });
    sermon.set(readFields(req.body));
    await sermon.validate();

    const audioFile = req.files?.audio?.[0];
    const imageFile = req.files?.image?.[0];
    if (audioFile) {
      const old = sermon.audio?.toObject?.() || sermon.audio;
      sermon.audio = await saveAudio(audioFile, sermon.title);
      await deleteAudio(old);
    }
    if (imageFile) {
      const old = sermon.image?.toObject?.() || sermon.image;
      sermon.image = await saveImage(imageFile, sermon.title);
      await deleteImage(old);
    }
    await sermon.save();
    res.json({ sermon: sermon.toPublic({ admin: true }) });
  } finally {
    await removeTempFiles(req);
  }
});

// DELETE /api/sermons/:id
export const deleteSermon = asyncHandler(async (req, res) => {
  const sermon = await findSermon(req.params.id, { publishedOnly: false });
  await deleteAudio(sermon.audio);
  await deleteImage(sermon.image);
  await sermon.deleteOne();
  res.json({ message: "Sermon deleted." });
});
