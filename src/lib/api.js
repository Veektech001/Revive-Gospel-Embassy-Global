// ─────────────────────────────────────────────────────────────
// Talks to the RGE backend (the Backend folder).
// Set VITE_API_URL in Frontend/.env, e.g. VITE_API_URL=http://localhost:5000
// Without it the site still works: sermons show the sample list and
// forms pretend to send, so the design can be previewed on its own.
// ─────────────────────────────────────────────────────────────

export const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
export const backendEnabled = Boolean(API_URL);

const TOKEN_KEY = "rge_token";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}
export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable: stay logged in for this tab only */
  }
}

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details || {};
  }
}

/** Fetch wrapper: adds the login token, parses JSON, throws ApiError with a readable message. */
export async function api(path, { method = "GET", body, form, auth = true } = {}) {
  if (!backendEnabled) {
    throw new ApiError("Member accounts aren't switched on yet. Check back soon.", 0);
  }
  const headers = {};
  const token = auth ? getToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: form ?? (body !== undefined ? JSON.stringify(body) : undefined),
    });
  } catch {
    throw new ApiError("Can't reach the server. Check your internet connection and try again.", 0);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error || `Request failed (${res.status}).`, res.status, data.details);
  return data;
}

/** Upload with progress (fetch can't report upload progress, XHR can). */
export function uploadWithProgress(path, { method = "POST", form, onProgress }) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, `${API_URL}${path}`);
    const token = getToken();
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      let data = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        /* not JSON */
      }
      if (xhr.status >= 200 && xhr.status < 300) resolve(data);
      else reject(new ApiError(data.error || `Upload failed (${xhr.status}).`, xhr.status, data.details));
    };
    xhr.onerror = () => reject(new ApiError("The upload was interrupted. Check your connection and try again.", 0));
    xhr.send(form);
  });
}

// ── Forms ────────────────────────────────────────────────────
async function postForm(path, data) {
  if (!backendEnabled) {
    await new Promise((r) => setTimeout(r, 700)); // demo mode
    return { ok: true };
  }
  return api(path, { method: "POST", body: data, auth: false });
}
export const subscribeToNewsletter = (email) => postForm("/api/newsletter", { email });
export const sendVisitorForm = (form) => postForm("/api/visitors", form);
