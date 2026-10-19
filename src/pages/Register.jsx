import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthLayout, { FormError, TextField } from "../components/shared/AuthLayout";
import { useAuth } from "../context/AuthContext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/sermons";
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={from} replace />;

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    const found = {};
    if (!form.name.trim()) found.name = "Enter your name.";
    if (!EMAIL_RE.test(form.email.trim())) found.email = "Enter a valid email address, like name@example.com.";
    if (form.password.length < 8) found.password = "Use at least 8 characters.";
    setErrors(found);
    if (Object.keys(found).length) return;

    setBusy(true);
    setError("");
    try {
      await register({ ...form, name: form.name.trim(), email: form.email.trim() });
      navigate(from, { replace: true });
    } catch (err) {
      setErrors(err.details || {});
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      title="Join online"
      intro="Create a free member account to listen to and download sermons from Revive Gospel Embassy."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" state={{ from }} className="font-semibold text-ink underline underline-offset-2">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="grid gap-5">
        <FormError message={error} />
        <TextField id="reg-name" label="Full name" autoComplete="name" value={form.name} onChange={set("name")} error={errors.name} />
        <TextField id="reg-email" label="Email" type="email" autoComplete="email" value={form.email} onChange={set("email")} error={errors.email} />
        <TextField id="reg-phone" label="Phone number (optional)" type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} />
        <TextField
          id="reg-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={set("password")}
          error={errors.password}
          hint="At least 8 characters."
        />
        <div>
          <button type="submit" className="btn-ink" disabled={busy}>
            {busy ? "Creating account…" : "Create account"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
