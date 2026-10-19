import multer from "multer";
import mongoose from "mongoose";
import { config, isProduction } from "../utils/config.js";

export function notFound(req, res) {
  res.status(404).json({ error: `No API route for ${req.method} ${req.originalUrl}.` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let message = err.message || "Something went wrong.";
  let details = err.details;

  if (err instanceof multer.MulterError) {
    status = 400;
    message =
      err.code === "LIMIT_FILE_SIZE"
        ? `File is too large. Audio must be smaller than ${config.maxAudioMb} MB.`
        : `Upload problem: ${err.message}`;
  } else if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    details = Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.message]));
    message = Object.values(details)[0] || "Some fields are invalid.";
  } else if (err instanceof mongoose.Error.CastError) {
    status = 404;
    message = "Not found.";
  } else if (err.code === 11000) {
    status = 409;
    message = "That already exists.";
  } else if (err.type === "entity.parse.failed") {
    status = 400;
    message = "The request body is not valid JSON.";
  }

  if (status >= 500) {
    console.error(err);
    if (isProduction) message = "Something went wrong on our side. Try again in a moment.";
  }

  res.status(status).json({ error: message, ...(details ? { details } : {}) });
}
