import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout, { FormError, TextField } from "../components/shared/AuthLayout";
import { useAuth } from "../context/AuthContext";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("The two passwords don't match.");
    setBusy(true);
    setError("");
    try {
      await resetPassword(token, password);
      navigate("/sermons", { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      title="New password"
      intro="Choose a new password for your RGE member account."
      footer={
        <Link to="/forgot-password" className="font-semibold text-ink underline underline-offset-2">
          Request a new reset link
        </Link>
      }
    >
      {!token ? (
        <FormError message="This reset link is incomplete. Open the link from your email again, or request a new one." />
      ) : (
        <form onSubmit={handleSubmit} noValidate className="grid gap-5">
          <FormError message={error} />
          <TextField id="reset-password" label="New password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} hint="At least 8 characters." />
          <TextField id="reset-confirm" label="Type it again" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          <div>
            <button type="submit" className="btn-ink" disabled={busy}>
              {busy ? "Saving…" : "Save new password"}
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
