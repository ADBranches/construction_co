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
  delay = 0,
  slug,
  tagline,
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Brisk Signature Color System
  const BORDER = "#83c441";   // lime green
  const ACCENT = "#83c441";   // accent lime
  const DARK = "#003023";     // deep forest green
  const CTA = "#f05010";      // brisk orange
  const LIGHT = "#f6fef9";    // subtle mint-white background

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative overflow-hidden cursor-pointer rounded-3xl bg-white shadow-md"
    >

      {/* Brisk Glow */}
      <div
        className="absolute inset-0 rounded-3xl transition-all duration-500"
        style={{
          boxShadow: isHovered
            ? `0 0 40px 5px ${ACCENT}33`
            : "0 0 0 0 transparent",
        }}
      />

      {/* Static Border */}
      <div
        className="absolute inset-0 rounded-3xl border transition-colors duration-300"
        style={{ borderColor: BORDER }}
      />

      {/* Content */}
      <div className="relative z-10 p-8 h-full">

        {/* Icon */}
        <div className="relative mb-6">
          <motion.div
            animate={{ rotate: isHovered ? [0, 10, -10, 0] : 0 }}
            transition={{ duration: 0.4 }}
            className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-md"
            style={{ background: CTA }}
          >
            {IconComponent ? (
              <IconComponent className="w-8 h-8 text-white" />
            ) : (
              <Zap className="w-8 h-8 text-white" />
            )}

            {isHovered && (
              <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-[#ffe07a] animate-ping" />
            )}
          </motion.div>
        </div>

        {/* Title */}
        <h3
          className="text-xl font-bold mb-4 transition-colors"
          style={{ color: DARK }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className="mb-3 leading-relaxed transition-colors"
          style={{ color: `${DARK}cc` }}
        >
          {description}
        </p>

        {/* Tagline */}
        {tagline && (
          <p className="text-sm font-semibold mb-4" style={{ color: ACCENT }}>
            {tagline}
          </p>
        )}

        {/* Features Reveal */}
        {features.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: isHovered ? "auto" : 0,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5" style={{ color: ACCENT }} />
                  <span className="text-sm" style={{ color: DARK }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA Button */}
        <motion.div
          animate={{
            x: isHovered ? 0 : -10,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-8 right-8"
        >
          {slug && (
            <Link
              to={`/services/${slug}`}
              className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition"
              style={{ background: LIGHT }}
            >
              <span className="text-sm font-semibold" style={{ color: DARK }}>
                Explore
              </span>
              <ArrowRight className="w-4 h-4" style={{ color: CTA }} />
            </Link>
          )}
        </motion.div>

        {/* Pulsing Dot (Brisk Signature Accent) */}
        <div className="absolute bottom-4 left-4">
          <div className="relative">
            <div
              className="w-2 h-2 rounded-full animate-ping"
              style={{ background: ACCENT }}
            />
            <div
              className="absolute inset-0 w-2 h-2 rounded-full"
              style={{ background: ACCENT }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* -----------------------------------------
   DO NOT CHANGE — your original defaults
----------------------------------------- */
ServiceCard.defaultProps = {
  icon: null,
  title: "Service Title",
  description:
    "Service description goes here. Provide comprehensive details about what this service offers.",
  features: [
    "Feature one goes here",
    "Another important feature",
    "Third feature description",
  ],
  color: "emerald",
  delay: 0,
};
