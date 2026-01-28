// src/components/Hero.jsx
import { motion, useMotionValue, useTransform } from "framer-motion";
import PrimaryButton from "./ui/PrimaryButton";
import {
  ArrowRight,
  CheckCircle,
  Shield,
  Zap,
  Users,
  MapPin,
} from "lucide-react";
import { useState } from "react";

/* ---------------------------------------------------------
   FIXED: React Purity Rule — Generate particles OUTSIDE 
   the component so Math.random() NEVER runs during render.
---------------------------------------------------------- */
const PARTICLE_POSITIONS = Array.from({ length: 18 }, () => ({
  x: Math.random() * 1400,
  y: Math.random() * 800,
}));

export default function Hero() {
  // Magnetic CTA Button Motion
  const [hovering, setHovering] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // 3D Parallax Card Motion
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-40, 40], [8, -8]);
  const rotateY = useTransform(x, [-40, 40], [-8, 8]);

  const features = [
    { icon: CheckCircle, text: "Certified Engineering Team" },
    { icon: Shield, text: "Quality Guaranteed" },
    { icon: Zap, text: "Sustainable Solutions" },
    { icon: Users, text: "Client-Focused Approach" },
  ];

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleCTA = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left - rect.width / 2);
    my.set(e.clientY - rect.top - rect.height / 2);
  };

  const particlePositions = PARTICLE_POSITIONS;

  return (
    <section
      className="relative mt-4 md:mt-6 mx-4 md:mx-8 lg:mx-12 
                 rounded-[2.2rem] overflow-hidden bg-[#001a13]
                 pt-8 pb-10 md:pt-12 md:pb-16
                 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]"
    >
      {/* FLOATING PARTICLES – DESKTOP ONLY TO KEEP MOBILE LIGHT */}
      <div className="hidden lg:block">
        {particlePositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            initial={{ opacity: 0.2, x: pos.x, y: pos.y }}
            animate={{ y: ["0%", "100%", "0%"], opacity: [0.2, 0.6, 0.2] }}
            transition={{
              duration: 20 + Math.random() * 20,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* GLOW BLOBS (brand greens & orange) – HIDDEN ON VERY SMALL SCREENS */}
      <motion.div
        className="hidden sm:block absolute top-1/4 -left-20 w-80 h-80 md:w-96 md:h-96 
                   bg-[#83c441]/20 rounded-full blur-3xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 9, repeat: Infinity }}
      />
      <motion.div
        className="hidden sm:block absolute bottom-1/4 -right-24 w-80 h-80 md:w-96 md:h-96 
                   bg-[#f05010]/20 rounded-full blur-3xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 11, repeat: Infinity }}
      />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          {/* LEFT SIDE */}
          <div className="relative">
            {/* Soft gradient overlay to keep text readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-transparent rounded-3xl pointer-events-none" />

            {/* Badge */}
            <div className="relative z-10 inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#83c441] rounded-full animate-pulse" />
                <span className="text-[10px] sm:text-[11px] md:text-xs text-white font-semibold uppercase tracking-[0.18em]">
                  Smart Construction · Sustainable Agriculture
                </span>
              </div>
            </div>

            {/* Title – slightly smaller for better hierarchy */}
            <h1 className="relative z-10 text-white drop-shadow-2xl text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-3 max-w-2xl">
              Building{" "}
              <span className="text-[#83c441]">Sustainable</span> Farms &{" "}
              <span className="text-[#f05010]">Modern</span> Infrastructure
            </h1>

            {/* Mission copy (tightened) */}
            <p className="relative z-10 text-sm md:text-base text-white/90 mb-6 max-w-xl leading-relaxed">
              We provide farm and construction solutions for today&apos;s and
              tomorrow&apos;s challenges — using research, innovation and smart
              technologies to turn waste into clean energy and bio-fertilisers,
              while strengthening productive livestock and modern infrastructure.
            </p>

            {/* Feature bullets – compact, but still 4 items */}
            <div className="relative z-10 grid grid-cols-2 gap-3 md:gap-4 mb-7">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    className="flex items-center gap-3 bg-white/15 backdrop-blur-md rounded-xl p-3 md:p-3.5 border border-white/20 shadow-inner"
                  >
                    <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-[#003023] to-[#004633] rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#83c441]" />
                    </div>
                    <p className="text-[11px] sm:text-xs md:text-sm text-white">
                      {f.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA BUTTONS – 1 strong, 1 subtle. Call CTA moved to card/desktop */}
            <div className="relative z-10 flex flex-col sm:flex-row gap-3">
              {/* Primary CTA (magnetic) */}
              <motion.div
                onMouseMove={handleCTA}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => {
                  setHovering(false);
                  mx.set(0);
                  my.set(0);
                }}
                style={{ x: hovering ? mx : 0, y: hovering ? my : 0 }}
                transition={{ type: "spring", stiffness: 150, damping: 12 }}
              >
                <PrimaryButton
                  text="Start Your Project"
                  href="/quote"
                  className="px-7 py-3 
                             bg-gradient-to-r from-[#f05010] to-[#ff6b35]
                             hover:from-[#ff6b35] hover:to-[#f05010]
                             text-white text-sm md:text-base font-semibold 
                             rounded-xl shadow-xl transition-all 
                             relative overflow-hidden"
                  icon={<ArrowRight className="w-4 h-4 ml-2" />}
                />
              </motion.div>

              {/* Secondary CTA */}
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 
                           bg-white text-[#003023] font-semibold text-sm md:text-base
                           rounded-xl shadow-md hover:bg-[#f6fef9] transition-all"
              >
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-[#003023]" />
                View Services
              </a>
            </div>

            {/* Optional subtle call text on mobile could go here later if needed */}
          </div>

          {/* RIGHT — HOLO CARD */}
          <motion.div
            className="relative mt-8 lg:mt-0"
            onMouseMove={handleMouseMove}
            style={{ rotateX, rotateY }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
          >
            {/* Glow border – desktop focus, still okay on mobile */}
            <div className="absolute -inset-[3px] rounded-3xl bg-[conic-gradient(from_90deg,#83c441,#f05010,#83c441)] blur-[6px] opacity-40" />

            <motion.div
              whileHover={{ scale: 1.015 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="relative bg-white/5 backdrop-blur-xl border border-white/10 
                         rounded-3xl p-5 sm:p-6 md:p-8
                         shadow-[0_20px_60px_-10px_rgba(0,0,0,0.45)] 
                         overflow-hidden"
            >
              {/* Gloss */}
              <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-white/20 to-transparent opacity-40 pointer-events-none" />

              {/* Sweep */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                <div
                  className="absolute left-[-50%] top-0 w-full h-full 
                             bg-gradient-to-r from-transparent via-white/10 to-transparent 
                             rotate-12 animate-[sweep_6s_linear_infinite]"
                />
              </div>

              {/* IMAGE AREA / Concept */}
              <div className="w-full h-40 sm:h-48 md:h-56 bg-gradient-to-br from-[#003023] to-[#004633] rounded-2xl relative overflow-hidden mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#83c441] to-[#a0d64b] rounded-full flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1">
                      Project Showcase
                    </h3>
                    <p className="text-xs sm:text-sm text-white/90">
                      Waste-to-energy & smart farm systems in action
                    </p>
                  </div>
                </div>
              </div>

              {/* Highlights – DESKTOP/TABLET ONLY to keep mobile lean */}
              <div className="hidden md:grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 rounded-xl p-3.5 text-center">
                  <div className="text-lg font-bold text-white">24/7</div>
                  <div className="text-xs text-white/90">Support</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3.5 text-center">
                  <div className="text-lg font-bold text-white">100%</div>
                  <div className="text-xs text-white/90">Satisfaction</div>
                </div>
              </div>

              {/* Compact stats block for mobile */}
              <div className="grid grid-cols-2 gap-3 mb-5 md:hidden">
                <div className="bg-white/10 rounded-lg p-2.5 text-center">
                  <div className="text-sm font-semibold text-white">24/7</div>
                  <div className="text-[10px] text-white/85">Support</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2.5 text-center">
                  <div className="text-sm font-semibold text-white">100%</div>
                  <div className="text-[10px] text-white/85">Satisfaction</div>
                </div>
              </div>

              {/* Services – short on mobile, full list on desktop */}
              <div className="space-y-2.5 text-xs sm:text-sm md:text-base">
                {/* MOBILE/TABLET: trimmed list (3 bullets) */}
                <div className="md:hidden space-y-2.5">
                  {[
                    "Animal production consultancy",
                    "Farm & household waste management",
                    "Biodigester & biogas system installation",
                  ].map((service, index) => (
                    <div key={index} className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 bg-[#83c441] rounded-full" />
                      <span className="text-white/90">{service}</span>
                    </div>
                  ))}
                </div>

                {/* DESKTOP: full 6-item list */}
                <div className="hidden md:block space-y-2.5">
                  {[
                    "Animal production consultancy",
                    "Farm & household waste management",
                    "Biodigester installation (fixed dome & prefabricated)",
                    "Supply of biogas appliances & energy systems",
                    "Capacity building in livestock & biodigester management",
                    "Pasture establishment & management",
                  ].map((service, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#83c441] rounded-full" />
                      <span className="text-white/90">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CALL NOW BUTTON – DESKTOP/MD+ ONLY TO REDUCE CTA NOISE ON MOBILE */}
              <div className="hidden md:block mt-7 pt-5 border-t border-white/10">
                <a
                  href="tel:+256783111015"
                  className="flex items-center justify-center gap-2.5
                             bg-white text-[#003023] font-semibold 
                             py-3 px-5 rounded-xl 
                             text-sm md:text-base
                             shadow-lg hover:bg-[#f6fef9] transition"
                >
                  Call Now: +256 783 111 015
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Sweep keyframes */}
          <style>{`
            @keyframes sweep {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(200%); }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
