import { church } from "../../data/church";

// A row of the three weekly meeting times
export default function ServiceTimes({ tone = "dark" }) {
  const dark = tone === "dark";
  return (
    <dl className={`grid gap-px overflow-hidden rounded-sm sm:grid-cols-2 ${dark ? "bg-stone/15" : "bg-ink/15"}`}>
      {church.services.filter((s) => s.day !== "Every day").map((s) => (
        <div key={s.name} className={`flex flex-col gap-1 p-6 ${dark ? "bg-ink" : "bg-stone"}`}>
          <dt className={`text-sm font-semibold ${dark ? "text-ash" : "text-ink/60"}`}>
            {s.name} · {s.day}
          </dt>
          <dd className={`font-anton text-5xl tabular-nums ${dark ? "text-stone" : "text-ink"}`}>
            {s.time}
          </dd>
        </div>
      ))}
    </dl>
  );
}
