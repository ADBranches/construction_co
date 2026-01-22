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
      className="relative mt-6 mx-4 md:mx-8 lg:mx-12 
                 rounded-[2.5rem] overflow-hidden bg-[#001a13]
                 pt-12 pb-14 md:pt-16 md:pb-20
                 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]"
    >
      {/* FLOATING PARTICLES */}
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

      {/* GLOW BLOBS (brand greens & orange) */}
      <motion.div
        className="absolute top-1/4 -left-20 w-80 h-80 md:w-96 md:h-96 
                   bg-[#83c441]/20 rounded-full blur-3xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 9, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-24 w-80 h-80 md:w-96 md:h-96 
                   bg-[#f05010]/20 rounded-full blur-3xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 11, repeat: Infinity }}
      />

      <div className="relative max-w-6xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* LEFT SIDE */}
          <div className="relative">
            {/* Soft gradient overlay to keep text readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-transparent rounded-3xl pointer-events-none"></div>

            {/* Badge */}
            <div className="relative z-10 inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#83c441] rounded-full animate-pulse" />
                <span className="text-[11px] sm:text-xs text-white font-semibold uppercase tracking-[0.2em]">
                  Smart Construction · Sustainable Agriculture
                </span>
              </div>
            </div>

            {/* Title (smaller but still strong) */}
            <h1 className="relative z-10 text-white drop-shadow-2xl text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 max-w-2xl">
              Building{" "}
              <span className="text-[#83c441]">Sustainable</span> Farms &{" "}
              <span className="text-[#f05010]">Modern</span> Infrastructure
            </h1>

            {/* Mission copy (your real story) */}
            <p className="relative z-10 text-base md:text-lg text-white/90 mb-7 max-w-xl leading-relaxed">
              We provide farm and construction solutions for today&apos;s and
              tomorrow&apos;s challenges — using research, innovation and
              smart technologies to turn waste into clean energy and
              bio-fertilisers, while strengthening productive livestock and
              modern infrastructure.
            </p>

            {/* Feature bullets */}
            <div className="relative z-10 grid grid-cols-2 gap-3 md:gap-4 mb-9">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-3 bg-white/15 backdrop-blur-md rounded-xl p-3.5 md:p-4 border border-white/20 shadow-inner"
                  >
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-[#003023] to-[#004633] rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 md:w-5 md:h-5 text-[#83c441]" />
                    </div>
                    <p className="text-xs md:text-sm text-white">{f.text}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA BUTTONS */}
            <div className="relative z-10 flex flex-col sm:flex-row gap-4">
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
                  className="px-7 py-3.5 
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
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 
                           bg-white text-[#003023] font-semibold text-sm md:text-base
                           rounded-xl shadow-lg hover:bg-[#f6fef9] transition-all"
              >
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-[#003023]" />
                View Services
              </a>
            </div>
          </div>

          {/* RIGHT — HOLO CARD */}
          <motion.div
            className="relative mt-10 lg:mt-0"
            onMouseMove={handleMouseMove}
            style={{ rotateX, rotateY }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
          >
            {/* Glow border */}
            <div className="absolute -inset-[3px] rounded-3xl bg-[conic-gradient(from_90deg,#83c441,#f05010,#83c441)] blur-[6px] opacity-40" />

            <motion.div
              whileHover={{ scale: 1.015 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="relative bg-white/5 backdrop-blur-xl border border-white/10 
                         rounded-3xl p-6 md:p-8
                         shadow-[0_20px_60px_-10px_rgba(0,0,0,0.45)] 
                         overflow-hidden"
            >
              {/* Gloss */}
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/20 to-transparent opacity-40 pointer-events-none" />

              {/* Sweep */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                <div
                  className="absolute left-[-50%] top-0 w-full h-full 
                             bg-gradient-to-r from-transparent via-white/10 to-transparent 
                             rotate-12 animate-[sweep_6s_linear_infinite]"
                />
              </div>

              {/* IMAGE AREA / Concept */}
              <div className="w-full h-52 md:h-64 bg-gradient-to-br from-[#003023] to-[#004633] rounded-2xl relative overflow-hidden mb-7">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-5">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#83c441] to-[#a0d64b] rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <Zap className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                      Project Showcase
                    </h3>
                    <p className="text-sm text-white/90">
                      Waste-to-energy & smart farm systems in action
                    </p>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-7">
                <div className="bg-white/10 rounded-xl p-3.5 text-center">
                  <div className="text-base md:text-lg font-bold text-white">
                    24/7
                  </div>
                  <div className="text-[11px] md:text-xs text-white/90">
                    Support
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-3.5 text-center">
                  <div className="text-base md:text-lg font-bold text-white">
                    100%
                  </div>
                  <div className="text-[11px] md:text-xs text-white/90">
                    Satisfaction
                  </div>
                </div>
              </div>

              {/* Services – aligned with your real offering */}
              <div className="space-y-2.5 text-sm md:text-base">
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

              {/* CALL NOW BUTTON (smaller, but clear) */}
              <div className="mt-7 pt-5 border-t border-white/10">
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
