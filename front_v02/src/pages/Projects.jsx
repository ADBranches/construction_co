// src/pages/Projects.jsx
import { useEffect, useState } from "react";
import Seo from "../seo/Seo";
import api from "../lib/apiClient";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    api
      .get("/api/v1/projects?limit=12&page=1")
      .then((data) => {
        if (!mounted) return;

        // handle both paginated { items: [] } and raw [] just in case
        const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
        setProjects(items);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.message || "Failed to load projects.");
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <Seo
        title="Projects | Brisk Farm Solutions & Construction"
        description="Selected biodigester, waste management, construction and smart farm systems delivered by Brisk Farm across Uganda."
      />

      <main className="bg-[#f6fef9] min-h-screen pb-24">
        {/* Header */}
        <section className="pt-16 pb-10">
          <div className="max-w-6xl mx-auto px-6 md:px-10">
            <p className="text-xs font-semibold tracking-[0.3em] text-[#f05010] uppercase mb-2">
              Projects
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#003023] mb-4">
              Selected Work Across Uganda
            </h1>
            <p className="text-sm md:text-base text-[#003023]/75 max-w-2xl leading-relaxed">
              A snapshot of biodigesters, waste-to-energy systems, farm
              structures and construction projects we&apos;ve delivered for
              farmers, institutions, households and partners across Uganda.
            </p>
          </div>
        </section>

        {/* Projects Grid */}
        <section>
          <div className="max-w-6xl mx-auto px-6 md:px-10">
            {loading && (
              <p className="text-center text-[#003023]/60 py-16">
                Loading projects…
              </p>
            )}

            {error && !loading && (
              <p className="text-center text-red-600 py-16">{error}</p>
            )}

            {!loading && !error && (
              <>
                {projects.length === 0 ? (
                  <p className="text-center text-[#003023]/60 py-16">
                    No projects available yet. Please check back soon.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    {projects.map((project, index) => (
                      <ProjectCard
                        key={project.id || project.slug || index}
                        project={project}
                        index={index}
                      />
                    ))}
                  </div>
                )}

                {/* CTA under grid */}
                <div className="flex justify-center mt-12">
                  <a
                    href="/quote"
                    className="px-8 py-3 rounded-xl border border-[#003023]/20 text-sm font-semibold text-[#003023] bg-white hover:bg-[#003023] hover:text-white transition shadow-sm"
                  >
                    Talk to us about your next project →
                  </a>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
