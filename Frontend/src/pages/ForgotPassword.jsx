import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout, { FormError, TextField } from "../components/shared/AuthLayout";
import { api } from "../lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter the email address you signed up with.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await api("/api/auth/forgot-password", { method: "POST", body: { email: email.trim() }, auth: false });
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      title="Reset password"
      intro="Enter your email and we'll send you a link to choose a new password."
      footer={
        <Link to="/login" className="font-semibold text-ink underline underline-offset-2">
          Back to log in
        </Link>
      }
    >
      {sent ? (
        <div role="status">
          <p className="display text-4xl">Check your email</p>
          <p className="mt-3">
            If {email.trim()} has an account, a reset link is on its way. The link works for 1 hour. Check your spam
            folder if you don't see it.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="grid gap-5">
          <FormError message={error} />
          <TextField id="forgot-email" label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div>
            <button type="submit" className="btn-ink" disabled={busy}>
              {busy ? "Sending…" : "Send reset link"}
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
