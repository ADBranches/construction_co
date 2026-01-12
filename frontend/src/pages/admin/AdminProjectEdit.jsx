// src/pages/admin/AdminProjectEdit.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../lib/apiClient";
import { authHeader } from "../../lib/auth";
import AdminLayout from "../../components/layout/AdminLayout";
import { useRequireAdmin } from "../../components/layout/useRequireAdmin";
import PrimaryButton from "../../components/ui/PrimaryButton";

function AdminProjectEdit() {
  useRequireAdmin();

  const { slug } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  // Load project
  useEffect(() => {
    let mounted = true;

    async function fetchProject() {
      try {
        const data = await api.get(`/api/v1/projects/${slug}`, {
          headers: authHeader(),
        });

        if (mounted) setProject(data);
      } catch (err) {
        if (mounted) navigate("/admin/projects");
      }
    }

    fetchProject();
    return () => {
      mounted = false;
    };
  }, [slug, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProject((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!project) return;

    setSaving(true);
    setFeedback("");

    const payload = {
      name: project.name,
      slug: project.slug,
      description: project.description,
      location: project.location,
      client_name: project.client_name,
      budget_amount: project.budget_amount,
      status: project.status,
      is_featured: project.is_featured,
    };

    try {
      await api.put(`/api/v1/projects/${project.id}`, payload, {
        headers: authHeader(),
      });
      setFeedback("Project updated successfully.");
    } catch (err) {
      setFeedback(err.message || "Failed to update project.");
    } finally {
      setSaving(false);
    }
  };

  if (!project) {
    return (
      <AdminLayout>
        <p className="text-xs text-[var(--brand-contrast)]/70">
          Loading project...
        </p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-yellow)]">
            Edit Project
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--brand-contrast)]">
            {project.name}
          </h1>
          <p className="mt-2 text-xs text-[var(--brand-contrast)]/80">
            Update this Brisk project record as details, budget, or status
            change.
          </p>
        </header>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-[var(--brand-green)]/15 bg-white p-5 shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
                Name
              </label>
              <input
                name="name"
                value={project.name || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[var(--brand-contrast)]/20 bg-[#f6fef9] px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
                Slug
              </label>
              <input
                name="slug"
                value={project.slug || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[var(--brand-contrast)]/20 bg-[#f6fef9] px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)]"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
                Location
              </label>
              <input
                name="location"
                value={project.location || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[var(--brand-contrast)]/20 bg-[#f6fef9] px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
                Client name
              </label>
              <input
                name="client_name"
                value={project.client_name || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[var(--brand-contrast)]/20 bg-[#f6fef9] px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
              Description
            </label>
            <textarea
              name="description"
              value={project.description || ""}
              onChange={handleChange}
              rows={4}
              className="mt-1 w-full rounded-xl border border-[var(--brand-contrast)]/20 bg-[#f6fef9] px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)]"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
                Budget (UGX)
              </label>
              <input
                type="number"
                name="budget_amount"
                value={project.budget_amount || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[var(--brand-contrast)]/20 bg-[#f6fef9] px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
                Status
              </label>
              <select
                name="status"
                value={project.status || "ONGOING"}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[var(--brand-contrast)]/20 bg-[#f6fef9] px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)]"
              >
                <option value="PLANNED">PLANNED</option>
                <option value="ONGOING">ONGOING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="ON_HOLD">ON_HOLD</option>
              </select>
            </div>

            <label className="mt-5 flex items-center gap-2 text-xs font-semibold text-[var(--brand-contrast)]">
              <input
                type="checkbox"
                name="is_featured"
                checked={project.is_featured || false}
                onChange={handleChange}
                className="h-4 w-4 rounded border-[var(--brand-contrast)]/30 text-[var(--brand-green)]"
              />
              Featured project
            </label>
          </div>

          <PrimaryButton type="submit" loading={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </PrimaryButton>

          {feedback && (
            <p className="mt-2 text-xs text-[var(--brand-contrast)]/80">
              {feedback}
            </p>
          )}
        </form>
      </div>
    </AdminLayout>
  );
}

export default AdminProjectEdit;
