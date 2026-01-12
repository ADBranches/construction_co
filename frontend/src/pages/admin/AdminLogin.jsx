// src/pages/admin/AdminLogin.jsx
import { useState } from "react";
import { login } from "../../lib/auth";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError(err.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--brand-contrast)] bg-gradient-to-br from-[var(--brand-contrast)] via-black/70 to-[var(--brand-green)]/40 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--brand-green)]/20 bg-[#fdfcf7] p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold tracking-[0.18em] uppercase text-[var(--brand-yellow)]">
            Brisk Admin Login
          </h1>
          <p className="mt-2 text-xs text-[var(--brand-contrast)]/70">
            Secure access to manage projects, services and inquiries.
          </p>
        </div>

        {error && (
          <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--brand-contrast)]">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@briskfarmsolutions.com"
              className="w-full rounded-xl border border-[var(--brand-contrast)]/15 bg-[#f9fafb] px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--brand-contrast)]">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-[var(--brand-contrast)]/15 bg-[#f9fafb] px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-[var(--brand-green)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#fdfcf7] shadow-md shadow-[var(--brand-green)]/40 hover:bg-[var(--brand-green)]/90 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-3 text-center text-[10px] text-[var(--brand-contrast)]/60">
            Brisk Farm Solutions &amp; Construction Company – internal use only.
          </p>
        </form>
      </div>
    </div>
  );
}
