// ─────────────────────────────────────────────────────────────
// Shrinks uploaded sermon audio so members use less mobile data.
// Every upload (WAV, M4A, large MP3...) is converted to a mono MP3
// at AUDIO_BITRATE (default 64k): about 29 MB per hour of preaching.
// ─────────────────────────────────────────────────────────────
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import ffmpegPath from "ffmpeg-static";
import { config } from "./config.js";
import { HttpError } from "./httpError.js";

/**
 * Converts `inputPath` to a compressed MP3 next to it.
 * Returns { path, bytes, durationSec }. The original file is left for the caller to delete.
 */
export function compressAudio(inputPath) {
  const outputPath = `${inputPath}-compressed.mp3`;
  const args = [
    "-hide_banner",
    "-y",
    "-i", inputPath,
    "-vn", // drop any cover art / video stream
    "-ac", "1", // mono: one voice, half the size
    "-ar", "44100",
    "-codec:a", "libmp3lame",
    "-b:a", config.audioBitrate, // e.g. 64k
    "-map_metadata", "-1",
    outputPath,
  ];

  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, args);
    let log = "";
    proc.stderr.on("data", (d) => {
      log = (log + d.toString()).slice(-4000); // keep the end of the log only
    });
    proc.on("error", (err) => reject(new Error(`Could not start the audio converter: ${err.message}`)));
    proc.on("close", async (code) => {
      if (code !== 0) {
        await fs.rm(outputPath, { force: true });
        return reject(
          new HttpError(400, "This audio file couldn't be read. Check it plays on your computer, or export it again as MP3.")
        );
      }
      const { size } = await fs.stat(outputPath);
      resolve({ path: outputPath, bytes: size, durationSec: parseDuration(log) });
    });
  });
}

// ffmpeg prints e.g. "time=00:58:12.34" as it works; the last one is the full length
function parseDuration(log) {
  const matches = [...log.matchAll(/time=(\d+):(\d+):(\d+(?:\.\d+)?)/g)];
  if (!matches.length) return undefined;
  const [, h, m, s] = matches.at(-1);
  return Math.round(Number(h) * 3600 + Number(m) * 60 + Number(s));
}
