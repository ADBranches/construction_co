// src/components/ProjectCard.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Calendar, 
  Users, 
  ArrowRight, 
  Zap,
  Building,
  CheckCircle
} from "lucide-react";

export default function ProjectCard({ project, index }) {
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'bg-emerald-500';
      case 'ongoing': return 'bg-amber-500';
      case 'upcoming': return 'bg-blue-500';
      default: return 'bg-[#003023]';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'ongoing': return <Zap className="w-4 h-4" />;
      default: return <Building className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ 
        y: -8,
        transition: { type: "spring", stiffness: 300 }
      }}
      className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-[#f05010]/5 group-hover:via-[#83c441]/5 group-hover:to-[#003023]/5 transition-all duration-500" />
      
      <div className="relative z-10">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-t-3xl">
          <div className="relative h-64 md:h-72 overflow-hidden">
            <img
              src={project.thumbnail || "/placeholder.jpg"}
              alt={project.title}
              className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Quick View Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Status Badge */}
          {project.status && (
            <div className="absolute top-4 left-4">
              <div className={`flex items-center gap-2 ${getStatusColor(project.status)} text-white px-4 py-2 rounded-full shadow-lg`}>
                {getStatusIcon(project.status)}
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {project.status}
                </span>
              </div>
            </div>
          )}

          {/* Project Type */}
          {project.type && (
            <div className="absolute top-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                <span className="text-xs font-semibold text-[#003023] uppercase tracking-wider">
                  {project.type}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <Link to={`/projects/${project.slug}`} className="block">
            {/* Title */}
            <h3 className="text-xl md:text-2xl font-bold text-[#003023] mb-3 group-hover:text-[#f05010] transition-colors duration-300 line-clamp-1">
              {project.title}
            </h3>

            {/* Summary */}
            {project.summary && (
              <p className="text-[#003023]/70 mb-4 line-clamp-2 leading-relaxed">
                {project.summary}
              </p>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {project.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#f05010]" />
                  <span className="text-sm text-[#003023]/80 font-medium">
                    {project.location}
                  </span>
                </div>
              )}
              
              {project.duration && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#83c441]" />
                  <span className="text-sm text-[#003023]/80">
                    {project.duration}
                  </span>
                </div>
              )}
              
              {project.client && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#003023]" />
                  <span className="text-sm text-[#003023]/80">
                    {project.client}
                  </span>
                </div>
              )}
            </div>

            {/* Tech Stack / Features */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 bg-[#f6fef9] text-[#003023] rounded-full text-xs font-medium border border-[#83c441]/20"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-3 py-1.5 bg-[#003023]/5 text-[#003023]/60 rounded-full text-xs">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="flex items-center justify-between pt-4 border-t border-[#003023]/10">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#003023] group-hover:text-[#f05010] transition-colors">
                View Details
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
              
              {project.size && (
                <div className="text-sm text-[#003023]/60 font-medium">
                  {project.size}
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Hover Effects */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#83c441]/30 rounded-3xl transition-colors duration-300 pointer-events-none" />
        
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 to-transparent group-hover:via-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute -right-10 -top-10 w-20 h-20 bg-gradient-to-br from-[#f05010]/10 to-[#83c441]/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -left-10 -bottom-10 w-24 h-24 bg-gradient-to-br from-[#003023]/10 to-[#83c441]/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200" />
    </motion.div>
  );
}

// Optional: Add default props for better TypeScript/JSX support
ProjectCard.defaultProps = {
  project: {
    thumbnail: "/placeholder.jpg",
    status: "Completed",
    type: "Construction",
    technologies: []
  },
  index: 0
};