// src/components/admin/Sidebar.jsx
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const links = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Projects", path: "/admin/projects" },
    { label: "Services", path: "/admin/services" },
    { label: "Inquiries", path: "/admin/inquiries" },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-[var(--brand-contrast,#1f1f1f)] pt-6 text-[#fdfcf7] shadow-lg">
      <div className="mb-8 px-4">
        <h1 className="text-lg font-bold uppercase tracking-[0.18em] text-[var(--brand-yellow)]">
          Brisk Admin
        </h1>
        <p className="mt-1 text-[11px] text-[#fdfcf7]/70">
          Manage projects, services &amp; inquiries.
        </p>
      </div>

      <nav className="flex flex-col space-y-2 px-4">
        {links.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-[var(--brand-green)] text-[#fdfcf7] shadow shadow-[var(--brand-green)]/40"
                  : "text-[#fdfcf7]/80 hover:bg-[var(--brand-green)]/10"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
