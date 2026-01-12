// src/components/admin/Topbar.jsx
import { getAdminEmail, logout } from "../../lib/auth";

export default function Topbar() {
  const email = getAdminEmail();

  return (
    <header className="fixed top-0 left-64 right-0 z-30 flex items-center justify-between bg-white px-6 py-4 shadow border-b border-[var(--brand-green)]/15">
      <div>
        <h2 className="text-lg font-semibold text-[var(--brand-contrast)]">
          Brisk Admin Dashboard
        </h2>
        <p className="text-[11px] text-[var(--brand-contrast)]/60">
          Monitor inquiries, projects, and services in one place.
        </p>
      </div>

      <div className="flex items-center space-x-4">
        {email && (
          <span className="text-xs text-[var(--brand-contrast)]/80">
            {email}
          </span>
        )}

        <button
          onClick={logout}
          className="rounded-full bg-[var(--brand-green)] px-4 py-2 text-xs font-semibold text-[#fdfcf7] shadow hover:bg-[var(--brand-green)]/90"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
