import { Link } from "react-router-dom";
import { useSermons } from "../../lib/useSermons";
import SermonCard from "../shared/SermonCard";

export default function LatestSermons() {
  const { sermons, status } = useSermons({ limit: 3 });
  if (status !== "loading" && sermons.length === 0) return null; // nothing to show yet

  return (
    <section className="border-t border-stone/10 bg-ink">
      <div className="wrap py-20 md:py-28">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <h2 className="display text-5xl text-stone md:text-6xl">Recent messages</h2>
          <Link to="/sermons" className="btn-ghost-dark">
            All sermons
          </Link>
        </div>
        {status === "loading" ? (
          <p className="text-ash">Loading sermons…</p>
        ) : (
          <div className="grid gap-10 md:grid-cols-3 md:gap-6">
            {sermons.map((s) => (
              <SermonCard key={s.id} sermon={s} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
