import { useState } from "react";
import { sendVisitorForm } from "../../lib/api";

const empty = { name: "", phone: "", email: "", address: "", visitDate: "", service: "Sunday", question: "" };

function validate(f) {
  const errors = {};
  if (!f.name.trim()) errors.name = "Enter your name.";
  if (!f.phone.trim() && !f.email.trim()) errors.phone = "Enter a phone number or an email so we can reach you.";
  if (f.phone.trim() && !/^[+\d][\d\s-]{6,}$/.test(f.phone.trim()))
    errors.phone = "Enter a phone number using digits, like 0803 123 4567.";
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
    errors.email = "Enter a valid email address, like name@example.com.";
  return errors;
}

function Field({ id, label, error, children }) {
  return (
  <div>
    <label htmlFor={id} className="label">
      {label}
    </label>
    {children}
    {error && (
      <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-red-700">
        {error}
      </p>
    )}
  </div>
  );
}

export default function VisitorForm() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    setStatus("sending");
    try {
      await sendVisitorForm(form);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-sm bg-stone p-8 text-ink md:p-10" role="status">
        <p className="display text-5xl">Thank you, {form.name.trim().split(" ")[0]}!</p>
        <p className="mt-4 text-lg">
          We've received your details and someone from our first-timers team will reach out to you before{" "}
          {form.service === "Friday" ? "Friday" : "Sunday"}.
        </p>
        <button
          type="button"
          className="btn-ghost-light mt-6"
          onClick={() => {
            setForm(empty);
            setStatus("idle");
          }}
        >
          Fill another form
        </button>
      </div>
    );
  }

  const errProps = (key) => ({
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5 rounded-sm bg-stone p-6 text-ink sm:grid-cols-2 md:p-10">
      <div className="sm:col-span-2">
        <Field id="name" label="Full name" error={errors.name}>
          <input id="name" value={form.name} onChange={update("name")} autoComplete="name" className="field" {...errProps("name")} />
        </Field>
      </div>
      <Field id="phone" label="Phone number" error={errors.phone}>
        <input id="phone" type="tel" value={form.phone} onChange={update("phone")} autoComplete="tel" placeholder="0803 123 4567" className="field" {...errProps("phone")} />
      </Field>
      <Field id="email" label="Email" error={errors.email}>
        <input id="email" type="email" value={form.email} onChange={update("email")} autoComplete="email" placeholder="name@example.com" className="field" {...errProps("email")} />
      </Field>
      <div className="sm:col-span-2">
        <Field id="address" label="Area you live in (optional)">
          <input id="address" value={form.address} onChange={update("address")} autoComplete="street-address" className="field" />
        </Field>
      </div>
      <Field id="visitDate" label="When are you planning to visit?">
        <input id="visitDate" type="date" value={form.visitDate} onChange={update("visitDate")} className="field" />
      </Field>
      <fieldset>
        <legend className="label">Which service?</legend>
        <div className="flex gap-2">
          {["Sunday", "Friday"].map((s) => (
            <label
              key={s}
              className={`flex-1 cursor-pointer rounded-lg border px-4 py-3 text-center text-sm font-semibold transition-colors ${
                form.service === s ? "border-ink bg-ink text-stone" : "border-sand bg-white/70 hover:border-ink"
              }`}
            >
              <input type="radio" name="service" value={s} checked={form.service === s} onChange={update("service")} className="sr-only" />
              {s}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="sm:col-span-2">
        <Field id="question" label="Any questions for us? (optional)">
          <textarea id="question" rows={4} value={form.question} onChange={update("question")} className="field resize-y" />
        </Field>
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" className="btn-ink" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send my details"}
        </button>
        {status === "error" && (
          <p className="text-sm font-medium text-red-700">
            Your details didn't send. Check your connection and try again.
          </p>
        )}
      </div>
    </form>
  );
}
