// Section title. tone="dark" for ink backgrounds, "light" for stone backgrounds.
export default function SectionHeading({ title, intro, tone = "dark" }) {
  return (
    <div className="mb-10 max-w-2xl">
      <h2 className={`display text-5xl md:text-6xl ${tone === "dark" ? "text-stone" : "text-ink"}`}>
        {title}
      </h2>
      {intro && (
        <p className={`mt-4 text-base md:text-lg ${tone === "dark" ? "text-ash" : "text-ink/70"}`}>
          {intro}
        </p>
      )}
    </div>
  );
}
