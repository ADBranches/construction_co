// src/components/Hero.jsx
import PrimaryButton from "./ui/PrimaryButton";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      className="relative -mx-4 mb-8 bg-[var(--brand-green)]"
      style={{ backgroundImage: "url('/brand/hero.jpg')" }}
    >
      {/* stretch to edges of viewport */}
      <div className="container py-10 md:py-14 relative">
        {/* dark overlay behind content */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/60 to-black/10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-2xl"
        >
          <p className="mb-3 inline-block rounded-full bg-[var(--brand-yellow)]/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-yellow)]">
            Uganda · Farm & Construction Solutions
          </p>

          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
            Brisk Farm Solutions &amp;{" "}
            <span className="text-[var(--brand-yellow)]">Construction Company</span>
          </h1>

          <p className="mt-4 text-sm text-gray-100 md:text-base">
            Smart construction. Sustainable agriculture. From biogas and livestock
            housing to crop production and civil works, we build integrated
            agro-systems for farms, homes, and institutions.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <PrimaryButton text="Request a Quote" href="/quote" />
            <a
              href="#services"
              className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-100 hover:text-[var(--brand-yellow)]"
            >
              View Completed Projects
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
