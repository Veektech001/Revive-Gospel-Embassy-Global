import groups from "../../data/groups";
import SectionHeading from "../shared/SectionHeading";

export default function JoinGroups() {
  return (
    <section className="bg-ink">
      <div className="wrap py-20 md:py-28">
        <SectionHeading
          title="Take a step"
          intro="Church is better together. Find your people and a place to serve."
        />
        <div className="grid gap-10 md:grid-cols-3 md:gap-6">
          {groups.map((g) => (
            <article key={g.id} className="flex flex-col">
              <img
                src={g.image.src}
                alt={g.image.alt}
                loading="lazy"
                className="aspect-[4/5] w-full rounded-sm object-cover"
              />
              <h3 className="display mt-5 text-3xl text-stone">{g.title}</h3>
              <p className="mt-2 flex-1 text-stone/80">{g.text}</p>
              <div className="mt-5">
                {g.whatsappLink ? (
                  <a href={g.whatsappLink} target="_blank" rel="noreferrer" className="btn-flame">
                    {g.cta} on WhatsApp
                  </a>
                ) : (
                  <span className="text-sm text-ash">WhatsApp link coming soon</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
