// src/pages/admin/AdminProjectEdit.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../lib/apiClient";
import { authHeader } from "../../lib/auth";
import AdminLayout from "../../components/layout/AdminLayout";
import { useRequireAdmin } from "../../components/layout/useRequireAdmin";
import PrimaryButton from "../../components/ui/PrimaryButton";

const STATUS_OPTIONS = [
  { value: "planned", label: "Planned" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On hold" },
];

function AdminProjectEdit() {
  useRequireAdmin();

  const { slug } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load project by slug (public endpoint)
  useEffect(() => {
    let isMounted = true;

    async function fetchProject() {
      try {
        const data = await api.get(`/api/v1/projects/${slug}`);
        if (!isMounted) return;
        setProject(data);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to load project.");
        // optional: redirect if not found
        // navigate("/admin/projects");
      }
    }

    fetchProject();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProject((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!project) return;

    setSaving(true);
    setError("");

    // 🔹 Align with ProjectUpdate / test payload shape
    const payload = {
      name: project.name,
      slug: project.slug,
      location: project.location,
      client_name: project.client_name,
      budget: project.budget,
      status: project.status, // "planned" | "ongoing" | "completed" | "on_hold"
      is_featured: !!project.is_featured,
      short_description: project.short_description,
      description: project.description,
      hero_image_url: project.hero_image_url,
    };

    try {
      await api.put(`/api/v1/projects/${project.id}`, payload, {
        headers: authHeader(),
      });
      navigate("/admin/projects");
    } catch (err) {
      setError(err.message || "Failed to save project.");
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
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form
        onSubmit={handleSave}
        className="space-y-6 max-w-3xl rounded-2xl border border-[var(--brand-green)]/15 bg-white p-5 shadow-sm"
      >
        {/* Header */}
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-yellow)]">
            Edit Project
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--brand-contrast)]">
            {project.name}
          </h1>
          <p className="mt-2 text-xs text-[var(--brand-contrast)]/80">
            Update portfolio details, project status, and featured flags for
            this project.
          </p>
        </header>

        {/* Row 1: Name + Slug */}
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
              required
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
              required
            />
          </div>
        </div>

        {/* Row 2: Location / Client / Budget */}
        <div className="grid gap-4 md:grid-cols-3">
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
              Client Name
            </label>
            <input
              name="client_name"
              value={project.client_name || ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-[var(--brand-contrast)]/20 bg-[#f6fef9] px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
              Budget
            </label>
            <input
              name="budget"
              value={project.budget || ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-[var(--brand-contrast)]/20 bg-[#f6fef9] px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)]"
              placeholder="e.g. 50M UGX"
            />
          </div>
        </div>

        {/* Status + Featured + Hero Image */}
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
              Status
            </label>
            <select
              name="status"
              value={project.status || "ongoing"}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-[var(--brand-contrast)]/20 bg-white px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)]"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--brand-contrast)]">
              <input
                type="checkbox"
                name="is_featured"
                checked={!!project.is_featured}
                onChange={handleChange}
                className="rounded border-[var(--brand-contrast)]/30"
              />
              Featured case study
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
              Hero Image URL (optional)
            </label>
            <input
              name="hero_image_url"
              value={project.hero_image_url || ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-[var(--brand-contrast)]/20 bg-[#f6fef9] px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)]"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Short description */}
        <div>
          <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
            Short Description
          </label>
          <input
            name="short_description"
            value={project.short_description || ""}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border border-[var(--brand-contrast)]/20 bg-[#f6fef9] px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)]"
            placeholder="One-line summary for cards."
          />
        </div>

        {/* Full description */}
        <div>
          <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
            Detailed Description
          </label>
          <textarea
            name="description"
            rows={5}
            value={project.description || ""}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border border-[var(--brand-contrast)]/20 bg-[#f6fef9] px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)] resize-none"
            placeholder="Include system details, scope, and results..."
          />
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <div className="flex items-center gap-3">
          <PrimaryButton type="submit" loading={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </PrimaryButton>

          <button
            type="button"
            onClick={() => navigate("/admin/projects")}
            className="text-xs font-semibold text-[var(--brand-contrast)]/70 hover:underline"
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

export default AdminProjectEdit;
