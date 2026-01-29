// src/pages/admin/AdminTestimonials.jsx
import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useRequireAdmin } from "../../components/layout/useRequireAdmin";
import api from "../../lib/apiClient";
import { authHeader } from "../../lib/auth";
import PrimaryButton from "../../components/ui/PrimaryButton";
import TestimonialsStore from "../../lib/testimonialsStore";

function StatusToggle({ label, checked, onChange }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-[11px] text-[var(--brand-contrast)]/80">
      <span>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-4 w-7 rounded-full transition ${
          checked ? "bg-[var(--brand-green)]" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition ${
            checked ? "right-0.5" : "left-0.5"
          }`}
        />
      </button>
    </label>
  );
}

function RatingSelect({ value, onChange }) {
  return (
    <select
      value={value ?? 5}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full rounded-xl border border-[var(--brand-contrast)]/20 bg-[#f6fef9] px-2 py-1.5 text-xs outline-none focus:border-[var(--brand-green)]"
    >
      {[5, 4, 3, 2, 1].map((r) => (
        <option key={r} value={r}>
          {r} stars
        </option>
      ))}
    </select>
  );
}

function AdminTestimonials() {
  useRequireAdmin();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    client_name: "",
    client_role: "",
    company: "",
    message: "",
    rating: 5,
    is_active: true,
    is_featured: false,
    display_order: 0,
  });
  const [formMsg, setFormMsg] = useState("");

  const loadTestimonials = () => {
    setLoading(true);
    setError("");

    try {
      const data = TestimonialsStore.listAll();
      const list = Array.isArray(data) ? data : [];

      // Keep same idea as public: sorted by display_order if present
      const sorted = [...list].sort(
        (a, b) =>
          (a.display_order ?? a.displayOrder ?? 0) -
          (b.display_order ?? b.displayOrder ?? 0)
      );

      setItems(sorted);
    } catch (err) {
      setError(err.message || "Failed to load testimonials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    setCreating(true);
    setFormMsg("");

    try {
      TestimonialsStore.create({
        ...form,
        rating: Number(form.rating) || 5,
      });

      setForm({
        client_name: "",
        client_role: "",
        company: "",
        message: "",
        rating: 5,
        is_active: true,
        is_featured: false,
        display_order: 0,
      });
      setFormMsg("Testimonial created successfully.");
      loadTestimonials();
    } catch (err) {
      setFormMsg(err.message || "Failed to create testimonial.");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleField = (id, field, value) => {
    try {
      TestimonialsStore.update(id, { [field]: value });
      loadTestimonials();
    } catch (err) {
      alert(err.message || "Failed to update testimonial.");
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this testimonial? This cannot be undone.")) {
      return;
    }

    try {
      TestimonialsStore.remove(id);
      loadTestimonials();
    } catch (err) {
      alert(err.message || "Failed to delete testimonial.");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-yellow)]">
            Testimonials
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--brand-contrast)]">
            Client Feedback CMS
          </h1>
          <p className="mt-2 text-xs text-[var(--brand-contrast)]/80 max-w-xl">
            Add and manage testimonials from farmers and construction clients.
            Featured &amp; active testimonials power the public &quot;What Our
            Clients Say&quot; section.
          </p>
        </header>

        {/* Create form */}
        <form
          onSubmit={handleCreate}
          className="space-y-3 rounded-2xl border border-[var(--brand-green)]/15 bg-white p-4 shadow-sm"
        >
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
                Client name
              </label>
              <input
                name="client_name"
                value={form.client_name}
                onChange={handleFormChange}
                required
                className="mt-1 w-full rounded-xl border border-[var(--brand-contrast)]/20 bg-[#f6fef9] px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
                Role / title
              </label>
              <input
                name="client_role"
                value={form.client_role}
                onChange={handleFormChange}
                className="mt-1 w-full rounded-xl border border-[var(--brand-contrast)]/20 bg-[#f6fef9] px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
                Company / farm
              </label>
              <input
                name="company"
                value={form.company}
                onChange={handleFormChange}
                className="mt-1 w-full rounded-xl border border-[var(--brand-contrast)]/20 bg-[#f6fef9] px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)]"
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleFormChange}
                required
                rows={3}
                className="mt-1 w-full rounded-xl border border-[var(--brand-contrast)]/20 bg-[#f6fef9] px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)] resize-none"
                placeholder="What did we do for this client? What outcome did they get?"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
                Rating
              </label>
              <div className="mt-1">
                <RatingSelect
                  value={form.rating}
                  onChange={(val) =>
                    setForm((prev) => ({ ...prev, rating: val }))
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
                Display order
              </label>
              <input
                name="display_order"
                type="number"
                value={form.display_order}
                onChange={handleFormChange}
                className="mt-1 w-full rounded-xl border border-[var(--brand-contrast)]/20 bg-[#f6fef9] px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)]"
              />
              <div className="mt-2 flex flex-col gap-1">
                <StatusToggle
                  label="Active"
                  checked={form.is_active}
                  onChange={(val) =>
                    setForm((prev) => ({ ...prev, is_active: val }))
                  }
                />
                <StatusToggle
                  label="Featured"
                  checked={form.is_featured}
                  onChange={(val) =>
                    setForm((prev) => ({ ...prev, is_featured: val }))
                  }
                />
              </div>
            </div>
          </div>

          <PrimaryButton type="submit" loading={creating}>
            {creating ? "Saving..." : "Add Testimonial"}
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
            Loading testimonials...
          </p>
        )}

        {error && <p className="text-xs text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="grid gap-3 md:grid-cols-2">
            {items.map((t) => (
              <div
                key={t.id}
                className="flex flex-col rounded-2xl border border-[var(--brand-green)]/15 bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-semibold text-[var(--brand-contrast)]">
                      {t.client_name}
                    </h2>
                    {(t.client_role || t.company) && (
                      <p className="text-[11px] text-[var(--brand-contrast)]/60">
                        {t.client_role}
                        {t.client_role && t.company && " · "}
                        {t.company}
                      </p>
                    )}
                  </div>
                  <RatingSelect
                    value={t.rating ?? 5}
                    onChange={(val) =>
                      handleToggleField(t.id, "rating", val)
                    }
                  />
                </div>

                <p className="flex-1 text-xs text-[var(--brand-contrast)]/80">
                  {t.message}
                </p>

                <div className="mt-3 flex items-center justify-between gap-3 pt-3 text-[11px]">
                  <div className="flex flex-wrap gap-3">
                    <StatusToggle
                      label="Active"
                      checked={t.is_active}
                      onChange={(val) =>
                        handleToggleField(t.id, "is_active", val)
                      }
                    />
                    <StatusToggle
                      label="Featured"
                      checked={t.is_featured}
                      onChange={(val) =>
                        handleToggleField(t.id, "is_featured", val)
                      }
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(t.id)}
                    className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-semibold text-red-700 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <p className="text-xs text-[var(--brand-contrast)]/70">
                No testimonials yet. Add at least one to showcase social proof
                on the homepage.
              </p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminTestimonials;
