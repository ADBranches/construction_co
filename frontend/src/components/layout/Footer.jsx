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
  Globe,
  Heart,
} from "lucide-react";
import FooterNewsletter from "../FooterNewsletter";

export default function Footer() {
  const year = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Projects", path: "/projects" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Request a Quote", path: "/quote" },
  ];

    const coreServices = [
      "Animal production consultancy – dairy, beef, poultry & small ruminants",
      "Farm & household waste stream mapping & management",
      "Biodigester installation – fixed dome & prefabricated units",
      "Supply of biogas appliances – burners, generators, pumps & accessories",
      "Capacity building – livestock & biodigester systems management",
      "Pasture establishment, rehabilitation & management",
    ];

  const contactInfo = [
    { icon: Phone, text: "+256 783 111 015", href: "tel:+256783111015" },
    { icon: Mail, text: "briskfarmsolutions@gmail.com", href: "mailto:briskfarmsolutions@gmail.com" },
    { icon: MapPin, text: "Ssenge, Wakiso • Nationwide in Uganda", href: "#" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" }, // to be updated later
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
    { icon: Linkedin, href: "#", label: "LinkedIn" }, // to be updated later
  ];

  return (
    <footer className="relative bg-gradient-to-b from-[#001a14] to-[#003023] text-white overflow-hidden">
      {/* Soft top fade */}
      <div className="h-20 bg-gradient-to-b from-transparent to-[#001a14]/60" />

      <div className="relative">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_25%_70%,#83c44133_0%,transparent_50%),radial-gradient(circle_at_80%_20%,#f0501033_0%,transparent_55%)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-20">
          {/* GRID: About | Quick Links | Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-14 lg:gap-16">

            {/* ABOUT SECTION */}
            <div className="lg:col-span-5">
              {/* Logo + Title */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-[#f05010] to-[#ff6b35] rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-white font-black text-3xl">B</span>
                </div>

                <div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Brisk Farm Solutions
                  </h3>
                  <p className="text-white/60 text-sm md:text-base mt-1">
                    & Construction Company
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-white/85 text-base md:text-lg leading-relaxed mb-10 max-w-xl">
                We design and build farm systems that turn waste into value — from animal
                production units and pasture systems to biodigesters, biogas appliances and
                modern construction. Our work maximises farm and household waste to generate
                clean energy and bio-fertilisers for today&apos;s and tomorrow&apos;s needs.
              </p>


              {/* TRUST BADGES */}
              <div className="flex flex-wrap gap-4 mb-12">
                {[
                  { icon: Shield, text: "Waste-to-Energy Specialists", color: "#83c441" },
                  { icon: Award, text: "Farmer-Trusted Projects", color: "#f05010" },
                  { icon: Globe, text: "Nationwide Field Support", color: "#83c441" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white/10 border border-white/10 backdrop-blur-sm rounded-xl px-5 py-3"
                  >
                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* SOCIAL LINKS */}
              <div className="flex items-center gap-6">
                <span className="text-white/80 font-medium">Follow Us</span>
                <div className="flex gap-4">
                  {socialLinks.map((social, i) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={i}
                        href={social.href}
                        aria-label={social.label}
                        title={social.label}
                        target={social.href === "#" ? "_self" : "_blank"}
                        rel={social.href === "#" ? undefined : "noopener noreferrer"}
                        className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-allduration-300 hover:scale-110"
                      >
                        <Icon className="w-6 h-6" />
                      </a>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* QUICK LINKS */}
            <div className="lg:col-span-3">
              <h4 className="text-xl md:text-2xl font-bold mb-8 relative inline-block">
                Quick Links
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#f05010] rounded-full" />
              </h4>

              <ul className="space-y-5">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="group flex items-center gap-3 text-white/85 hover:text-white text-lg transition-all"
                    >
                      <ArrowRight className="w-4 h-4 text-[#83c441] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONTACT + NEWSLETTER */}
            <div className="lg:col-span-4">
              <h4 className="text-xl md:text-2xl font-bold mb-8 relative inline-block">
                Get in Touch
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#83c441] rounded-full" />
              </h4>

              <div className="space-y-6">
                {contactInfo.map((info, i) => {
                  const Icon = info.icon;
                  return (
                    <a
                      key={i}
                      href={info.href}
                      className="group flex items-center gap-4 hover:text-white transition-all"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-[#003023] to-[#004633] rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6 text-[#83c441]" />
                      </div>
                      <span className="text-lg text-white/90 group-hover:text-white">
                        {info.text}
                      </span>
                    </a>
                  );
                })}
              </div>

              {/* Newsletter */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-base font-medium mb-4">Stay Updated</p>
                <FooterNewsletter />
              </div>
            </div>
          </div>

          {/* CORE SERVICES */}
          <div className="mt-20 pt-12 border-t border-white/10">
            <p className="text-white/80 text-center font-semibold uppercase tracking-wider mb-8">
              Our Core Services
            </p>

            <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-5xl mx-auto">
              {coreServices.map((service, i) => (
                <span
                  key={i}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-full text-white/90 transition-all duration-300 hover:scale-105"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div className="mt-20 pt-10 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-white/70 text-sm md:text-base">
              <div className="text-center md:text-left space-y-1">
                <p className="font-medium">
                  © {year} Brisk Farm Solutions & Construction Company
                </p>
                <p className="text-white/50">
                  All rights reserved • Registered in Uganda • URSB Certified
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                <a href="#" className="hover:text-white transition-all">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-all">Terms of Service</a>
                <a href="#" className="hover:text-white transition-all">Cookie Policy</a>

                <div className="flex items-center gap-2 text-white/80">
                  Made with <Heart className="w-5 h-5 text-[#f05010]" /> in Uganda
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative glow */}
        <div className="absolute inset-x-0 bottom-0 h-64 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#f05010]/10 rounded-full blur-3xl -translate-x-1/3" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#83c441]/10 rounded-full blur-3xl translate-x-1/3" />
        </div>
      </div>
    </footer>
  );
}
