// src/pages/ProjectDetail.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import ProjectsStore from "../lib/projectsStore";

// -------------------------------
// ANIMATION PRESETS
// -------------------------------
const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerList = {
  animate: {
    transition: { staggerChildren: 0.15 },
  },
};

export default function ProjectDetail() {
  const { slug } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);

  // -----------------------------
  // LOAD PROJECT
  // -----------------------------
  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setError(false);

    try {
      const found = ProjectsStore.getBySlug(slug);
      if (!mounted) return;

      if (!found) {
        setProject(null);
        setError(true);
      } else {
        setProject(found);
      }
    } catch {
      if (!mounted) return;
      setProject(null);
      setError(true);
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }

    return () => {
      mounted = false;
    };
  }, [slug]);

  // -----------------------------
  // BUILD IMAGES (HOOK-SAFE)
  // -----------------------------
  const baseImage =
    project?.hero_image_url ||
    project?.cover_image_url ||
    (Array.isArray(project?.media_items) && project.media_items.length > 0
      ? project.media_items[0].url
      : null) ||
    "/images/projects/biodigester-installation_01.webp";

  const frames =
    Array.isArray(project?.gallery_images) && project.gallery_images.length > 0
      ? project.gallery_images
      : [baseImage];

  const currentSrc =
    frames[Math.min(frameIndex, frames.length - 1)] || baseImage;

  // -----------------------------
  // AUTO-ROTATE FRAMES
  // -----------------------------
  useEffect(() => {
    if (frames.length <= 1) return;

    const id = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, 4500);

    return () => clearInterval(id);
  }, [frames]);

  // -----------------------------
  // LOADING SCREEN
  // -----------------------------
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f6fef9]">
        <p className="text-[#003023]/70 text-sm">Loading project…</p>
      </main>
    );
  }

  // -----------------------------
  // NOT FOUND SCREEN
  // -----------------------------
  if (error || !project) {
    return (
      <main className="bg-[#f6fef9] min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h1 className="text-2xl font-bold text-[#003023] mb-4">
            Project not found
          </h1>

          <p className="text-sm text-[#003023]/70 mb-6">
            The requested project does not exist. Please return to all projects.
          </p>

          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f05010] text-white text-sm font-semibold hover:bg-[#d9460c] transition"
          >
            View All Projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  // -----------------------------
  // MAIN PAGE CONTENT (ANIMATED)
  // -----------------------------
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
            {/* LEFT SIDE — TEXT      */}
            {/* ---------------------- */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerList}
            >
              <motion.p
                {...fadeInUp}
                className="text-xs font-semibold tracking-[0.24em] text-[#83c441] uppercase mb-3"
              >
                Brisk Farm Projects
              </motion.p>

              <motion.h1
                {...fadeInUp}
                className="text-3xl md:text-4xl font-bold leading-tight mb-4"
              >
                {project.name}
              </motion.h1>

              {/* Status Badge */}
              <motion.div
                {...fadeInUp}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs font-semibold uppercase tracking-[0.16em] mb-5"
              >
                <span
                  className={
                    project.status === "COMPLETED"
                      ? "w-2 h-2 rounded-full bg-emerald-400"
                      : project.status === "ONGOING"
                      ? "w-2 h-2 rounded-full bg-amber-400"
                      : "w-2 h-2 rounded-full bg-slate-400"
                  }
                />
                {project.status}
              </motion.div>

              {project.short_description && (
                <motion.p
                  {...fadeInUp}
                  className="text-white/80 text-sm md:text-base mb-6"
                >
                  {project.short_description}
                </motion.p>
              )}

              {project.description && (
                <motion.p
                  {...fadeInUp}
                  className="text-white/70 text-sm md:text-base mb-8"
                >
                  {project.description}
                </motion.p>
              )}

              {/* CTA BUTTONS */}
              <motion.div {...fadeInUp} className="flex flex-wrap gap-3">
                <Link
                  to="/quote"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#f05010] text-white text-sm font-semibold shadow-md hover:bg-[#d9460c] transition-transform hover:scale-[1.02]"
                >
                  Start a similar project
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 text-sm font-semibold text-white/90 hover:bg-white/5 transition-transform hover:scale-[1.02]"
                >
                  Back to all projects
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
                  alt={project.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  whileHover={{ scale: 1.05 }}
                />
              </div>

              {/* Animated dots */}
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
