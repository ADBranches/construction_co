// src/components/layout/Navbar.jsx
import { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Phone,
  ChevronDown,
  ArrowRight,
  Zap,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Home" },
  {
    path: "/services",
    label: "Services",
    dropdown: [
      { path: "/services/biodigester-installation", label: "Biodigester Installation" },
      { path: "/services/farm-and-household-waste-management", label: "Waste Management" },
      { path: "/services/animal-production-consultancy", label: "Animal Production Consultancy" },
      { path: "/services/biogas-appliances-supply", label: "Biogas Appliances Supply" },
      { path: "/services/capacity-building-services", label: "Capacity Building" },
      { path: "/services/pasture-establishment-and-management", label: "Pasture Management" },
    ],
  },
  { path: "/projects", label: "Projects" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
  { path: "/donate", label: "Donate" }, // NEW
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  // admin check
  const isAdminUser = localStorage.getItem("is_superuser") === "1";

  return (
    <>
      {/* ░ TOP BRAND STRIP ░ */}
      <div className="bg-[#003023] text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-[#f05010]" />
            <span>Smart Construction · Sustainable Agriculture</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:+256783111015"
              className="flex items-center gap-2 hover:text-[#83c441] transition"
            >
              <Phone className="w-3 h-3" />
              +256 783 111 015
            </a>

            <div className="h-4 w-px bg-white/30" />

            <a
              href="mailto:briskfarmsolutions@gmail.com"
              className="hover:text-[#83c441] transition"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>

      {/* ░ MAIN NAVBAR ░ */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[#003023]/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-4">
              <img
                src="/image2vector.svg"
                alt="Brisk Farm Logo"
                className="w-14 h-14 object-contain rounded-xl shadow-sm"
              />
              <div className="leading-tight">
                <span className="text-xl font-bold text-[#003023] tracking-tight">
                  Brisk Farm
                </span>
                <span className="block text-xs text-[#f05010] font-semibold">
                  Solutions & Construction Company Ltd
                </span>
              </div>
            </Link>

            {/* ░ DESKTOP NAV ░ */}
            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => (
                <div key={item.path} className="relative">

                  {item.dropdown ? (
                    <div
                      onMouseEnter={() => setActiveDropdown(item.path)}
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="relative"
                    >
                      <button className="relative px-4 py-2 flex items-center gap-1 font-medium text-[#003023] hover:text-[#f05010] transition group">
                        {item.label}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            activeDropdown === item.path ? "rotate-180" : ""
                          }`}
                        />

                        {/* Hover underline */}
                        <span
                          className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-[#f05010] to-[#83c441]
                            transition transform origin-left
                            ${
                              isActive(item.path)
                                ? "scale-x-100"
                                : "scale-x-0 group-hover:scale-x-100"
                            }`}
                        />
                      </button>

                      {/* DROPDOWN MENU */}
                      {activeDropdown === item.path && (
                        <div className="absolute top-full mt-2 w-60 bg-white rounded-xl border border-[#003023]/10 shadow-xl animate-in">
                          <div className="p-2">
                            {item.dropdown.map((sub) => (
                              <Link
                                key={sub.path}
                                to={sub.path}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#003023] transition group/sub hover:bg-[#f6fef9] hover:text-[#f05010]"
                              >
                                <div className="w-2 h-2 rounded-full bg-[#83c441] opacity-0 group-hover/sub:opacity-100" />
                                {sub.label}
                                <ArrowRight className="ml-auto w-3 h-3 opacity-0 group-hover/sub:opacity-100 transition" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* REGULAR DESKTOP LINK */
                    <NavLink
                      to={item.path}
                      className={({ isActive: active }) =>
                        `relative px-4 py-2 font-medium transition ${
                          active ? "text-[#f05010]" : "text-[#003023]"
                        } hover:text-[#f05010]`
                      }
                    >
                      {item.label}
                      <span
                        className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-[#f05010] to-[#83c441]
                          transition transform
                          ${
                            isActive(item.path)
                              ? "scale-x-100"
                              : "scale-x-0 group-hover:scale-x-100"
                          }`}
                      />
                    </NavLink>
                  )}
                </div>
              ))}
              {isAdminUser && (
                <NavLink
                  to="/admin/dashboard"
                  className="relative px-4 py-2 font-medium text-[#003023] hover:text-[#f05010] transition"
                >
                  Admin
                </NavLink>
              )}
            </nav>

            {/* ░ DESKTOP CTA ░ */}
            <Link
              to="/quote"
              className="hidden lg:flex items-center gap-2 px-6 py-3 rounded-xl bg-[#f05010] text-white font-semibold shadow-md hover:bg-[#d9460c] transition hover:scale-105"
            >
              Get Quote
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-[#003023] hover:bg-[#f6fef9]"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* ░ MOBILE NAV MENU ░ */}
      {isOpen && (
        <nav className="lg:hidden bg-white border-b border-[#003023]/10 shadow-md">
          <div className="px-4 py-4 space-y-2">

            {navItems.map((item) => (
              <div key={item.path}>
                {item.dropdown ? (
                  <details className="group">
                    <summary className="flex items-center justify-between px-2 py-2 text-[#003023] font-medium cursor-pointer">
                      {item.label}
                      <ChevronDown className="w-4 h-4 group-open:rotate-180 transition" />
                    </summary>

                    <div className="pl-4 py-2 space-y-1">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          onClick={() => setIsOpen(false)}
                          className="block px-2 py-2 rounded-lg text-[#003023] hover:bg-[#f6fef9] hover:text-[#f05010]"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-2 rounded-lg text-[#003023] font-medium hover:bg-[#f6fef9] hover:text-[#f05010]"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            {isAdminUser && (
              <Link
                to="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-2 py-2 rounded-lg text-[#003023] font-medium hover:bg-[#f6fef9] hover:text-[#f05010]"
              >
                Admin Dashboard
              </Link>
            )}

            {/* MOBILE CTA */}
            <Link
              to="/quote"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-4 py-3 bg-[#f05010] text-white rounded-xl font-semibold hover:bg-[#d9460c]"
            >
              Get Quote →
            </Link>
          </div>
        </nav>
      )}

      {/* GLOBAL ANIMATION STYLE */}
      <style>{`
        @keyframes slide-in-from-top {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: slide-in-from-top 0.25s ease-out;
        }
      `}</style>
    </>
  );
}

export default Navbar;
