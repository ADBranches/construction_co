// src/pages/ProjectDetail.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/apiClient";
import { ArrowRight } from "lucide-react";

export default function ProjectDetail() {
  const { slug } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setError(false);

    api
      .get(`/api/v1/projects/${slug}`)
      .then((data) => {
        if (!mounted) return;
        setProject(data);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setError(true);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f6fef9]">
        <p className="text-[#003023]/70 text-sm">Loading project…</p>
      </main>
    );
  }

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

  // 🔑 unified image fallback (same idea as cards)
  const projectImage =
    project.hero_image_url ||
    project.cover_image_url ||
    (project.media_items && project.media_items.length > 0
      ? project.media_items[0].url
      : null) ||
    "/images/projects/biodigester-installation_01.webp";

  return (
    <main className="bg-[#f6fef9] min-h-screen">
      <section className="relative py-10">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 items-center rounded-3xl bg-[#001a13] text-white px-6 py-10 lg:px-10 lg:py-12 shadow-[0_24px_80px_rgba(0,0,0,0.45)] overflow-hidden">
            {/* LEFT: TEXT */}
            <div>
              <p className="text-xs font-semibold tracking-[0.24em] text-[#83c441] uppercase mb-3">
                Brisk Farm Projects
              </p>

              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                {project.name}
              </h1>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs font-semibold uppercase tracking-[0.16em] mb-5">
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
              </div>

              {project.location && (
                <p className="text-sm text-white/70 mb-3">
                  Location:{" "}
                  <span className="font-semibold text-white">
                    {project.location}
                  </span>
                </p>
              )}

              {project.client_name && (
                <p className="text-sm text-white/70 mb-4">
                  Client:{" "}
                  <span className="font-semibold text-white">
                    {project.client_name}
                  </span>
                </p>
              )}

              {project.short_description && (
                <p className="text-white/80 text-sm md:text-base mb-6">
                  {project.short_description}
                </p>
              )}

              {project.description && (
                <p className="text-white/70 text-sm md:text-base mb-8">
                  {project.description}
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/quote"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#f05010] text-white text-sm font-semibold shadow-md hover:bg-[#d9460c] transition"
                >
                  Start a similar project
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 text-sm font-semibold text-white/90 hover:bg-white/5 transition"
                >
                  Back to all projects
                </Link>
              </div>
            </div>

            {/* RIGHT: IMAGE */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-[#002018]">
                <img
                  src={projectImage}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
