// src/components/ProjectCard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight, CheckCircle } from "lucide-react";

/**
 * project is expected to come from ProjectBrief / ProjectOut:
 * {
 *   id, name, slug, status, is_featured,
 *   cover_image_url, hero_image_url, short_description, client_name,
 *   gallery_images?: string[]
 * }
 */
export default function ProjectCard({
  project = {
    slug: "",
    name: "Brisk Farm Project",
    cover_image_url: "/images/projects/biodigester-installation_01.webp",
    status: "COMPLETED",
    short_description: "",
  },
  index = 0,
}) {
  const statusRaw = project?.status || "ONGOING";
  const status =
    typeof statusRaw === "string" ? statusRaw.toUpperCase() : String(statusRaw);

  const getStatusColor = (s) => {
    switch (s) {
      case "COMPLETED":
        return "bg-emerald-500";
      case "ONGOING":
        return "bg-amber-500";
      case "PLANNED":
      case "ON_HOLD":
      default:
        return "bg-[#003023]";
    }
  };

  const getStatusLabel = (s) => {
    if (!s) return "Ongoing";
    const lower = s.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  // ✅ Build gallery from project.gallery_images (or fall back to single image)
  const fallbackImage =
    project?.cover_image_url ||
    project?.hero_image_url ||
    "/images/projects/biodigester-installation_01.webp";

  const images =
    Array.isArray(project?.gallery_images) && project.gallery_images.length > 0
      ? project.gallery_images
      : [fallbackImage];

  const name = project?.name || "Brisk Farm Project";
  const shortDescription = project?.short_description || "";
  const location = project?.location;
  const clientName = project?.client_name;

  // 🔁 Local slider state
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Autoplay: advance every 5s when not hovered and there’s more than 1 image
  useEffect(() => {
    if (images.length <= 1 || isHovered) return;

    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(id);
  }, [images.length, isHovered]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{
        y: -8,
        transition: { type: "spring", stiffness: 260, damping: 22 },
      }}
      className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient halo */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-[#83c441]/10 group-hover:via-[#f05010]/5 group-hover:to-[#003023]/10 transition-all duration-500" />

      <div className="relative z-10">
        {/* IMAGE AREA WITH CROSSFADE */}
        <div className="relative overflow-hidden rounded-t-3xl">
          <div className="relative h-56 md:h-64 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={images[activeIndex]}
                src={images[activeIndex]}
                alt={name}
                className="h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6 }}
              />
            </AnimatePresence>

            {/* Dark overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

            {/* Quick view icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/15 backdrop-blur-md rounded-full p-3 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Status badge */}
          {status && (
            <div className="absolute top-4 left-4">
              <div
                className={`flex items-center gap-2 ${getStatusColor(
                  status
                )} text-white px-3 py-1.5 rounded-full shadow-md text-xs font-semibold tracking-wide`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{getStatusLabel(status)}</span>
              </div>
            </div>
          )}

          {/* Location pill */}
          {location && (
            <div className="absolute top-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#f05010]" />
                <span className="text-xs font-medium text-[#003023]">
                  {location}
                </span>
              </div>
            </div>
          )}

          {/* Small dot indicators for gallery */}
          {images.length > 1 && (
            <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeIndex ? "w-5 bg-white" : "w-2 bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Text content */}
        <div className="p-6 md:p-7">
          <Link to={`/projects/${project.slug || ""}`} className="block">
            <h3 className="text-xl md:text-2xl font-bold text-[#003023] mb-2 group-hover:text-[#f05010] transition-colors line-clamp-2">
              {name}
            </h3>

            {shortDescription && (
              <p className="text-[#003023]/70 mb-4 line-clamp-3 leading-relaxed">
                {shortDescription}
              </p>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-[#003023]/10 mt-2">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-[#003023] group-hover:text-[#f05010] transition-colors">
                View details
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>

              {clientName && (
                <div className="text-xs md:text-sm text-[#003023]/60 text-right line-clamp-1">
                  {clientName}
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Hover border + shine */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#83c441]/40 rounded-3xl transition-colors duration-300 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 to-transparent group-hover:via-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      </div>

      {/* Ambient blobs */}
      <div className="absolute -right-10 -top-10 w-16 h-16 bg-gradient-to-br from-[#f05010]/10 to-[#83c441]/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -left-10 -bottom-10 w-20 h-20 bg-gradient-to-br from-[#003023]/10 to-[#83c441]/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150" />
    </motion.div>
  );
}
