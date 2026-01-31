// src/components/layout/Navbar.jsx
import { useState, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
import briskLogo from "/brisk_logo5.png";

const navItems = [
  { path: "/", label: "Home" },
  {
    label: "Services",
    dropdown: [
      {
        path: "/services/animal-production-consultancy",
        label: "Animal Production Consultancy",
      },
      {
        path: "/services/farm-and-household-waste-management",
        label: "Farm & Household Waste Management",
      },
      {
        path: "/services/biodigester-installation",
        label: "Biodigester Installation",
      },
      {
        path: "/services/biogas-appliances-supply",
        label: "Supply of Biogas Appliances",
      },
      {
        path: "/services/capacity-building-services",
        label: "Capacity Building Services",
      },
      {
        path: "/services/pasture-establishment-and-management",
        label: "Pasture Establishment & Management",
      },
    ],
  },
  { path: "/projects", label: "Projects" },
  {
    label: "About",
    dropdown: [
      { path: "/about", label: "Overview" },
      { path: "/about#company", label: "About the Company" },
      { path: "/about#story", label: "Our Story & History" },
      { path: "/about#values", label: "Vision, Mission & Values" },
      { path: "/about#journey", label: "Our Journey" },
      { path: "/about#gallery", label: "Gallery" },
      { path: "/about#faqs", label: "FAQs" },
    ],
  },
  { path: "/contact", label: "Contact" },
  { path: "/donate", label: "Donate" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownPinnedIndex, setDropdownPinnedIndex] = useState(null);

  // small delay before hiding dropdown when using hover
  const hideTimeoutRef = useRef(null);

  const handleDropdownEnter = (index) => {
    // if user has pinned a dropdown by clicking, don't override it with hover
    if (dropdownPinnedIndex !== null) return;

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setActiveDropdown(index);
  };

  const handleDropdownLeave = () => {
    // if pinned via click, don't auto-hide at all
    if (dropdownPinnedIndex !== null) return;

    hideTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 700); // a bit longer so it doesn't vanish too fast
  };

  const handleDropdownClick = (index) => {
    // click = “pin/unpin” the dropdown so it doesn’t timeout easily
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    if (dropdownPinnedIndex === index) {
      // unpin & close
      setDropdownPinnedIndex(null);
      setActiveDropdown(null);
    } else {
      setDropdownPinnedIndex(index);
      setActiveDropdown(index);
    }
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between py-3 lg:py-4">
          {/* LOGO */}
          <Link to="/" className="flex-shrink-0">
            <img
              src={briskLogo}
              alt="Brisk Farm Solutions & Construction Company Logo"
              className="h-10 md:h-12 lg:h-14 w-auto object-contain"
            />
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) =>
              item.dropdown ? (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(index)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    type="button"
                    onClick={() => handleDropdownClick(index)}
                    className="text-[#003023] font-semibold text-sm hover:text-[#83c441] transition flex items-center gap-1"
                  >
                    {item.label}
                  </button>

                  {activeDropdown === index && (
                    <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-xl border border-gray-100 py-2 w-72 z-50">
                      {item.dropdown.map((drop, i) => (
                        <NavLink
                          key={i}
                          to={drop.path}
                          className="block px-4 py-2 text-sm text-[#003023] hover:bg-[#f6fef9] hover:text-[#83c441] transition"
                        >
                          {drop.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-sm font-semibold transition border-b-2 ${
                      isActive
                        ? "text-[#f05010] border-[#f05010]"
                        : "text-[#003023] border-transparent hover:text-[#83c441]"
                    } pb-1`
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
          </div>

          {/* RIGHT SIDE ACTIONS */}
          <div className="hidden lg:flex items-center space-x-6">
            <a
              href="tel:+256783111015"
              className="flex items-center gap-2 text-sm text-[#003023] hover:text-[#83c441] transition"
            >
              <Phone size={16} />
              +256 783 111 015
            </a>

            <Link
              to="/quote"
              className="px-5 py-2.5 rounded-xl bg-[#f05010] text-white text-sm font-semibold shadow-md hover:bg-[#d9460c] transition flex items-center gap-2"
            >
              Get Quote <ArrowRight size={16} />
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-[#003023]"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* MOBILE DROPDOWN */}
        {open && (
          <div className="lg:hidden bg-white border-t border-gray-100 pb-4">
            {navItems.map((item, index) =>
              item.dropdown ? (
                <div key={index} className="px-4 pt-3">
                  <p className="font-semibold text-[#003023] mb-1">
                    {item.label}
                  </p>
                  <div className="ml-3 space-y-2">
                    {item.dropdown.map((drop, i) => (
                      <NavLink
                        key={i}
                        to={drop.path}
                        onClick={() => setOpen(false)}
                        className="block text-sm text-[#003023]/80 hover:text-[#83c441]"
                      >
                        {drop.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink
                  key={index}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-sm font-semibold text-[#003023] hover:text-[#83c441]"
                >
                  {item.label}
                </NavLink>
              )
            )}

            {/* Mobile CTA */}
            <div className="px-4 mt-4">
              <Link
                to="/quote"
                className="w-full inline-flex justify-center px-5 py-3 rounded-xl bg-[#f05010] text-white text-sm font-semibold hover:bg-[#d9460c]"
              >
                Get Quote
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
