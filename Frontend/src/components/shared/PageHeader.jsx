// Big title band at the top of every inner page
export default function PageHeader({ title, intro, image }) {
  return (
    <header className="relative overflow-hidden bg-stone text-ink">
      <div className="wrap grid items-end gap-8 pb-10 pt-14 md:grid-cols-[1fr_auto] md:pb-14 md:pt-20">
        <div className="min-w-0">
          <h1 className="display text-[clamp(3.5rem,13vw,8.5rem)]">{title}</h1>
          {intro && <p className="mt-5 max-w-xl text-base text-ink/75 md:text-lg">{intro}</p>}
        </div>
        {image && (
          <img
            src={image.src}
            alt={image.alt}
            className="slot-in hidden h-40 w-56 rounded-sm object-cover md:block lg:h-48 lg:w-72"
          />
        )}
      </div>
    </header>
  );
}
