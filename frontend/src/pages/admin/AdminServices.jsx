// src/pages/admin/AdminServices.jsx
import { useEffect, useState } from "react";
import api from "../../lib/apiClient";
import { authHeader } from "../../lib/auth";
import AdminLayout from "../../components/layout/AdminLayout";
import { useRequireAdmin } from "../../components/layout/useRequireAdmin";
import PrimaryButton from "../../components/ui/PrimaryButton";

function AdminServices() {
  useRequireAdmin();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    short_description: "",
  });
  const [formMsg, setFormMsg] = useState("");

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await api.get("/api/v1/services", {
        headers: authHeader(),
      });
      setServices(data);
    } catch (err) {
      setError(err.message || "Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setFormMsg("");

    try {
      await api.post("/api/v1/services", form, {
        headers: authHeader(),
      });

      setForm({ name: "", slug: "", short_description: "" });
      setFormMsg("Service created successfully.");
      loadServices();
    } catch (err) {
      setFormMsg(err.message || "Failed to create service.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-yellow)]">
            Services
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--brand-contrast)]">
            Manage Service Offerings
          </h1>
          <p className="mt-2 text-xs text-[var(--brand-contrast)]/80">
            Create, view, and manage service categories such as biogas
            solutions, livestock enhancement, crop production, general
            construction, and more.
          </p>
        </header>

        {/* Create Service */}
        <form
          onSubmit={handleCreate}
          className="space-y-3 rounded-2xl border border-[var(--brand-green)]/15 bg-white p-4 shadow-sm"
        >
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
                Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-[var(--brand-contrast)]/20 bg-[#f6fef9] px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
                Slug
              </label>
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-[var(--brand-contrast)]/20 bg-[#f6fef9] px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
                Short description
              </label>
              <input
                name="short_description"
                value={form.short_description}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[var(--brand-contrast)]/20 bg-[#f6fef9] px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)]"
              />
            </div>
          </div>

          <PrimaryButton type="submit" loading={creating}>
            {creating ? "Saving..." : "Add Service"}
          </PrimaryButton>

          {formMsg && (
            <p className="text-xs text-[var(--brand-contrast)]/80">
              {formMsg}
            </p>
          )}
        </form>

        {/* List */}
        {loading && (
          <p className="text-xs text-[var(--brand-contrast)]/70">
            Loading services...
          </p>
        )}

        {error && <p className="text-xs text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="grid gap-3 md:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl border border-[var(--brand-green)]/15 bg-white p-4 shadow-sm"
              >
                <h2 className="text-sm font-semibold text-[var(--brand-contrast)]">
                  {service.name}
                </h2>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--brand-contrast)]/60">
                  {service.slug}
                </p>
                {service.short_description && (
                  <p className="mt-1 text-xs text-[var(--brand-contrast)]/80">
                    {service.short_description}
                  </p>
                )}
              </div>
            ))}

            {services.length === 0 && (
              <p className="text-xs text-[var(--brand-contrast)]/70">
                No services found. Create at least one to populate the public
                Services page.
              </p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminServices;
