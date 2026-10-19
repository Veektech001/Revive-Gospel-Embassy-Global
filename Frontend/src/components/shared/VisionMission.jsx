import { church } from "../../data/church";

export default function VisionMission() {
  return (
    <section className="bg-stone text-ink">
      <div className="wrap grid gap-12 py-20 md:grid-cols-2 md:py-28">
        <div>
          <h2 className="mb-4 text-sm font-semibold text-ink/60">Our vision</h2>
          <p className="display text-4xl md:text-5xl">{church.vision}</p>
        </div>
        <div className="md:pt-24">
          <h2 className="mb-4 text-sm font-semibold text-ink/60">Our mission</h2>
          <p className="text-xl font-medium leading-relaxed md:text-2xl">{church.mission}</p>
        </div>
      </div>
    </section>
  );
}
