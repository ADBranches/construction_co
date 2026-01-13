// src/pages/admin/AdminProjects.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/apiClient";
import { authHeader } from "../../lib/auth";
import AdminLayout from "../../components/layout/AdminLayout";
import { useRequireAdmin } from "../../components/layout/useRequireAdmin";

function AdminProjects() {
  useRequireAdmin();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchProjects() {
      try {
        const payload = await api.get("/api/v1/projects?limit=100", {
          headers: authHeader(),
        });

        if (mounted) {
          const items = payload?.items || [];
          setProjects(items);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load projects.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchProjects();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-yellow)]">
              Projects
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[var(--brand-contrast)]">
              Manage Brisk Portfolio
            </h1>
            <p className="mt-2 text-xs text-[var(--brand-contrast)]/80">
              Add and update key projects that showcase Brisk Farm Solutions &
              Construction Company&apos;s work across Uganda.
            </p>
          </div>

          <Link
            to="/admin/projects/new"
            className="rounded-full bg-[var(--brand-green)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#fdfcf7] shadow hover:bg-[var(--brand-green)]/90"
          >
            Add Project
          </Link>
        </header>

        {/* States */}
        {loading && (
          <p className="text-xs text-[var(--brand-contrast)]/70">
            Loading projects...
          </p>
        )}

        {error && <p className="text-xs text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="overflow-hidden rounded-2xl border border-[var(--brand-green)]/15 bg-white shadow-sm">
            <table className="min-w-full border-separate border-spacing-0 text-left text-xs">
              <thead className="bg-[var(--brand-green)]/5 text-[var(--brand-contrast)]/80">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Featured</th>
                  <th className="px-4 py-3 text-right"></th>
                </tr>
              </thead>

              <tbody>
                {projects.map((project, idx) => (
                  <tr
                    key={project.id}
                    className={
                      idx % 2 === 1 ? "bg-[var(--brand-green)]/3" : "bg-white"
                    }
                  >
                    <td className="px-4 py-2 font-medium text-[var(--brand-contrast)]">
                      {project.title || project.name}
                    </td>
                    <td className="px-4 py-2 text-[var(--brand-contrast)]/80">
                      {project.service?.title || project.service?.name || "-"}
                    </td>
                    <td className="px-4 py-2 text-[11px] font-semibold text-[var(--brand-green)]">
                      {project.status}
                    </td>
                    <td className="px-4 py-2 text-[11px]">
                      {project.is_featured ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Link
                        to={`/admin/projects/${project.slug}`}
                        className="text-[11px] font-semibold text-[var(--brand-earth)] hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}

                {projects.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-4 text-center text-xs text-[var(--brand-contrast)]/70"
                    >
                      No projects found. Use &ldquo;Add Project&rdquo; to
                      publish your first Brisk case study.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminProjects;
