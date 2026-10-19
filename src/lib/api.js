// ─────────────────────────────────────────────────────────────
// Form submissions.
// There is no backend yet, so these functions only pretend to send
// (they wait briefly and succeed). When the Backend is ready, set
// API_URL and the real request below will be used instead.
// ─────────────────────────────────────────────────────────────

const API_URL = ""; // e.g. "https://api.rgeglobal.org"

async function post(path, data) {
  if (!API_URL) {
    await new Promise((r) => setTimeout(r, 700));
    console.info(`[demo] would POST ${path}`, data);
    return { ok: true };
  }
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

export const subscribeToNewsletter = (email) => post("/api/newsletter", { email });
export const sendVisitorForm = (form) => post("/api/visitors", form);
