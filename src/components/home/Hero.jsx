import { Link } from "react-router-dom";
import firstImage from "../../assets/Images/firstHero.jpg";
import secondImage from "../../assets/Images/secondHero.jpg";
import thirdImage from "../../assets/Images/third.jpg";
import fourthImage from "../../assets/Images/fourthHero.jpg";
import { church } from "../../data/church";

// Photo that sits inside a row of the big title, sized to the letters
function Slot({ src, alt, delay, from }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{ "--delay": `${delay}ms`, "--from": from }}
      className="slot-in h-[0.72em] w-[0.98em] min-w-0 shrink rounded-[0.04em] object-cover"
    />
  );
}

export default function Hero() {
  return (
    <section className="overflow-x-clip bg-stone text-ink">
      <div className="wrap pb-12 pt-10 md:pb-16 md:pt-14">
        <h1
          className="display flex flex-col gap-[0.06em] text-[clamp(3rem,16.5vw,12rem)] leading-[0.86]"
          aria-label="Revive Gospel Embassy"
        >
          <span className="flex items-center justify-between gap-[0.12em]">
            <span className="shrink-0">Revive</span>
            <Slot src={firstImage} alt="" delay={150} from="40px" />
          </span>
          <span className="flex items-center justify-between gap-[0.12em]">
            <Slot src={secondImage} alt="" delay={300} from="-40px" />
            <span className="shrink-0">Gospel</span>
          </span>
          <span className="flex items-center justify-between gap-[0.12em]">
            <span className="shrink-0">Embassy</span>
            <span className="flex min-w-0 justify-end gap-[0.08em]">
              <Slot src={thirdImage} alt="" delay={450} from="40px" />
              <Slot src={fourthImage} alt="" delay={600} from="40px" />
            </span>
          </span>
        </h1>

        <div className="mt-10 grid gap-8 border-t border-ink/15 pt-8 md:grid-cols-[1.2fr_1fr] md:items-end">
          <p className="max-w-xl text-xl font-medium leading-snug md:text-2xl">{church.tagline}</p>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link to="/first-time" className="btn-ink">
              Plan your first visit
            </Link>
            <Link to="/sermons" className="btn-ghost-light">
              Listen to sermons
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
