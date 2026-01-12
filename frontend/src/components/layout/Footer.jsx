// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowRight,
  Shield,
  Award,
  Globe
} from "lucide-react";

function Footer() {
  const year = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "#services" },
    { name: "Projects", path: "/projects" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Get Quote", path: "/quote" }
  ];

  const services = [
    "Smart Farm Systems",
    "Biogas Installation",
    "Livestock Housing",
    "Farm Construction",
    "Civil Works",
    "Renewable Energy"
  ];

  const contactInfo = [
    {
      icon: Phone,
      text: "+256 783 111 015",
      href: "tel:+256783111015"
    },
    {
      icon: Mail,
      text: "briskfarmsolutions@gmail.com",
      href: "mailto:briskfarmsolutions@gmail.com"
    },
    {
      icon: MapPin,
      text: "Serving Nationwide Across Uganda",
      href: "#"
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" }
  ];

  return (
    <footer className="bg-gradient-to-b from-[#001f17] to-[#003023] text-white mt-20">
      {/* Top Pattern */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#ffffff09,_transparent_60%)]" />
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-[#f05010] to-[#ff6b35] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Brisk Farm Solutions</h3>
                <p className="text-sm text-white/70">&amp; Construction Company</p>
              </div>
            </div>
            
            <p className="text-white/80 leading-relaxed mb-6 max-w-xl">
              We combine modern engineering with practical innovation to deliver 
              sustainable farm systems and construction solutions across Uganda. 
              From biogas installations to complete farm infrastructure, we build 
              foundations for sustainable growth.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                <Shield className="w-4 h-4 text-[#83c441]" />
                <span className="text-xs">Certified Engineers</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                <Award className="w-4 h-4 text-[#f05010]" />
                <span className="text-xs">5-Star Rated</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                <Globe className="w-4 h-4 text-[#83c441]" />
                <span className="text-xs">Nationwide Service</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/70">Follow us:</span>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:text-[#f05010]"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#f05010] rounded-full" />
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="group flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 text-[#83c441] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-sm">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 relative inline-block">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#83c441] rounded-full" />
            </h4>
            <div className="space-y-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <a
                    key={index}
                    href={info.href}
                    className="flex items-start gap-3 group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#003023] to-[#004633] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-[#83c441]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white/90 group-hover:text-white transition-colors">
                        {info.text}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Newsletter Signup */}
            <div className="mt-8">
              <p className="text-sm font-semibold mb-3">Stay Updated</p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm placeholder-white/50 focus:outline-none focus:border-[#83c441] transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#f05010] to-[#ff6b35] text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Services Tags */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-sm font-semibold mb-4 text-center">
            Our Services Include:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {services.map((service, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-xs text-white/80 hover:text-white transition-all cursor-pointer hover:scale-105"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-xs text-white/60">
                © {year} Brisk Farm Solutions &amp; Construction Company. All rights reserved.
              </p>
              <p className="text-xs text-white/60 mt-1">
                Registered in Uganda | URSB Certified
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/60">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookie Policy
              </a>
              <span className="hidden md:inline">|</span>
              <span className="text-white/40">Made with ❤️ for Uganda</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="relative">
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-r from-[#f05010]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-l from-[#83c441]/10 to-transparent rounded-full blur-3xl" />
      </div>
    </footer>
  );
}

export default Footer;
