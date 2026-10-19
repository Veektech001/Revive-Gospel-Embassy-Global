import { Link } from "react-router-dom";
import { church, navLinks } from "../../data/church";

export default function Footer() {
  const year = new Date().getFullYear();
  const socials = Object.entries(church.socials).filter(([, url]) => url);

  return (
    <footer className="border-t border-stone/10 bg-coal text-stone">
      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="display text-3xl">
            Revive
            <br />
            Gospel
            <br />
            Embassy
          </p>
          <p className="mt-4 max-w-xs text-sm text-ash">{church.tagline}</p>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-flame">Service times</h2>
          <ul className="space-y-2 text-sm">
            {church.services.map((s) => (
              <li key={s.name} className="flex justify-between gap-4 sm:block">
                <span>{s.name}</span>
                <span className="text-ash sm:block">
                  {s.day}, {s.time}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-5 text-sm">
          {[church.venue, church.headquarters].map((place) => (
            <div key={place.label}>
              <h2 className="mb-1 font-semibold text-flame">{place.label}</h2>
              {place.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <a
                href={place.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-ash underline underline-offset-4 hover:text-stone"
              >
                Open in Google Maps
              </a>
            </div>
          ))}
        </div>

        <div className="space-y-5 text-sm">
          <div>
            <h2 className="mb-1 font-semibold text-flame">Contact</h2>
            <p>
              <a href={church.phoneHref} className="hover:text-flame">
                {church.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${church.email}`} className="break-all hover:text-flame">
                {church.email}
              </a>
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-ash hover:text-stone">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {socials.length > 0 && (
            <ul className="flex gap-4">
              {socials.map(([name, url]) => (
                <li key={name}>
                  <a href={url} target="_blank" rel="noreferrer" className="capitalize text-ash hover:text-stone">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="border-t border-stone/10">
        <p className="wrap py-5 text-xs text-ash">
          © {year} Revive Gospel Embassy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
