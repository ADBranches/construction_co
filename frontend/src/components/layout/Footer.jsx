// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-[#8c6e47]/30 bg-[#1f1f1f] text-[#f9fafb]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f0c02f]">
            BRISK FARM SOLUTIONS &amp; CONSTRUCTION CO.
          </h3>
          <p className="mt-2 max-w-md text-xs text-[#f9fafb]/80">
            Integrated agro-systems and modern construction — from biogas and
            livestock housing to crop production, farm infrastructure, and
            general building works across Uganda.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-[#f9fafb]/80">
          <Link to="/projects" className="hover:text-[#f0c02f]">
            View Projects
          </Link>
          <span className="h-3 w-px bg-[#f9fafb]/30" />
          <Link to="/quote" className="hover:text-[#f0c02f]">
            Request Quotation
          </Link>
          <span className="h-3 w-px bg-[#f9fafb]/30" />
          <span>
            © {year} Brisk Farm Solutions &amp; Construction Company. All
            rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
