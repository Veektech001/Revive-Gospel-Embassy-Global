import { useState } from "react";
import { Link } from "react-router-dom";
import sermonImage from "../assets/Images/secondHero.jpg";
import PageHeader from "../components/shared/PageHeader";
import SermonCard from "../components/shared/SermonCard";
import { useSermons, useSeries } from "../lib/useSermons";
import { useAuth } from "../context/AuthContext";

export default function SermonsPage() {
  const [query, setQuery] = useState("");
  const [series, setSeries] = useState("All");
  const { sermons, total, status, error, retry } = useSermons({ search: query, series, limit: 50 });
  const allSeries = ["All", ...useSeries()];
  const { user } = useAuth();

  return (
    <>
      <PageHeader
        title="Sermons"
        intro="Catch up on recent messages from Revive Gospel Embassy. Members can listen online and download."
        image={{ src: sermonImage, alt: "Apostle Light Iwuh preaching" }}
      />

      <section className="bg-ink">
        <div className="wrap py-14 md:py-20">
          {!user && (
            <div className="mb-10 flex flex-col gap-4 rounded-sm border border-flame/40 bg-coal p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-stone">
                <span className="font-semibold">Downloads are for members.</span>{" "}
                <span className="text-stone/75">Create a free account or log in to listen and download.</span>
              </p>
              <div className="flex shrink-0 gap-2">
                <Link to="/login" state={{ from: "/sermons" }} className="btn-flame py-2">
                  Log in
                </Link>
                <Link to="/register" state={{ from: "/sermons" }} className="btn-ghost-dark py-2">
                  Sign up
                </Link>
              </div>
            </div>
          )}

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
            {allSeries.length > 2 && (
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
            )}
          </div>

          <p className="mb-4 text-sm text-ash" aria-live="polite">
            {status === "loading" ? "Loading sermons…" : status === "ready" ? `${total} ${total === 1 ? "message" : "messages"}` : ""}
          </p>

          {status === "error" ? (
            <div className="rounded-sm border border-dashed border-stone/25 p-10 text-center">
              <p className="text-lg font-semibold text-stone">Sermons couldn't load.</p>
              <p className="mt-2 text-ash">{error}</p>
              <button type="button" className="btn-ghost-dark mt-6" onClick={retry}>
                Try again
              </button>
            </div>
          ) : sermons.length ? (
            <div className="flex flex-col gap-10">
              {sermons.map((s) => (
                <SermonCard key={s.id} sermon={s} layout="row" />
              ))}
            </div>
          ) : status === "ready" ? (
            <div className="rounded-sm border border-dashed border-stone/25 p-10 text-center">
              {query || series !== "All" ? (
                <>
                  <p className="text-lg font-semibold text-stone">No sermons match your search.</p>
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
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold text-stone">No sermons have been uploaded yet.</p>
                  <p className="mt-2 text-ash">New messages appear here after each service.</p>
                </>
              )}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
