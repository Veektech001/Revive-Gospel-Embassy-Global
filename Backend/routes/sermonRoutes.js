import { Router } from "express";
import {
  listSermons,
  listSeries,
  getSermon,
  getDownloadLink,
  serveLocalFile,
  adminListSermons,
  createSermon,
  updateSermon,
  deleteSermon,
} from "../controllers/sermonControllers.js";
import { protect, requireAdmin } from "../middleWare/auth.js";
import { sermonUpload, checkImageSize } from "../middleWare/upload.js";

const router = Router();

// Public
router.get("/", listSermons);
router.get("/series", listSeries);

// Admin (defined before "/:id" so "admin" isn't read as an id)
router.get("/admin/all", protect, requireAdmin, adminListSermons);
router.post("/", protect, requireAdmin, sermonUpload, checkImageSize, createSermon);
router.patch("/:id", protect, requireAdmin, sermonUpload, checkImageSize, updateSermon);
router.delete("/:id", protect, requireAdmin, deleteSermon);

// Public detail
router.get("/:id", getSermon);

// Members only
router.get("/:id/download", protect, getDownloadLink);
router.get("/:id/file", serveLocalFile); // protected by the short-lived token in the link

export default router;
