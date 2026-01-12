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

      <section className="space-y-4">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-yellow)]">
            Projects
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--brand-green)]">
            Selected works across Uganda
          </h1>
          <p className="mt-2 max-w-xl text-xs text-[var(--brand-contrast)]/80">
            A snapshot of biogas systems, farm structures, housing, and
            infrastructure we’ve delivered for farmers, institutions, households
            and partners.
          </p>
        </header>

        {loading && (
          <p className="text-xs text-[var(--brand-contrast)]/70">Loading...</p>
        )}

        {error && (
          <p className="text-xs text-red-600">
            {error} – please try again later.
          </p>
        )}

        {!loading && !error && (
          <div className="grid gap-4 md:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.id}
                className="flex flex-col rounded-2xl border border-[var(--brand-green)]/20 bg-white shadow-sm"
              >
                <div className="h-28 w-full rounded-t-2xl bg-gradient-to-br from-[var(--brand-green)] via-[var(--brand-earth)] to-[var(--brand-contrast)]" />

                <div className="space-y-1 p-3">
                  <h2 className="text-sm font-semibold text-[var(--brand-green)]">
                    {project.name || project.title || "Brisk Project"}
                  </h2>

                  {project.location && (
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--brand-contrast)]/60">
                      {project.location}
                    </p>
                  )}

                  {project.status && (
                    <p className="text-[11px] font-semibold text-[var(--brand-yellow)]">
                      {project.status}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default Projects;
