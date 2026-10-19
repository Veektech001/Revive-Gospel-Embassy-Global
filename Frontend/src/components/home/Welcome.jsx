import { Link } from "react-router-dom";
import image from "../../assets/Images/BI.jpg";
import { church } from "../../data/church";
import ServiceTimes from "../shared/ServiceTimes";

export default function Welcome() {
  return (
    <section className="bg-ink">
      <div className="wrap py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
          <img
            src={image}
            alt="Worship on the RGE stage"
            loading="lazy"
            className="aspect-[4/3] w-full rounded-sm object-cover"
          />
          <div className="min-w-0">
            <h2 className="display text-5xl text-stone md:text-7xl">Welcome home</h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-stone/85">
              Our services are informal and full of energy, and everyone is welcome. Come as you
              are. We'd love to worship with you.
            </p>
            <div className="mt-6 text-stone">
              <p className="text-sm font-semibold text-flame">{church.venue.label}</p>
              {church.venue.lines.map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={church.venue.mapUrl} target="_blank" rel="noreferrer" className="btn-flame">
                Get directions
              </a>
              <Link to="/about" className="btn-ghost-dark">
                About RGE
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <ServiceTimes />
        </div>
      </div>
    </section>
  );
}
