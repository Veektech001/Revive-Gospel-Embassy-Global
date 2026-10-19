import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";

const formatSize = (bytes) =>
  !bytes ? "" : bytes < 1048576 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1048576).toFixed(bytes > 10485760 ? 0 : 1)} MB`;

/**
 * Listen / Download buttons for one sermon.
 * Visitors who aren't logged in are asked to log in first.
 */
export default function SermonActions({ sermon }) {
  const { user } = useAuth();
  const location = useLocation();
  const [busy, setBusy] = useState(""); // "listen" | "download" | ""
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  if (!sermon.hasAudio) {
    return (
      <button type="button" disabled className="btn-ghost-dark">
        Audio coming soon
      </button>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-start gap-2">
        <Link to="/login" state={{ from: location.pathname }} className="btn-flame">
          Log in to download
        </Link>
        <p className="text-xs text-ash">
          New here?{" "}
          <Link to="/register" state={{ from: location.pathname }} className="text-stone underline underline-offset-2">
            Create a free member account
          </Link>
        </p>
      </div>
    );
  }

  async function get(mode) {
    setBusy(mode);
    setError("");
    try {
      const { url } = await api(`/api/sermons/${sermon.id}/download?mode=${mode}`);
      if (mode === "listen") setAudioUrl(url);
      else window.location.assign(url); // the server tells the browser to save the file
    } catch (e) {
      setError(e.status === 401 ? "Your login has expired. Log in again to download." : e.message);
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-flame" disabled={!!busy} onClick={() => get("download")}>
          {busy === "download" ? "Preparing…" : `Download${sermon.audioBytes ? ` (${formatSize(sermon.audioBytes)})` : ""}`}
        </button>
        {!audioUrl && (
          <button type="button" className="btn-ghost-dark" disabled={!!busy} onClick={() => get("listen")}>
            {busy === "listen" ? "Loading…" : "Listen now"}
          </button>
        )}
      </div>
      {audioUrl && (
        <audio controls autoPlay src={audioUrl} className="w-full max-w-md" aria-label={`Play ${sermon.title}`}>
          Your browser can't play this audio. Use Download instead.
        </audio>
      )}
      {error && (
        <p className="text-sm font-medium text-flame" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
