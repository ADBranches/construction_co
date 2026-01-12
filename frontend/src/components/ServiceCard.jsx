// src/components/ServiceCard.jsx
import { motion } from "framer-motion";
import { useState } from "react";
import { 
  ArrowRight, 
  CheckCircle,
  Zap,
  Sparkles
} from "lucide-react";

export default function ServiceCard({ 
  icon: IconComponent, 
  title, 
  description,
  features = [],
  color = "emerald",
  delay = 0 
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Color variants
  const colorVariants = {
    emerald: {
      bg: 'from-emerald-50 to-teal-50',
      hoverBg: 'hover:from-emerald-100 hover:to-teal-100',
      accent: 'text-emerald-600',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-500',
      gradient: 'from-emerald-400 to-teal-400'
    },
    orange: {
      bg: 'from-orange-50 to-amber-50',
      hoverBg: 'hover:from-orange-100 hover:to-amber-100',
      accent: 'text-orange-600',
      border: 'border-orange-200',
      iconBg: 'bg-orange-500',
      gradient: 'from-orange-400 to-amber-400'
    },
    blue: {
      bg: 'from-blue-50 to-cyan-50',
      hoverBg: 'hover:from-blue-100 hover:to-cyan-100',
      accent: 'text-blue-600',
      border: 'border-blue-200',
      iconBg: 'bg-blue-500',
      gradient: 'from-blue-400 to-cyan-400'
    },
    violet: {
      bg: 'from-violet-50 to-purple-50',
      hoverBg: 'hover:from-violet-100 hover:to-purple-100',
      accent: 'text-violet-600',
      border: 'border-violet-200',
      iconBg: 'bg-violet-500',
      gradient: 'from-violet-400 to-purple-400'
    }
  };

  const colors = colorVariants[color] || colorVariants.emerald;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        y: -8,
        transition: { type: "spring", stiffness: 300 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative overflow-hidden cursor-pointer"
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} ${colors.hoverBg} transition-all duration-500 rounded-3xl`} />
      
      {/* Animated Border */}
      <div className={`absolute inset-0 border-2 ${colors.border} rounded-3xl group-hover:border-transparent transition-colors duration-300`} />
      
      {/* Gradient Border on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-8 h-full">
        {/* Icon Section */}
        <div className="relative mb-6">
          {/* Icon Background */}
          <div className="relative">
            {/* Glow Effect */}
            <div className={`absolute inset-0 ${colors.iconBg} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
            
            {/* Icon Container */}
            <motion.div
              animate={{ rotate: isHovered ? [0, 10, -10, 0] : 0 }}
              transition={{ duration: 0.5 }}
              className={`relative w-16 h-16 ${colors.iconBg} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
            >
              {/* Icon with Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
              {IconComponent ? (
                <IconComponent className="w-8 h-8 text-white relative z-10" />
              ) : (
                <Zap className="w-8 h-8 text-white relative z-10" />
              )}
              
              {/* Sparkle Effect */}
              {isHovered && (
                <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400 animate-ping" />
              )}
            </motion.div>
          </div>
          
          {/* Floating Number */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2 }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-emerald-100 rounded-full flex items-center justify-center shadow-md"
          >
            <span className="text-xs font-bold text-emerald-600">+</span>
          </motion.div>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
          {description}
        </p>

        {/* Features List */}
        {features.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: isHovered ? 'auto' : 0,
              opacity: isHovered ? 1 : 0 
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA Button */}
        <motion.div
          animate={{ 
            x: isHovered ? 0 : -10,
            opacity: isHovered ? 1 : 0 
          }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-8 right-8"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg group-hover:shadow-xl transition-shadow duration-300">
            <span className="text-sm font-semibold text-gray-700">Explore</span>
            <ArrowRight className="w-4 h-4 text-emerald-600 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.div>

        {/* Stats/Info (Hidden by default, shows on hover) */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-6 pt-6 border-t border-gray-200"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">100%</div>
                <div className="text-xs text-gray-500">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">24/7</div>
                <div className="text-xs text-gray-500">Support</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-20 -translate-x-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Pulsing Dot */}
      <div className="absolute bottom-4 left-4">
        <div className="relative">
          <div className={`w-2 h-2 ${colors.accent} rounded-full animate-ping`} />
          <div className={`absolute inset-0 w-2 h-2 ${colors.accent} rounded-full`} />
        </div>
      </div>
    </motion.div>
  );
}

// Default props for better component usage
ServiceCard.defaultProps = {
  icon: null,
  title: "Service Title",
  description: "Service description goes here. Provide comprehensive details about what this service offers.",
  features: [
    "Feature one goes here",
    "Another important feature",
    "Third feature description"
  ],
  color: "emerald",
  delay: 0
};