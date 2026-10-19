// Shared frame for the login / sign-up / password pages
export default function AuthLayout({ title, intro, children, footer }) {
  return (
    <section className="bg-ink">
      <div className="wrap grid gap-10 py-16 md:grid-cols-[1fr_1.1fr] md:items-start md:gap-16 md:py-24">
        <div>
          <h1 className="display text-[clamp(3.25rem,9vw,6rem)] text-stone">{title}</h1>
          {intro && <p className="mt-5 max-w-md text-lg text-stone/80">{intro}</p>}
        </div>
        <div className="rounded-sm bg-stone p-6 text-ink md:p-10">
          {children}
          {footer && <div className="mt-6 border-t border-ink/15 pt-5 text-sm text-ink/75">{footer}</div>}
        </div>
      </div>
    </section>
  );
}

export function FormError({ message }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-lg bg-red-700/10 px-4 py-3 text-sm font-medium text-red-800">
      {message}
    </p>
  );
}

export function TextField({ id, label, error, hint, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input
        id={id}
        className="field"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...props}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink/60">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
