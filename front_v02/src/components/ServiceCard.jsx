// src/components/ServiceCard.jsx
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Zap, Sparkles } from "lucide-react";

export default function ServiceCard({
  icon: IconComponent,
  title,
  description,
  features = [],
  color = "emerald",
  delay = 0,
  slug,      // /services/:slug
  tagline,   // short punchline
  imageUrl,  // NEW: hero image from backend / fallback
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Color variants
  const colorVariants = {
    emerald: {
      bg: "from-emerald-50 to-teal-50",
      hoverBg: "group-hover:from-emerald-100 group-hover:to-teal-100",
      accent: "text-emerald-600",
      border: "border-emerald-200",
      iconBg: "bg-emerald-500",
      chipBg: "bg-emerald-50",
    },
    orange: {
      bg: "from-orange-50 to-amber-50",
      hoverBg: "group-hover:from-orange-100 group-hover:to-amber-100",
      accent: "text-orange-600",
      border: "border-orange-200",
      iconBg: "bg-orange-500",
      chipBg: "bg-orange-50",
    },
    blue: {
      bg: "from-sky-50 to-cyan-50",
      hoverBg: "group-hover:from-sky-100 group-hover:to-cyan-100",
      accent: "text-sky-600",
      border: "border-sky-200",
      iconBg: "bg-sky-500",
      chipBg: "bg-sky-50",
    },
  };

  const variant = colorVariants[color] || colorVariants.emerald;

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -8 }}
      className="group relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/services/${slug}`} className="block h-full">
        <div
          className={[
            "relative flex h-full flex-col overflow-hidden rounded-3xl border bg-gradient-to-br shadow-sm transition-shadow",
            variant.bg,
            variant.border,
            "hover:shadow-xl hover:shadow-black/5",
          ].join(" ")}
        >
          {/* Top image / hero */}
          {imageUrl && (
            <div className="relative h-52 w-full overflow-hidden rounded-3xl">
              <img
                src={imageUrl}
                alt={title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Soft gradient overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
              {/* Tagline overlay */}
              {tagline && (
                <div className="pointer-events-none absolute bottom-3 left-4 right-4">
                  <p className="text-xs font-semibold text-white drop-shadow-sm line-clamp-2">
                    {tagline}
                  </p>
                </div>
              )}
              {/* Floating icon chip */}
              {IconComponent && (
                <div className="absolute left-4 top-4 flex items-center gap-2">
                  <div
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-2xl shadow-md shadow-black/10",
                      variant.iconBg,
                    ].join(" ")}
                  >
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="relative flex flex-1 flex-col gap-4 p-6">
            {/* Shine / glow */}
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0" />
            </div>

            {/* Title */}
            <div className="relative">
              <h3 className="text-lg font-bold text-[#003023] group-hover:text-[#f05010] transition-colors line-clamp-2">
                {title}
              </h3>
              {tagline && !imageUrl && (
                <p className="mt-1 text-xs font-medium text-[#003023]/70 line-clamp-2">
                  {tagline}
                </p>
              )}
            </div>

            {/* Description */}
            {description && (
              <p className="relative text-xs leading-relaxed text-[#003023]/75 line-clamp-3">
                {description}
              </p>
            )}

            {/* Features / bullets */}
            {features && features.length > 0 && (
              <ul className="relative space-y-1.5 text-xs text-[#003023]/80">
                {features.slice(0, 3).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="mt-[2px] h-3.5 w-3.5 text-[#83c441]" />
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Footer line */}
            <div className="relative mt-auto pt-4 flex items-center justify-between border-t border-black/5">
              <button
                type="button"
                className={[
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase",
                  "bg-white/90 text-[#003023] shadow-sm",
                  "group-hover:bg-[#f05010] group-hover:text-white transition-colors",
                ].join(" ")}
              >
                <span>Explore service</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>

              <div
                className={[
                  "flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium",
                  variant.chipBg,
                  variant.accent,
                  "border-black/5",
                ].join(" ")}
              >
                <Sparkles className="h-3 w-3" />
                <span>{isHovered ? "See details" : "Brisk standard"}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
