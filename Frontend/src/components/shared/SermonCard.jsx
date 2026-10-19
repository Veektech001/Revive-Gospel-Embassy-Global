import { formatDate, defaultSermonImage } from "../../data/sermons";
import SermonActions from "./SermonActions";

const formatDuration = (sec) => (sec ? `${Math.round(sec / 60)} min` : "");

export default function SermonCard({ sermon, layout = "stack" }) {
  const row = layout === "row";
  const meta = [sermon.series, formatDuration(sermon.durationSec)].filter(Boolean);
  return (
    <article
      className={`group grid gap-5 border-t border-stone/15 pt-6 ${
        row ? "md:grid-cols-[18rem_1fr_minmax(14rem,auto)] md:items-center md:gap-8" : ""
      }`}
    >
      <div className="relative overflow-hidden rounded-sm">
        <img
          src={sermon.imageUrl || defaultSermonImage}
          alt=""
          loading="lazy"
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {sermon.sample && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-stone">
            Sample
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-ash">
          <time dateTime={sermon.date}>{formatDate(sermon.date)}</time>
          {meta.length > 0 && <> · {meta.join(" · ")}</>}
        </p>
        <h3 className="display mt-2 text-4xl text-stone">{sermon.title}</h3>
        <p className="mt-1 text-sm font-medium text-stone/80">{sermon.speaker}</p>
        {row && sermon.description && <p className="mt-3 max-w-prose text-sm text-stone/70">{sermon.description}</p>}
      </div>
      <div className="min-w-0">
        <SermonActions sermon={sermon} />
      </div>
    </article>
  );
}
