import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, LogIn } from "lucide-react";
import AuthLayout from "../components/AuthLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Couldn't log you in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to keep debugging with your AI assistant."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </div>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Email</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={update("email")}
            placeholder="you@example.com"
            className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text outline-none placeholder:text-muted/60 focus:border-accent/60 focus:ring-1 focus:ring-accent/40"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Password</span>
          <input
            type="password"
            required
            value={form.password}
            onChange={update("password")}
            placeholder="••••••••"
            className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text outline-none placeholder:text-muted/60 focus:border-accent/60 focus:ring-1 focus:ring-accent/40"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-accent/90 disabled:opacity-60 cursor-pointer"
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Don't have an account?{" "}
        <Link to="/register" className="text-accent hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
