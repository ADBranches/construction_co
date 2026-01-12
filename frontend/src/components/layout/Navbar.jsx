// src/components/layout/Navbar.jsx
import { NavLink, Link } from "react-router-dom";

const navLinkBase =
  "text-sm md:text-base font-medium transition-colors hover:text-[#f0c02f]";
const activeClass = "text-[#f0c02f]";

function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#1f1f1f]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2f8f2f] text-sm font-black text-white shadow-lg shadow-[#2f8f2f]/40">
            BF
          </div>
          <div className="flex flex-col leading-tight text-white">
            <span className="text-sm font-semibold uppercase tracking-[0.15em]">
              BRISK FARM
            </span>
            <span className="text-xs text-[#f0c02f]">
              Solutions &amp; Construction Co.
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden gap-6 md:flex">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? activeClass : "text-white"}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? activeClass : "text-white"}`
            }
          >
            About
          </NavLink>

          <NavLink
            to="/services"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? activeClass : "text-white"}`
            }
          >
            Services
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? activeClass : "text-white"}`
            }
          >
            Projects
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? activeClass : "text-white"}`
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* CTA */}
        <Link
          to="/quote"
          className="hidden rounded-full bg-[#2f8f2f] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-md shadow-[#2f8f2f]/40 hover:bg-[#256b25] md:inline-block"
        >
          Request Quote
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
