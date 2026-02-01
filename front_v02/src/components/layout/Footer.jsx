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
  Youtube,
} from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Projects", path: "/projects" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Request a Quote", path: "/quote" },
    { name: "Donate", path: "/donate" },
  ];

  const contactInfo = [
    { icon: Phone, text: "+256 783 111 015", href: "tel:+256783111015" },
    {
      icon: Mail,
      text: "briskfarmsolutions@gmail.com",
      href: "mailto:briskfarmsolutions@gmail.com",
    },
    {
      icon: MapPin,
      text: "Ntinda–Kigoowa Road, Mai Mall • Kampala, Uganda",
      href: "#",
    },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: "https://www.facebook.com/profile.php?id=61581655871026",
      label: "Brisk Farm Solutions on Facebook",
    },
    {
      icon: Twitter,
      href: "https://x.com/brisk_company",
      label: "@brisk_company on X (Twitter)",
    },
    {
      icon: Instagram,
      href: "https://instagram.com/briskco_",
      label: "@briskco_ on Instagram",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/briskfarmsolutionsandconstructioncompany/",
      label: "Brisk Farm Solutions on LinkedIn",
    },
    {
      icon: Youtube,
      href: "https://www.youtube.com/@biogasexpertuganda3431/shorts",
      label: "Biogas Expert Uganda on YouTube",
    },
  ];

  return (
  <footer className="bg-gradient-to-b from-[#00271c] via-[#004633] to-[#001a14] text-white">
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-12">
      {/* MAIN GRID: logo + links + contact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
        {/* BRAND */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white flex items-center justify-center shadow-lg">
              <img
                src="/brisk_logo5.png"
                alt="Brisk Farm logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                Brisk Farm Solutions
              </h3>
              <p className="text-white/70 text-sm">
                &amp; Construction Company Ltd
              </p>
            </div>
          </div>

          <p className="text-white/80 text-sm leading-relaxed max-w-md">
            Smart farm systems, biodigesters, biogas appliances and
            construction works that turn everyday waste into clean energy and
            better productivity.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-3">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="text-sm text-white/80 hover:text-white transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT + SOCIAL */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact</h4>

          <div className="space-y-3 mb-5">
            {contactInfo.map((info, i) => {
              const Icon = info.icon;
              return (
                <a
                  key={i}
                  href={info.href}
                  className="flex items-center gap-3 text-sm text-white/85 hover:text-white transition"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#83c441]" />
                  </div>
                  <span>{info.text}</span>
                </a>
              );
            })}
          </div>

          <div>
            <p className="text-sm font-medium mb-3">Follow us</p>
            <div className="flex gap-3">
              {socialLinks.map((social, i) => {
                const Icon = social.icon;
                return (
                  <a
                    key={i}
                    href={social.href}
                    aria-label={social.label}
                    title={social.label}
                    target={social.href === "#" ? "_self" : "_blank"}
                    rel={
                      social.href === "#" ? undefined : "noopener noreferrer"
                    }
                    className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="mt-10 pt-5 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs md:text-sm text-white/70">
        <p>
          © {year} Brisk Farm Solutions &amp; Construction Company Ltd. All
          rights reserved.
        </p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition">
            Privacy
          </a>
          <a href="#" className="hover:text-white transition">
            Terms
          </a>
        </div>
      </div>
    </div>
  </footer>
);}