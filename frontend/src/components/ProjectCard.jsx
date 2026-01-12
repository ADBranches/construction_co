// src/components/ProjectCard.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProjectCard({ project }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="overflow-hidden rounded-xl border border-[#8c6e47]/25 bg-white shadow-md"
    >
      <Link to={`/projects/${project.slug}`}>
        <div className="relative">
          <img
            src={project.thumbnail || "/placeholder.jpg"}
            alt={project.title}
            className="h-56 w-full object-cover transition-transform duration-300 hover:scale-105"
          />

          {/* Status Badge */}
          {project.status && (
            <span className="absolute right-3 top-3 rounded-full bg-[#f0c02f] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#1f1f1f] shadow-md">
              {project.status}
            </span>
          )}
        </div>

        <div className="space-y-1 p-5">
          <h3 className="text-lg font-semibold text-[#1f1f1f]">
            {project.title}
          </h3>
          {project.summary && (
            <p className="text-sm text-[#4b5563] line-clamp-2">
              {project.summary}
            </p>
          )}

          {project.location && (
            <p className="pt-1 text-xs font-medium uppercase tracking-[0.16em] text-[#2f8f2f]">
              {project.location}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
