// src/pages/Projects.jsx
import { useEffect, useState } from "react";
import api from "../lib/apiClient";
import Seo from "../seo/Seo";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    api
      .get("/api/v1/projects")
      .then((data) => {
        if (isMounted) {
          setProjects(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Failed to load projects.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {/* SEO */}
      <Seo
        title="Our Projects"
        description="Explore farm structures, biogas systems, waste-to-energy installations, and construction projects delivered by Brisk Farm Solutions & Construction Company across Uganda."
      />

      <section className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-10 md:mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-yellow)]/40 bg-[var(--brand-yellow)]/5 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--brand-yellow)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-yellow)] animate-pulse" />
              Projects
            </div>

            <h1 className="mt-4 text-3xl md:text-4xl font-bold text-[var(--brand-green)]">
              Selected Work Across Uganda
            </h1>

            <p className="mt-3 max-w-2xl text-sm md:text-base text-[var(--brand-contrast)]/80 leading-relaxed">
              A snapshot of biogas systems, farm structures, housing, and
              infrastructure we’ve delivered for farmers, institutions,
              households, and partners across Uganda.
            </p>
          </header>

          {/* Error state */}
          {error && (
            <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs md:text-sm text-red-800">
              {error} – please try again later.
            </div>
          )}

          {/* Loading skeleton */}
          {loading && !error && (
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse overflow-hidden rounded-3xl border border-[var(--brand-green)]/10 bg-white/80 shadow-sm"
                >
                  <div className="h-32 bg-gradient-to-r from-[var(--brand-green)]/15 via-[var(--brand-earth)]/15 to-[var(--brand-contrast)]/15" />
                  <div className="space-y-3 p-4">
                    <div className="h-3 w-3/4 rounded bg-[var(--brand-contrast)]/10" />
                    <div className="h-2.5 w-1/3 rounded bg-[var(--brand-contrast)]/10" />
                    <div className="h-2.5 w-1/4 rounded bg-[var(--brand-yellow)]/20" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Projects grid */}
          {!loading && !error && (
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--brand-green)]/15 bg-white/90 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Top ribbon / image area */}
                  <div className="relative h-32 w-full bg-gradient-to-br from-[var(--brand-green)] via-[var(--brand-earth)] to-[var(--brand-contrast)]">
                    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_#ffffff55,_transparent_55%)]" />
                    <div className="relative z-10 flex h-full items-end justify-between px-4 pb-3">
                      <div className="space-y-1">
                        <span className="inline-flex items-center rounded-full bg-black/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white">
                          {project.status || "Completed"}
                        </span>
                      </div>
                      {project.location && (
                        <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium text-[var(--brand-green)] shadow-sm">
                          📍 {project.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-between p-4 md:p-5">
                    <div className="space-y-2">
                      <h2 className="text-sm md:text-base font-semibold text-[var(--brand-green)] leading-snug">
                        {project.name || project.title || "Brisk Project"}
                      </h2>

                      {/* Optional description if available */}
                      {project.description && (
                        <p className="text-xs md:text-sm text-[var(--brand-contrast)]/80 line-clamp-3 leading-relaxed">
                          {project.description}
                        </p>
                      )}

                      {/* Meta row */}
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[var(--brand-contrast)]/70">
                        {project.category && (
                          <span className="inline-flex items-center rounded-full bg-[var(--brand-green)]/5 px-2 py-1 text-[10px] font-medium text-[var(--brand-green)]">
                            {project.category}
                          </span>
                        )}
                        {project.client && (
                          <span className="inline-flex items-center rounded-full bg-[var(--brand-contrast)]/5 px-2 py-1 text-[10px] font-medium">
                            Client: {project.client}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex items-center justify-between border-t border-[var(--brand-contrast)]/10 pt-3">
                      <p className="text-[11px] text-[var(--brand-contrast)]/60">
                        {project.year
                          ? `Year: ${project.year}`
                          : "Ongoing field support included."}
                      </p>
                      <span className="inline-flex items-center text-[11px] font-semibold text-[var(--brand-green)] group-hover:text-[var(--brand-yellow)] transition-colors">
                        View details
                        <svg
                          className="ml-1 h-3 w-3 transform transition-transform group-hover:translate-x-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Projects;
