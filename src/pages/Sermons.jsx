import { useMemo, useState } from "react";
import sermonImage from "../assets/Images/secondHero.jpg";
import PageHeader from "../components/shared/PageHeader";
import SermonCard from "../components/shared/SermonCard";
import sermons from "../data/sermons";

export default function SermonsPage() {
  const [query, setQuery] = useState("");
  const [series, setSeries] = useState("All");

  const allSeries = useMemo(() => ["All", ...new Set(sermons.map((s) => s.series).filter(Boolean))], []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sermons.filter(
      (s) =>
        (series === "All" || s.series === series) &&
        (!q || [s.title, s.series, s.speaker].some((v) => v?.toLowerCase().includes(q)))
    );
  }, [query, series]);

  return (
    <>
      <PageHeader
        title="Sermons"
        intro="Catch up on recent messages from Revive Gospel Embassy."
        image={{ src: sermonImage, alt: "Apostle Light Iwuh preaching" }}
      />

      <section className="bg-ink">
        <div className="wrap py-14 md:py-20">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="w-full md:max-w-sm">
              <label htmlFor="sermon-search" className="mb-1.5 block text-sm font-semibold text-stone">
                Search by title, series or speaker
              </label>
              <input
                id="sermon-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Faith"
                className="w-full rounded-lg border border-stone/25 bg-coal px-4 py-3 text-stone placeholder:text-ash focus:border-flame focus:outline-none"
              />
            </div>
            <div role="group" aria-label="Filter by series" className="flex flex-wrap gap-2">
              {allSeries.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeries(s)}
                  aria-pressed={series === s}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    series === s
                      ? "border-flame bg-flame text-ink"
                      : "border-stone/25 text-stone/80 hover:border-stone hover:text-stone"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <p className="mb-4 text-sm text-ash" aria-live="polite">
            {results.length} {results.length === 1 ? "message" : "messages"}
          </p>

          {results.length ? (
            <div className="flex flex-col gap-10">
              {results.map((s) => (
                <SermonCard key={s.id} sermon={s} layout="row" />
              ))}
            </div>
          ) : (
            <div className="rounded-sm border border-dashed border-stone/25 p-10 text-center">
              <p className="text-lg font-semibold text-stone">No sermons match “{query}”.</p>
              <p className="mt-2 text-ash">Try a different word, or clear the search to see every message.</p>
              <button
                type="button"
                className="btn-ghost-dark mt-6"
                onClick={() => {
                  setQuery("");
                  setSeries("All");
                }}
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
