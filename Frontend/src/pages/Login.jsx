import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthLayout, { FormError, TextField } from "../components/shared/AuthLayout";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/sermons";
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={from} replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email.trim() || !form.password) {
      setError("Enter your email and password.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await login(form.email.trim(), form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      title="Log in"
      intro="Welcome back. Log in to listen to and download sermons."
      footer={
        <>
          New to RGE online?{" "}
          <Link to="/register" state={{ from }} className="font-semibold text-ink underline underline-offset-2">
            Create a member account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="grid gap-5">
        <FormError message={error} />
        <TextField id="login-email" label="Email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <TextField id="login-password" label="Password" type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button type="submit" className="btn-ink" disabled={busy}>
            {busy ? "Logging in…" : "Log in"}
          </button>
          <Link to="/forgot-password" className="text-sm font-semibold underline underline-offset-2">
            Forgot your password?
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
