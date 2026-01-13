import { motion, useMotionValue, useTransform } from "framer-motion";
import PrimaryButton from "./ui/PrimaryButton";
import { ArrowRight, CheckCircle, Shield, Zap, Users, MapPin } from "lucide-react";
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
    <section className="relative mt-6 rounded-4xl overflow-hidden bg-[#001a13] pt-20 pb-28 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] mx-4 md:mx-8 lg:mx-12">

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

      {/* GLOW BLOBS */}
      <motion.div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#83c441]/20 rounded-full blur-3xl" animate={{ y: [0, -20, 0] }} transition={{ duration: 9, repeat: Infinity }} />
      <motion.div className="absolute bottom-1/4 -right-28 w-96 h-96 bg-[#f05010]/20 rounded-full blur-3xl" animate={{ y: [0, 20, 0] }} transition={{ duration: 11, repeat: Infinity }} />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* LEFT SIDE */}
          <div className="relative">

            {/* Soft gradient overlay to make ALL text readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent rounded-3xl pointer-events-none"></div>

            {/* Badge */}
            <div className="relative z-10 inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#83c441] rounded-full animate-pulse" />
                <span className="text-xs text-white font-semibold uppercase tracking-widest">
                  Uganda&apos;s Leading Solutions Provider
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="relative z-10 text-white drop-shadow-2xl text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-5">
              Building <span className="text-[#83c441]">Sustainable</span> Farms &{" "}
              <span className="text-[#f05010]">Modern</span> Infrastructure
            </h1>

            <p className="relative z-10 text-lg text-white mb-8 max-w-xl leading-relaxed">
              We combine engineering excellence with innovative solutions for agriculture
              and construction — delivering sustainable, modern results for every client.
            </p>

            {/* Feature bullets */}
            <div className="relative z-10 grid grid-cols-2 gap-4 mb-10">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-3 bg-white/15 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-inner"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#003023] to-[#004633] rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#83c441]" />
                    </div>
                    <p className="text-sm text-white">{f.text}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA BUTTONS */}
            <div className="relative z-10 flex flex-col sm:flex-row gap-5">

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
                  className="px-8 py-4 bg-gradient-to-r from-[#f05010] to-[#ff6b35]
                             hover:from-[#ff6b35] hover:to-[#f05010]
                             text-white text-lg font-semibold rounded-xl shadow-xl 
                             transition-all relative overflow-hidden"
                  icon={<ArrowRight className="w-5 h-5 ml-2" />}
                />
              </motion.div>

              {/* FIXED HIGH VISIBILITY BUTTON */}
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 
                           bg-white text-[#003023] font-semibold text-lg 
                           rounded-xl shadow-lg hover:bg-[#f6fef9] transition-all"
              >
                <MapPin className="w-5 h-5 text-[#003023]" />
                View Services
              </a>
            </div>
          </div>

          {/* RIGHT — HOLO CARD */}
          <motion.div
            className="relative"
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
                        rounded-3xl p-8 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.45)] 
                        overflow-hidden"
            >

              {/* Gloss */}
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/20 to-transparent opacity-40 pointer-events-none" />

              {/* Sweep */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                <div className="absolute left-[-50%] top-0 w-full h-full 
                                bg-gradient-to-r from-transparent via-white/10 to-transparent 
                                rotate-12 animate-[sweep_6s_linear_infinite]" />
              </div>

              {/* IMAGE AREA */}
              <div className="w-full h-64 bg-gradient-to-br from-[#003023] to-[#004633] rounded-2xl relative overflow-hidden mb-8">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#83c441] to-[#a0d64b] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      Project Showcase
                    </h3>
                    <p className="text-white/90">Modern farm systems in action</p>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-lg font-bold text-white">24/7</div>
                  <div className="text-xs text-white/90">Support</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-lg font-bold text-white">100%</div>
                  <div className="text-xs text-white/90">Satisfaction</div>
                </div>
              </div>

              {/* Services */}
              <div className="space-y-3">
                {[
                  "Biogas & Renewable Energy",
                  "Smart Farm Systems",
                  "Modern Construction",
                  "Livestock Solutions",
                ].map((service, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#83c441] rounded-full" />
                    <span className="text-white">{service}</span>
                  </div>
                ))}
              </div>

              {/* FIXED CALL NOW BUTTON */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <a
                  href="tel:+256783111015"
                  className="flex items-center justify-center gap-3
                             bg-white text-[#003023] font-semibold py-3 px-6 rounded-xl 
                             shadow-lg hover:bg-[#f6fef9] transition"
                >
                  Call Now: +256 783 111 015
                </a>
              </div>

            </motion.div>
          </motion.div>

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
