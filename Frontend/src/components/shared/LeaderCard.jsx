// Portrait + name + bio. Shows initials when no photo has been added yet.
export default function LeaderCard({ leader, reverse = false, children }) {
  const initials = leader.name
    .replace(/^(Apostle|Pastor|Pst\.?|Mrs\.?)\s+/gi, "")
    .replace(/^(Mrs\.?)\s+/i, "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <article className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
      <div className={reverse ? "md:order-2" : ""}>
        {leader.image ? (
          <img
            src={leader.image.src}
            alt={leader.image.alt}
            loading="lazy"
            className="aspect-[4/5] w-full rounded-sm object-cover"
          />
        ) : (
          <div
            className="flex aspect-[16/10] w-full flex-col md:aspect-[4/5] items-center justify-center gap-3 rounded-sm bg-coal"
            role="img"
            aria-label={`Photo of ${leader.name} coming soon`}
          >
            <span className="display text-8xl text-stone/20">{initials}</span>
            <span className="text-sm text-ash">Photo coming soon</span>
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-flame">{leader.role}</p>
        <h2 className="display mt-2 text-5xl text-stone md:text-6xl">{leader.name}</h2>
        <div className="mt-5 space-y-4 text-base leading-relaxed text-stone/85">
          {leader.bio.map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
          {leader.bioPending && <p className="text-sm text-ash">Full biography coming soon.</p>}
        </div>
        {children}
      </div>
    </article>
  );
}
