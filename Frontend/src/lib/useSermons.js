import { useEffect, useState } from "react";
import { api, backendEnabled } from "./api";
import { sampleSermons } from "../data/sermons";

function filterSamples({ search = "", series = "All" }) {
  const q = search.trim().toLowerCase();
  return sampleSermons.filter(
    (s) =>
      (series === "All" || s.series === series) &&
      (!q || [s.title, s.series, s.speaker].some((v) => v?.toLowerCase().includes(q)))
  );
}

/**
 * Loads sermons from the backend (or the sample list when there is no backend).
 * Returns { sermons, total, status: "loading" | "ready" | "error", error, retry }.
 */
export function useSermons({ search = "", series = "All", limit = 20 } = {}) {
  const [state, setState] = useState(() =>
    backendEnabled
      ? { sermons: [], total: 0, status: "loading", error: "" }
      : (() => {
          const list = filterSamples({ search, series }).slice(0, limit);
          return { sermons: list, total: list.length, status: "ready", error: "" };
        })()
  );
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!backendEnabled) {
      const list = filterSamples({ search, series }).slice(0, limit);
      setState({ sermons: list, total: list.length, status: "ready", error: "" }); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }
    let cancelled = false;
    setState((s) => ({ ...s, status: "loading" }));
    const params = new URLSearchParams({ search, series, limit: String(limit) });
    // Small delay so we don't call the server on every keystroke
    const t = setTimeout(() => {
      api(`/api/sermons?${params}`, { auth: false })
        .then((d) => !cancelled && setState({ sermons: d.sermons, total: d.total, status: "ready", error: "" }))
        .catch((e) => !cancelled && setState({ sermons: [], total: 0, status: "error", error: e.message }));
    }, search ? 300 : 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [search, series, limit, attempt]);

  return { ...state, retry: () => setAttempt((a) => a + 1) };
}

export function useSeries() {
  const [series, setSeries] = useState(() =>
    backendEnabled ? [] : [...new Set(sampleSermons.map((s) => s.series).filter(Boolean))]
  );
  useEffect(() => {
    if (!backendEnabled) return;
    api("/api/sermons/series", { auth: false })
      .then((d) => setSeries(d.series))
      .catch(() => setSeries([]));
  }, []);
  return series;
}
