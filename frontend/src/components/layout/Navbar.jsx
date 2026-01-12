// src/components/layout/Navbar.jsx
import { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { 
  Menu, 
  X, 
  Phone, 
  ChevronDown,
  Zap,
  ArrowRight
} from "lucide-react";

const navItems = [
  { path: "/", label: "Home" },
  { 
    path: "/services", 
    label: "Services",
    dropdown: [
      { path: "/services/biogas", label: "Biogas & Energy" },
      { path: "/services/farm-systems", label: "Smart Farm Systems" },
      { path: "/services/livestock", label: "Livestock Housing" },
      { path: "/services/construction", label: "Construction Works" },
    ]
  },
  { path: "/projects", label: "Projects" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-[#003023] to-[#004633] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-[#f05010]" />
                <span>Smart Construction · Sustainable Agriculture</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="tel:+256783111015"
                className="flex items-center gap-2 text-xs hover:text-[#83c441] transition-colors"
              >
                <Phone className="w-3 h-3" />
                <span>+256 783 111 015</span>
              </a>
              <div className="h-4 w-px bg-white/20" />
              <a 
                href="mailto:briskfarmsolutions@gmail.com"
                className="text-xs hover:text-[#83c441] transition-colors"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-[#003023]/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#003023] to-[#004633] rounded-xl blur-md opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="relative w-12 h-12 bg-gradient-to-r from-[#003023] to-[#004633] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-lg">BF</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-[#003023] tracking-tight">
                  Brisk Farm
                </span>
                <span className="text-xs text-[#f05010] font-semibold tracking-wide">
                  Solutions & Construction
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div key={item.path} className="relative">
                  {item.dropdown ? (
                    <div 
                      className="relative"
                      onMouseEnter={() => setActiveDropdown(item.path)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button className="flex items-center gap-1 px-4 py-2 text-[#003023] hover:text-[#f05010] font-medium transition-colors group">
                        <span>{item.label}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === item.path ? 'rotate-180' : ''}`} />
                        <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-[#f05010] to-[#83c441] transform scale-x-0 group-hover:scale-x-100 transition-transform ${isActive(item.path) ? 'scale-x-100' : ''}`} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {activeDropdown === item.path && (
                        <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-2xl border border-[#003023]/10 animate-in slide-in-from-top-2">
                          <div className="p-2">
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.path}
                                to={subItem.path}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#f6fef9] text-[#003023] hover:text-[#f05010] transition-all group/sub"
                              >
                                <div className="w-2 h-2 rounded-full bg-[#83c441] opacity-0 group-hover/sub:opacity-100 transition-opacity" />
                                <span className="text-sm font-medium">{subItem.label}</span>
                                <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover/sub:opacity-100 transition-opacity" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => `
                        relative px-4 py-2 text-[#003023] font-medium transition-colors
                        hover:text-[#f05010]
                        ${isActive ? 'text-[#f05010]' : ''}
                      `}
                    >
                      {item.label}
                      <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-[#f05010] to-[#83c441] transform scale-x-0 transition-transform ${isActive ? 'scale-x-100' : ''} group-hover:scale-x-100`} />
                    </NavLink>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                to="/quote"
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#003023] to-[#004633] px-6 py-3 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#f05010] to-[#ff6b35] opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center gap-2">
                  Get Quote
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-[#003023] hover:bg-[#f6fef9] transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-[#003023]/10 shadow-xl animate-in slide-in-from-top">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <div key={item.path} className="py-2">
                    <NavLink
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) => `
                        flex items-center justify-between px-4 py-3 rounded-xl text-[#003023] font-medium
                        ${isActive ? 'bg-[#f6fef9] text-[#f05010]' : 'hover:bg-[#f6fef9] hover:text-[#f05010]'}
                        transition-colors
                      `}
                    >
                      {item.label}
                      {item.dropdown && (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </NavLink>
                    
                    {/* Mobile Dropdown */}
                    {item.dropdown && (
                      <div className="ml-4 mt-2 space-y-2 pl-4 border-l-2 border-[#83c441]/20">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-2 text-sm text-[#003023]/80 hover:text-[#f05010] transition-colors"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-[#003023]/10">
                <Link
                  to="/quote"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center rounded-xl bg-gradient-to-r from-[#003023] to-[#004633] px-6 py-3 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Request Free Quote
                </Link>
                
                <div className="mt-4 flex flex-col gap-3">
                  <a 
                    href="tel:+256783111015"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#f6fef9] text-[#003023] font-medium hover:bg-[#f6fef9]/80 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call Now: +256 783 111 015
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Active Route Indicator */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#003023]/10 to-transparent" />
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-from-top {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: slide-in-from-top 0.2s ease-out;
        }
      `}</style>
    </>
  );
}

export default Navbar;