// Daily 1 AM prayer watch band
export default function PrayerWatch() {
  return (
    <section className="bg-coal">
      <div className="wrap flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-baseline gap-5">
          <p className="font-anton text-7xl tabular-nums text-flame md:text-8xl">1AM - 2AM</p>
          <div>
            <h2 className="display text-3xl text-stone">Daily prayer watch</h2>
            <p className="text-ash">365 days of prayer, every 1:00AM - 2:00AM.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
