import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="bg-stone text-ink">
      <div className="wrap py-24 md:py-32">
        <h1 className="display text-[clamp(3.5rem,13vw,8.5rem)]">Page not found</h1>
        <p className="mt-5 max-w-lg text-lg text-ink/75">
          This page doesn't exist or may have moved. Head back to the homepage to find what you're
          looking for.
        </p>
        <Link to="/" className="btn-ink mt-8">
          Go to the homepage
        </Link>
      </div>
    </section>
  );
}
