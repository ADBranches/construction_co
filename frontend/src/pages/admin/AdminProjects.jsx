// src/pages/admin/AdminProjects.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/apiClient";
import { authHeader } from "../../lib/auth";
import AdminLayout from "../../components/layout/AdminLayout";
import { useRequireAdmin } from "../../components/layout/useRequireAdmin";
import PrimaryButton from "../../components/ui/PrimaryButton";

const STATUS_LABELS = {
  planned: "Planned",
  ongoing: "Ongoing",
  completed: "Completed",
  on_hold: "On Hold",
};

function StatusBadge({ status }) {
  const label = STATUS_LABELS[status] || status;

  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]";
  const styles =
    status === "completed"
      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
      : status === "ongoing"
      ? "bg-amber-50 text-amber-700 border border-amber-200"
      : status === "planned"
      ? "bg-slate-50 text-slate-700 border border-slate-200"
      : "bg-slate-50 text-slate-700 border border-slate-200";

  return <span className={`${base} ${styles}`}>{label}</span>;
}

function AdminProjects() {
  useRequireAdmin();

  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProjects = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await api.get("/api/v1/projects", {
        headers: authHeader(),
      });

      const items = Array.isArray(data) ? data : [];
      setProjects(items);
      setFiltered(items);
    } catch (err) {
      setError(err.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter + search
  useEffect(() => {
    let items = [...projects];

    if (statusFilter !== "all") {
      items = items.filter((p) => p.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.slug?.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q)
      );
    }

    setFiltered(items);
  }, [projects, statusFilter, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project? This cannot be undone.")) return;

    try {
      await api.delete(`/api/v1/projects/${id}`, {
        headers: authHeader(),
      });
      await loadProjects();
    } catch (err) {
      alert(err.message || "Failed to delete project.");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-yellow)]">
              Projects
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[var(--brand-contrast)]">
              Portfolio Management
            </h1>
            <p className="mt-2 text-xs text-[var(--brand-contrast)]/80 max-w-xl">
              View and manage Brisk construction &amp; farm system projects.
              Keep your portfolio fresh with featured case studies and accurate
              statuses.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <input
              type="text"
              placeholder="Search by name, slug, or location"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border border-[var(--brand-contrast)]/20 bg-[#f6fef9] px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)]"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-[var(--brand-contrast)]/20 bg-white px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)]"
            >
              <option value="all">All statuses</option>
              <option value="planned">Planned</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>
        </header>

        {/* Content */}
        {loading && (
          <p className="text-xs text-[var(--brand-contrast)]/70">
            Loading projects...
          </p>
        )}

        {error && <p className="text-xs text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl border border-[var(--brand-green)]/15 bg-white p-4 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm font-semibold text-[var(--brand-contrast)]">
                      {project.name}
                    </h2>
                    <StatusBadge status={project.status} />
                  </div>

                  <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--brand-contrast)]/60">
                    {project.slug}
                  </p>

                  {project.location && (
                    <p className="text-xs text-[var(--brand-contrast)]/80">
                      Location: {project.location}
                    </p>
                  )}

                  {project.client_name && (
                    <p className="text-xs text-[var(--brand-contrast)]/70">
                      Client: {project.client_name}
                    </p>
                  )}

                  {project.budget && (
                    <p className="text-xs text-[var(--brand-contrast)]/70">
                      Budget: {project.budget}
                    </p>
                  )}

                  {project.short_description && (
                    <p className="mt-1 text-xs text-[var(--brand-contrast)]/80 line-clamp-3">
                      {project.short_description}
                    </p>
                  )}

                  {project.is_featured && (
                    <p className="mt-1 text-[10px] font-semibold text-[var(--brand-yellow)]">
                      ★ Featured case study
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center justify-between gap-3">
                  <Link
                    to={`/admin/projects/${project.slug}`}
                    className="text-xs font-semibold text-[var(--brand-green)] hover:underline"
                  >
                    Edit Project
                  </Link>

                  <PrimaryButton
                    type="button"
                    onClick={() => handleDelete(project.id)}
                    className="!bg-red-500 !px-3 !py-1.5 !text-xs hover:!bg-red-600"
                  >
                    Delete
                  </PrimaryButton>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <p className="text-xs text-[var(--brand-contrast)]/70">
                No projects found. Once you create or import projects, they will
                appear here.
              </p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminProjects;
