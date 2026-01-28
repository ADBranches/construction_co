// src/components/layout/AdminLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import { logout } from "../../lib/auth.js";

const baseLink =
  "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors";
const activeLink =
  "bg-[var(--brand-green)] text-[#fdfcf7] shadow-sm shadow-[var(--brand-green)]/30";
const inactiveLink =
  "text-[var(--brand-contrast)]/80 hover:bg-[var(--brand-green)]/5";

function AdminLayout({ children }) {
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-[var(--brisk-cream,#f6fef9)] text-[var(--brand-contrast)]">
      <div className="container py-6">
        <div className="grid gap-6 md:grid-cols-[240px,1fr] items-start">
          <aside className="brand-card h-full p-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-yellow)]">
              Brisk Admin
            </h2>
            <p className="mt-1 text-xs text-[var(--brand-contrast)]/70">
              CMS for projects, services &amp; inquiries.
            </p>

            <nav className="mt-4 space-y-1">
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `${baseLink} ${isActive ? activeLink : inactiveLink}`
                }
              >
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/admin/projects"
                className={({ isActive }) =>
                  `${baseLink} ${isActive ? activeLink : inactiveLink}`
                }
              >
                <span>Projects</span>
              </NavLink>

              <NavLink
                to="/admin/services"
                className={({ isActive }) =>
                  `${baseLink} ${isActive ? activeLink : inactiveLink}`
                }
              >
                <span>Services</span>
              </NavLink>

              <NavLink
                to="/admin/inquiries"
                className={({ isActive }) =>
                  `${baseLink} ${isActive ? activeLink : inactiveLink}`
                }
              >
                <span>Inquiries</span>
              </NavLink>
            </nav>

            <button
              onClick={handleLogout}
              className="mt-6 w-full rounded-xl border border-[var(--brand-green)]/40 bg-[var(--brand-green)]/5 px-3 py-2 text-xs font-semibold text-[var(--brand-green)] hover:bg-[var(--brand-green)]/10"
            >
              Log out
            </button>
          </aside>

          {/* 🔑 admin pages render here */}
          <section className="space-y-4">
            {children ?? <Outlet />}
          </section>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
