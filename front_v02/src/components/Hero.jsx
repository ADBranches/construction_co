// src/components/Hero.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Leaf,
  Recycle,
  Hammer,
  Droplets,
  Sprout,
} from "lucide-react";

/**
 * Slides: video + multiple images from /public/images/projects + /public/videos
 */
const SLIDES = [
  {
    id: "biogas-motion",
    label: "BIOGAS IN MOTION",
    title: "Clean cooking from farm waste",
    description:
      "Live biogas flame powered by organised farm waste — turning manure into reliable energy.",
    mediaType: "video",
    src: "/videos/brisk_video.mp4",
    icon: Flame,
    captionPosition: "bottom-left",
    width: "wide",
  },
  {
    id: "biodigester-close",
    label: "BIODIGESTER INSTALLATION",
    title: "Chambers built for the long term",
    description:
      "Fixed-dome biodigesters cast and cured to withstand pressure, moisture and many years of use.",
    mediaType: "image",
    src: "/images/projects/biodigester-installation_02.webp",
    icon: Leaf,
    captionPosition: "bottom-right",
    width: "compact",
  },
  {
    id: "biodigester-overview",
    label: "BIOGAS SYSTEMS",
    title: "From inlet to clean gas",
    description:
      "Well-planned piping, meters and valves that move biogas safely from digester to points of use.",
    mediaType: "image",
    src: "/images/projects/biodigester-installation_03.webp",
    icon: Flame,
    captionPosition: "top-left",
    width: "compact",
  },
  {
    id: "waste-floor",
    label: "WASTE MANAGEMENT",
    title: "Organised waste, cleaner floors",
    description:
      "Structured housing and waste channels that keep barns clean and prepare feedstock for digesters.",
    mediaType: "image",
    src: "/images/projects/farm-and-household-waste-management_01.webp",
    icon: Recycle,
    captionPosition: "bottom-left",
    width: "wide",
  },
  {
    id: "waste-pits",
    label: "WASTE MANAGEMENT",
    title: "From waste pits to resources",
    description:
      "Collection points and settlement pits that turn everyday waste into usable slurry and compost.",
    mediaType: "image",
    src: "/images/projects/farm-and-household-waste-management_02.webp",
    icon: Recycle,
    captionPosition: "top-right",
    width: "compact",
  },
  {
    id: "waste-lanes",
    label: "WASTE MANAGEMENT",
    title: "Clean lanes, healthy animals",
    description:
      "Designed circulation paths that separate animals, slurry and people for safer farm operations.",
    mediaType: "image",
    src: "/images/projects/farm-and-household-waste-management_03.webp",
    icon: Recycle,
    captionPosition: "bottom-right",
    width: "compact",
  },
  {
    id: "capacity-training",
    label: "CAPACITY BUILDING",
    title: "Hands-on training with farmers",
    description:
      "Demonstrations and coaching that help farmers and technicians run systems confidently every day.",
    mediaType: "image",
    src: "/images/projects/capacity-building_01.webp",
    icon: Sprout,
    captionPosition: "top-left",
    width: "wide",
  },
  {
    id: "capacity-team",
    label: "CAPACITY BUILDING",
    title: "Engineers in the field",
    description:
      "Site visits and troubleshooting sessions that keep systems performing after installation.",
    mediaType: "image",
    src: "/images/projects/capacity-building_02.webp",
    icon: Sprout,
    captionPosition: "bottom-left",
    width: "compact",
  },
  {
    id: "pasture-fields",
    label: "PASTURE SYSTEMS",
    title: "Pasture blocks under design",
    description:
      "Zoned grazing areas that balance fodder growth, animal movement and soil protection.",
    mediaType: "image",
    src: "/images/projects/pasture-establishment_01.webp",
    icon: Droplets,
    captionPosition: "top-right",
    width: "compact",
  },
  {
    id: "pasture-close",
    label: "PASTURE SYSTEMS",
    title: "Ground cover that feeds herds",
    description:
      "Carefully selected grasses and legumes that keep animals fed through changing seasons.",
    mediaType: "image",
    src: "/images/projects/pasture-establishment_02.webp",
    icon: Droplets,
    captionPosition: "bottom-left",
    width: "compact",
  },
  {
    id: "construction-yard",
    label: "CONSTRUCTION WORKS",
    title: "Structures built for hard work",
    description:
      "Farm buildings and service areas cast to handle heavy use, moisture and equipment loads.",
    mediaType: "image",
    src: "/images/projects/farm-construction_02.webp",
    icon: Hammer,
    captionPosition: "bottom-right",
    width: "wide",
  },
  {
    id: "construction-frames",
    label: "CONSTRUCTION WORKS",
    title: "Frames that define the site",
    description:
      "Structural elements aligned with farm flow, drainage and biosecurity requirements.",
    mediaType: "image",
    src: "/images/projects/farm-construction_03.webp",
    icon: Hammer,
    captionPosition: "top-left",
    width: "compact",
  },
  {
    id: "biogas-appliances-1",
    label: "BIOGAS APPLIANCES",
    title: "Biogas stoves ready for service",
    description:
      "Correctly matched burners and lines that turn raw biogas into steady kitchen flame.",
    mediaType: "image",
    src: "/images/projects/biogas-appliances-supply_01.webp",
    icon: Flame,
    captionPosition: "bottom-left",
    width: "compact",
  },
  {
    id: "biogas-appliances-2",
    label: "BIOGAS APPLIANCES",
    title: "Multiple points, one digester",
    description:
      "Distribution setups that safely feed several stoves and appliances from one biogas source.",
    mediaType: "image",
    src: "/images/projects/biogas-appliances-supply_02.webp",
    icon: Flame,
    captionPosition: "bottom-right",
    width: "compact",
  },
  {
    id: "biogas-appliances-3",
    label: "BIOGAS APPLIANCES",
    title: "Flame quality under control",
    description:
      "Pressure, air mix and burner design tuned to keep blue, efficient flame every day.",
    mediaType: "image",
    src: "/images/projects/biogas-appliances-supply_03.webp",
    icon: Flame,
    captionPosition: "top-right",
    width: "compact",
  },
];

const AUTO_ADVANCE_MS = 8000;

const CAPTION_POSITION_CLASSES = {
  "bottom-left":
    "left-4 sm:left-8 bottom-4 sm:bottom-8 items-start text-left",
  "bottom-right":
    "right-4 sm:right-8 bottom-4 sm:bottom-8 items-end text-right",
  "top-left": "left-4 sm:left-8 top-4 sm:top-8 items-start text-left",
  "top-right": "right-4 sm:right-8 top-4 sm:top-8 items-end text-right",
};

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-play carousel
  useEffect(() => {
    const id = setInterval(
      () => setActiveIndex((prev) => (prev + 1) % SLIDES.length),
      AUTO_ADVANCE_MS
    );
    return () => clearInterval(id);
  }, []);

  const activeSlide = SLIDES[activeIndex];
  const ActiveIcon = activeSlide.icon;

  const captionPosClass =
    CAPTION_POSITION_CLASSES[activeSlide.captionPosition] ||
    CAPTION_POSITION_CLASSES["bottom-left"];

  // Mobile-first width: narrow on phones, wider on larger screens
  const captionWidthClass =
    activeSlide.width === "wide"
      ? "w-[88%] max-w-xs sm:max-w-md md:max-w-2xl"
      : "w-[88%] max-w-xs sm:max-w-sm md:max-w-md";

  const handleDotClick = (index) => setActiveIndex(index);

  return (
    <section className="relative mt-3 md:mt-6 mx-3 md:mx-8 lg:mx-12">
      {/* Outer green shell */}
      <div className="relative rounded-[2.1rem] md:rounded-[2.4rem] bg-[#001a13] py-4 md:py-7 lg:py-9 shadow-[0_18px_60px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Background gradients – keep them off on the tiniest screens */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#003023] via-[#001a13] to-[#f05010]/45 opacity-90" />
        <div className="pointer-events-none hidden sm:block absolute -left-24 top-8 w-80 h-80 rounded-full bg-[#83c441]/20 blur-3xl" />
        <div className="pointer-events-none hidden sm:block absolute -right-28 bottom-0 w-80 h-80 rounded-full bg-[#f05010]/22 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-3 sm:px-5 lg:px-10">
          {/* BIG inner media card */}
          <motion.div
            className="relative rounded-[1.6rem] md:rounded-[1.9rem] bg-black/55 border border-white/10 overflow-hidden shadow-[0_22px_70px_rgba(0,0,0,0.85)]"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
          >
            {/* Media canvas */}
            <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] bg-black">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0.1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {activeSlide.mediaType === "video" ? (
                    <video
                      key={activeSlide.src}
                      src={activeSlide.src}
                      className="h-full w-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={activeSlide.src}
                      alt={activeSlide.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  )}

                  {/* Gradient overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Caption card – moves based on slide position */}
              <div
                className={[
                  "absolute flex",
                  captionPosClass,
                  "px-2 sm:px-0",
                ].join(" ")}
              >
                <motion.div
                  key={activeSlide.id + "-caption"}
                  initial={{
                    opacity: 0,
                    y:
                      activeSlide.captionPosition?.startsWith("top")
                        ? -18
                        : 18,
                    x:
                      activeSlide.captionPosition?.endsWith("right")
                        ? 12
                        : -12,
                  }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.6 }}
                  className={[
                    "rounded-2xl sm:rounded-3xl bg-black/55 backdrop-blur-xl border border-white/15 px-4 py-3 sm:px-6 sm:py-4 shadow-[0_18px_45px_rgba(0,0,0,0.7)]",
                    captionWidthClass,
                    activeSlide.captionPosition?.endsWith("right")
                      ? "text-right"
                      : "text-left",
                  ].join(" ")}
                >
                  <p className="flex items-center gap-2 text-[0.7rem] sm:text-xs tracking-[0.24em] text-white/65 uppercase mb-1.5">
                    {ActiveIcon && (
                      <ActiveIcon className="w-3 h-3 text-[#83c441]" />
                    )}
                    <span>{activeSlide.label}</span>
                  </p>
                  <h1 className="text-white text-base sm:text-xl md:text-2xl font-semibold mb-1.5 sm:mb-2.5 leading-snug">
                    {activeSlide.title}
                  </h1>
                  <p className="text-[0.72rem] sm:text-sm text-white/85 leading-relaxed">
                    {activeSlide.description}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Bottom controls – logo + dots only */}
            <div className="relative flex items-center px-4 sm:px-6 py-2.5 sm:py-3.5 bg-black/70 border-t border-white/10 gap-3 sm:gap-4">
              {/* Real logo */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white flex items-center justify-center shadow-lg shadow-black/40 overflow-hidden">
                  <img
                    src="/brisk_logo.png"
                    alt="Brisk Farm logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Progress dots (scrollable on mobile) */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                {SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => handleDotClick(idx)}
                    className={`h-1.5 rounded-full flex-shrink-0 transition-all ${
                      idx === activeIndex
                        ? "w-5 bg-white"
                        : "w-2 bg-white/35 hover:bg-white/60"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
