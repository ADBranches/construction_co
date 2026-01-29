// src/pages/ServiceDetail.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import ServicesStore from "../lib/servicesStore";

// -------------------------------
// ANIMATION PRESETS
// -------------------------------
const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerList = {
  animate: {
    transition: { staggerChildren: 0.15 },
  },
};

const listItem = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

export default function ServiceDetail() {
  const { slug } = useParams();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);

  // ---------------------------------
  // LOAD SERVICE FROM STORE
  // ---------------------------------
  useEffect(() => {
    setLoading(true);
    setError(false);

    try {
      const found = ServicesStore.getBySlug(slug);

      if (!found) {
        setService(null);
        setError(true);
      } else {
        setService(found);
      }
    } catch {
      setService(null);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // ---------------------------------
  // IMAGE & GALLERY SETUP (HOOK SAFE)
  // ---------------------------------
  const heroImage = service?.hero_image_url
    ? service.hero_image_url.startsWith("/")
      ? service.hero_image_url
      : "/" + service.hero_image_url
    : "/images/services/biodigester-installation_02-hero.webp";

  const frames =
    Array.isArray(service?.gallery_images) && service.gallery_images.length > 0
      ? service.gallery_images
      : [heroImage];

  const currentSrc = frames[Math.min(frameIndex, frames.length - 1)] || heroImage;

  // Auto-rotate gallery frames (SAFE)
  useEffect(() => {
    if (frames.length <= 1) return;

    const id = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, 4500);

    return () => clearInterval(id);
  }, [frames]);

  // ---------------------------------
  // LOADING UI
  // ---------------------------------
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f6fef9]">
        <p className="text-[#003023]/70 text-sm">Loading service…</p>
      </main>
    );
  }

  // ---------------------------------
  // NOT FOUND UI
  // ---------------------------------
  if (error || !service) {
    return (
      <main className="bg-[#f6fef9] min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h1 className="text-2xl font-bold text-[#003023] mb-4">
            Service not found
          </h1>

          <p className="text-sm text-[#003023]/70 mb-6">
            The requested service does not exist. Please return to all services.
          </p>

          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f05010] text-white text-sm font-semibold hover:bg-[#d9460c] transition"
          >
            View All Services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  // ---------------------------------
  // MAIN RENDER
  // ---------------------------------
  return (
    <motion.main
      className="bg-[#f6fef9] min-h-screen"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <section className="relative py-10">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 items-center rounded-3xl bg-[#001a13] text-white px-6 py-10 lg:px-10 lg:py-12 shadow-[0_24px_80px_rgba(0,0,0,0.45)] overflow-hidden">

            {/* ---------------------- */}
            {/* LEFT — TEXT BLOCK     */}
            {/* ---------------------- */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerList}
            >
              <motion.p {...fadeInUp} className="text-xs font-semibold tracking-[0.24em] text-[#83c441] uppercase mb-3">
                Brisk Farm Services
              </motion.p>

              <motion.h1 {...fadeInUp} className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                {service.name}
              </motion.h1>

              <motion.p {...fadeInUp} className="text-white/80 text-sm md:text-base mb-6">
                {service.short_description}
              </motion.p>

              <motion.p {...fadeInUp} className="text-[#83c441] font-semibold text-sm md:text-base mb-6">
                {service.tagline}
              </motion.p>

              {/* animated bullet list */}
              <motion.ul
                variants={staggerList}
                initial="initial"
                animate="animate"
                className="space-y-2.5 text-sm text-white/85 mb-8"
              >
                {[service.highlight_1, service.highlight_2, service.highlight_3]
                  .filter(Boolean)
                  .map((item, index) => (
                    <motion.li
                      key={index}
                      variants={listItem}
                      className="flex gap-2"
                    >
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#83c441]" />
                      {item}
                    </motion.li>
                  ))}
              </motion.ul>

              {/* CTA buttons */}
              <motion.div {...fadeInUp} className="flex flex-wrap gap-3">
                <Link
                  to="/quote"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#f05010] text-white text-sm font-semibold shadow-md hover:bg-[#d9460c] transition-transform hover:scale-[1.02]"
                >
                  Request a project quote
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 text-sm font-semibold text-white/90 hover:bg-white/5 transition-transform hover:scale-[1.02]"
                >
                  Talk to an engineer
                </Link>
              </motion.div>
            </motion.div>

            {/* ---------------------- */}
            {/* RIGHT — IMAGE GALLERY */}
            {/* ---------------------- */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-[#002018]">
                <motion.img
                  key={currentSrc}
                  src={currentSrc}
                  alt={service.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  whileHover={{ scale: 1.05 }}
                />
              </div>

              {frames.length > 1 && (
                <div className="absolute bottom-4 right-6 flex gap-1">
                  {frames.map((_, i) => (
                    <motion.span
                      key={i}
                      layout
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className={[
                        "h-1.5 w-1.5 rounded-full bg-white/40",
                        i === frameIndex && "w-3 bg-white",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </motion.main>
  );
}
