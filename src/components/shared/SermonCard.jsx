import { formatDate } from "../../data/sermons";

export default function SermonCard({ sermon, layout = "stack" }) {
  const row = layout === "row";
  return (
    <article
      className={`group grid gap-5 border-t border-stone/15 pt-6 ${
        row ? "md:grid-cols-[18rem_1fr_auto] md:items-center md:gap-8" : ""
      }`}
    >
      <div className="relative overflow-hidden rounded-sm">
        <img
          src={sermon.image.src}
          alt={sermon.image.alt}
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
          {sermon.series && <> · {sermon.series}</>}
        </p>
        <h3 className="display mt-2 text-4xl text-stone">{sermon.title}</h3>
        <p className="mt-1 text-sm font-medium text-stone/80">{sermon.speaker}</p>
      </div>
      <div>
        {sermon.audioUrl ? (
          <a href={sermon.audioUrl} target="_blank" rel="noreferrer" className="btn-flame">
            Listen / download
          </a>
        ) : (
          <button type="button" disabled className="btn-ghost-dark">
            Audio coming soon
          </button>
        )}
      </div>
    </article>
  );
}
