// src/components/admin/Topbar.jsx
import { getAdminEmail, logout } from "../../lib/auth";

export default function Topbar() {
  const email = getAdminEmail();

  return (
    <header className="flex items-center justify-between rounded-2xl border border-[var(--brand-green)]/15 bg-white px-4 py-3 shadow-sm">
      <div>
        <h2 className="text-sm font-semibold text-[var(--brand-contrast)]">
          Brisk Admin Dashboard
        </h2>
        <p className="text-[11px] text-[var(--brand-contrast)]/60">
          Monitor inquiries, projects, and services in one place.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {email && (
          <span className="text-xs text-[var(--brand-contrast)]/80">
            {email}
          </span>
        )}

        <button
          onClick={logout}
          className="rounded-full bg-[var(--brand-green)] px-4 py-1.5 text-xs font-semibold text-[#fdfcf7] shadow hover:bg-[var(--brand-green)]/90"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
