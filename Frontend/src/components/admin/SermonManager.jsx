import { useCallback, useEffect, useRef, useState } from "react";
import { api, uploadWithProgress } from "../../lib/api";
import { formatDate } from "../../data/sermons";
import { FormError, TextField } from "../shared/AuthLayout";

const today = () => new Date().toISOString().slice(0, 10);
const blank = () => ({ title: "", date: today(), series: "", speaker: "Apostle Light Iwuh", description: "", published: true });
const mb = (bytes) => (!bytes ? "" : bytes < 1048576 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1048576).toFixed(1)} MB`);

function SermonForm({ editing, onSaved, onCancel }) {
  const [fields, setFields] = useState(() =>
    editing
      ? { title: editing.title, date: editing.date, series: editing.series, speaker: editing.speaker, description: editing.description, published: editing.published }
      : blank()
  );
  const [audio, setAudio] = useState(null);
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(null);
  const audioRef = useRef(null);
  const imageRef = useRef(null);

  const set = (key) => (e) => setFields({ ...fields, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    const found = {};
    if (!fields.title.trim()) found.title = "Enter a sermon title.";
    if (!fields.date) found.date = "Choose the date it was preached.";
    if (!editing && !audio) found.audio = "Choose the audio file to upload.";
    setErrors(found);
    if (Object.keys(found).length) return;

    const form = new FormData();
    Object.entries(fields).forEach(([k, v]) => form.append(k, String(v)));
    if (audio) form.append("audio", audio);
    if (image) form.append("image", image);

    setError("");
    setProgress(0);
    try {
      const { sermon } = await uploadWithProgress(editing ? `/api/sermons/${editing.id}` : "/api/sermons", {
        method: editing ? "PATCH" : "POST",
        form,
        onProgress: setProgress,
      });
      onSaved(sermon, editing ? "updated" : "uploaded");
      if (!editing) {
        setFields(blank());
        setAudio(null);
        setImage(null);
        if (audioRef.current) audioRef.current.value = "";
        if (imageRef.current) imageRef.current.value = "";
      }
    } catch (err) {
      setErrors(err.details || {});
      setError(err.message);
    } finally {
      setProgress(null);
    }
  }

  const uploading = progress !== null;

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5 rounded-sm bg-stone p-6 text-ink md:grid-cols-2 md:p-8">
      <h2 className="display text-4xl md:col-span-2">{editing ? `Edit “${editing.title}”` : "Upload a sermon"}</h2>
      <div className="md:col-span-2">
        <FormError message={error} />
      </div>
      <div className="md:col-span-2">
        <TextField id="s-title" label="Title" value={fields.title} onChange={set("title")} error={errors.title} />
      </div>
      <TextField id="s-date" label="Date preached" type="date" value={fields.date} onChange={set("date")} error={errors.date} />
      <TextField id="s-series" label="Series (optional)" value={fields.series} onChange={set("series")} placeholder="e.g. Foundations" />
      <div className="md:col-span-2">
        <TextField id="s-speaker" label="Speaker" value={fields.speaker} onChange={set("speaker")} />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="s-description" className="label">
          Short description (optional)
        </label>
        <textarea id="s-description" rows={3} className="field resize-y" value={fields.description} onChange={set("description")} />
      </div>

      <div>
        <label htmlFor="s-audio" className="label">
          {editing ? "Replace audio (optional)" : "Audio file"}
        </label>
        <input
          ref={audioRef}
          id="s-audio"
          type="file"
          accept="audio/*"
          onChange={(e) => setAudio(e.target.files[0] || null)}
          className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-semibold file:text-stone"
          aria-invalid={!!errors.audio}
        />
        <p className="mt-1.5 text-xs text-ink/60">{audio ? `${audio.name} · ${mb(audio.size)}` : "Any audio file up to 300 MB. It is compressed automatically so members use less data."}</p>
        {errors.audio && <p className="mt-1 text-sm font-medium text-red-700">{errors.audio}</p>}
      </div>
      <div>
        <label htmlFor="s-image" className="label">
          {editing ? "Replace cover photo (optional)" : "Cover photo (optional)"}
        </label>
        <input
          ref={imageRef}
          id="s-image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setImage(e.target.files[0] || null)}
          className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-semibold file:text-stone"
        />
        <p className="mt-1.5 text-xs text-ink/60">{image ? `${image.name} · ${mb(image.size)}` : "JPG, PNG or WebP, up to 5 MB."}</p>
      </div>

      <label className="flex items-center gap-3 text-sm font-semibold md:col-span-2">
        <input type="checkbox" checked={fields.published} onChange={set("published")} className="h-5 w-5 accent-ink" />
        Show on the website (untick to save as a hidden draft)
      </label>

      {uploading && (
        <div className="md:col-span-2" role="status">
          <div className="h-2 overflow-hidden rounded-full bg-sand">
            <div className="h-full bg-ink transition-[width]" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-sm">
            {progress < 100 ? `Uploading… ${progress}%` : "Compressing and saving… this can take a few minutes for a long sermon. Keep this page open."}
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 md:col-span-2">
        <button type="submit" className="btn-ink" disabled={uploading}>
          {uploading ? "Uploading…" : editing ? "Save changes" : "Upload sermon"}
        </button>
        {editing && (
          <button type="button" className="btn-ghost-light" onClick={onCancel} disabled={uploading}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default function SermonManager() {
  const [sermons, setSermons] = useState([]);
  const [status, setStatus] = useState("loading");
  const [loadError, setLoadError] = useState("");
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [notice, setNotice] = useState("");

  const load = useCallback(() => {
    api("/api/sermons/admin/all?limit=100")
      .then((d) => {
        setSermons(d.sermons);
        setStatus("ready");
      })
      .catch((e) => {
        setLoadError(e.message);
        setStatus("error");
      });
  }, []);

  useEffect(load, [load]);

  function saved(sermon, verb) {
    setNotice(`“${sermon.title}” ${verb}.`);
    setEditing(null);
    load();
  }

  async function togglePublished(s) {
    const form = new FormData();
    form.append("published", String(!s.published));
    try {
      await api(`/api/sermons/${s.id}`, { method: "PATCH", form });
      setNotice(`“${s.title}” is now ${s.published ? "hidden" : "visible"} on the website.`);
      load();
    } catch (e) {
      setNotice(e.message);
    }
  }

  async function remove(s) {
    try {
      await api(`/api/sermons/${s.id}`, { method: "DELETE" });
      setNotice(`“${s.title}” deleted.`);
      setConfirmDelete(null);
      load();
    } catch (e) {
      setNotice(e.message);
    }
  }

  return (
    <div className="grid gap-10">
      <SermonForm key={editing?.id || "new"} editing={editing} onSaved={saved} onCancel={() => setEditing(null)} />

      {notice && (
        <p role="status" className="rounded-sm border border-flame/40 bg-coal px-4 py-3 text-stone">
          {notice}
        </p>
      )}

      <div>
        <h2 className="display mb-5 text-4xl text-stone">All sermons</h2>
        {status === "loading" && <p className="text-ash">Loading…</p>}
        {status === "error" && <p className="text-flame">{loadError}</p>}
        {status === "ready" && sermons.length === 0 && (
          <p className="text-ash">No sermons yet. Upload the first one with the form above.</p>
        )}
        {sermons.length > 0 && (
          <div className="overflow-x-auto rounded-sm border border-stone/15">
            <table className="w-full min-w-[42rem] text-left text-sm">
              <thead className="bg-coal text-ash">
                <tr>
                  <th className="px-4 py-3 font-semibold">Sermon</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Downloads</th>
                  <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone/10">
                {sermons.map((s) => (
                  <tr key={s.id} className="align-top text-stone">
                    <td className="px-4 py-3">
                      <p className="font-semibold">{s.title}</p>
                      <p className="text-ash">{[s.series, s.speaker, s.hasAudio ? mb(s.audioBytes) : "No audio"].filter(Boolean).join(" · ")}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">{formatDate(s.date)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${s.published ? "bg-flame/20 text-flame" : "bg-stone/10 text-ash"}`}>
                        {s.published ? "Live" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{s.downloads}</td>
                    <td className="px-4 py-3">
                      {confirmDelete === s.id ? (
                        <div className="flex flex-wrap justify-end gap-2">
                          <span className="self-center text-ash">Delete for good?</span>
                          <button type="button" className="rounded-full bg-red-700 px-3 py-1.5 text-xs font-semibold text-white" onClick={() => remove(s)}>
                            Delete
                          </button>
                          <button type="button" className="rounded-full border border-stone/30 px-3 py-1.5 text-xs font-semibold" onClick={() => setConfirmDelete(null)}>
                            Keep
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            type="button"
                            className="rounded-full border border-stone/30 px-3 py-1.5 text-xs font-semibold hover:border-stone"
                            onClick={() => {
                              setEditing(s);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                          >
                            Edit
                          </button>
                          <button type="button" className="rounded-full border border-stone/30 px-3 py-1.5 text-xs font-semibold hover:border-stone" onClick={() => togglePublished(s)}>
                            {s.published ? "Hide" : "Show"}
                          </button>
                          <button type="button" className="rounded-full border border-stone/30 px-3 py-1.5 text-xs font-semibold hover:border-red-500 hover:text-red-400" onClick={() => setConfirmDelete(s.id)}>
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
