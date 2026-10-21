import { Link } from "react-router-dom";
import aboutImage from "../assets/Images/aboutImage.jpg";
import pastorsImage from "../assets/Images/fourthHero.jpg";
import PageHeader from "../components/shared/PageHeader";
import ServiceTimes from "../components/shared/ServiceTimes";
import VisionMission from "../components/shared/VisionMission";
import { church } from "../data/church";
import PastorAndMama from "../assets/Images/pastorAndMama.jpeg";
const values = [
  "Encounter God",
  "Live worthy of purpose",
  "Become more like Jesus",
  "Be disciples who make disciples",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About RGE"
        intro="We are becoming more like Jesus."
        image={{ src: aboutImage, alt: "The RGE congregation worshipping" }}
      />

      <section className="bg-ink">
        <div className="wrap grid gap-12 py-20 md:grid-cols-2 md:gap-16 md:py-28">
          <div className="min-w-0 space-y-5 text-lg leading-relaxed text-stone/85">
            <h2 className="display text-5xl text-stone md:text-6xl">Sound doctrine, real fire</h2>
            <p>
              At Revive Gospel Embassy we are committed to sound doctrine: teaching the Bible
              faithfully, without compromise, and helping every member grow in a deep and accurate
              understanding of Scripture.
            </p>
            <p>
              We gather every Friday at 5:00 PM and every Sunday at 8:00 AM. Our services are
              informal and full of energy, and everyone is welcome to join us.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href={church.venue.mapUrl} target="_blank" rel="noreferrer" className="btn-flame">
                Get directions
              </a>
              <Link to="/first-time" className="btn-ghost-dark">
                Plan your first visit
              </Link>
            </div>
          </div>
          <img
            src={aboutImage}
            alt="The RGE congregation worshipping"
            loading="lazy"
            className="aspect-[4/3] w-full rounded-sm object-cover md:aspect-auto md:h-full"
          />
        </div>
        <div className="wrap pb-20 md:pb-28">
          <ServiceTimes />
        </div>
      </section>

      <section className="bg-coal">
        <div className="wrap grid gap-10 py-20 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-16 md:py-28">
          <img
            src={PastorAndMama}
            alt="Members of RGE in prayer"
            loading="lazy"
            className="aspect-[10/10] w-full rounded-sm object-cover"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-flame">Our senior pastors</p>
            <h2 className="display mt-2 text-5xl text-stone md:text-6xl">Light + Lillian</h2>
            <p className="mt-5 text-lg text-stone/85">
              Together they are committed to building the church, helping people:
            </p>
            <ul className="mt-5 grid gap-px overflow-hidden rounded-sm bg-stone/10 sm:grid-cols-2">
              {values.map((v) => (
                <li key={v} className="bg-coal py-3 pr-4 font-semibold text-stone sm:py-4">
                  {v}
                </li>
              ))}
            </ul>
            <Link to="/leadership" className="btn-ghost-dark mt-8">
              Meet our leadership
            </Link>
          </div>
        </div>
      </section>

      <VisionMission />
    </>
  );
}
