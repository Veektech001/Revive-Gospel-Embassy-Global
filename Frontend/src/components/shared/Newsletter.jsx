import { useState } from "react";
import { subscribeToNewsletter } from "../../lib/api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError("Enter a valid email address, like name@example.com.");
      return;
    }
    setError("");
    setStatus("sending");
    try {
      await subscribeToNewsletter(email.trim());
      setStatus("done");
    } catch {
      setStatus("error");
      setError("We couldn't subscribe you just now. Check your connection and try again.");
    }
  }

  return (
    <section className="bg-flame text-ink">
      <div className="wrap grid gap-8 py-16 md:grid-cols-2 md:items-end md:py-20">
        <div>
          <h2 className="display text-5xl md:text-6xl">Stay in the fire</h2>
          <p className="mt-4 max-w-md text-base text-ink/80">
            Get service updates, programme announcements and new sermons in your inbox.
          </p>
        </div>

        {status === "done" ? (
          <p className="text-lg font-semibold" role="status">
            You're subscribed. Look out for our next update at {email.trim()}.
          </p>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="w-full">
            <label htmlFor="newsletter-email" className="label">
              Email address
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="newsletter-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                aria-invalid={!!error}
                aria-describedby={error ? "newsletter-error" : undefined}
                className="field min-w-0 flex-1 border-ink/20 bg-stone"
              />
              <button type="submit" className="btn-ink" disabled={status === "sending"}>
                {status === "sending" ? "Subscribing…" : "Subscribe"}
              </button>
            </div>
            {error && (
              <p id="newsletter-error" className="mt-2 text-sm font-semibold text-ink">
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
