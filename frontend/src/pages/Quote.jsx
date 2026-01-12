// src/pages/Quote.jsx
import { useState } from "react";
import api from "../lib/apiClient.js";
import PrimaryButton from "../components/ui/PrimaryButton.jsx";
import Seo from "../seo/Seo";

function Quote() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    project_type: "",
    budget_range: "",
    location: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback("");

    try {
      await api.post("/api/v1/inquiries", form);
      setFeedback(
        "Thank you. Our team will review your request and get back to you with next steps or a site visit schedule."
      );
      setForm({
        full_name: "",
        email: "",
        phone: "",
        project_type: "",
        budget_range: "",
        location: "",
        message: "",
      });
    } catch (err) {
      setFeedback(
        err.message || "Something went wrong. Please try again shortly."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo
        title="Request a Quote"
        description="Share details about your farm or construction project and Brisk Farm Solutions & Construction Company will respond with guidance, pricing, or a site visit plan."
      />

      <section className="space-y-4">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-yellow)]">
            Request Quotation
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--brand-green)]">
            Tell us about your project.
          </h1>
          <p className="mt-2 max-w-xl text-xs text-[var(--brand-contrast)]/80">
            Share a few details about your biogas system, livestock unit, crop
            production plan, or construction project and our team will respond
            with next steps, site visit scheduling, or a preliminary BOQ
            discussion.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-[var(--brand-green)]/20 bg-white p-5 shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
                Full name *
              </label>
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-[var(--brand-green)]/20 bg-[#fdfcf7] px-3 py-2 text-xs text-[var(--brand-contrast)] outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[var(--brand-green)]/20 bg-[#fdfcf7] px-3 py-2 text-xs text-[var(--brand-contrast)] outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
                Phone / WhatsApp
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-[var(--brand-green)]/20 bg-[#fdfcf7] px-3 py-2 text-xs text-[var(--brand-contrast)] outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
                Project type
              </label>
              <input
                name="project_type"
                value={form.project_type}
                onChange={handleChange}
                placeholder="Biogas, livestock unit, farm structure, housing..."
                className="mt-1 w-full rounded-xl border border-[var(--brand-green)]/20 bg-[#fdfcf7] px-3 py-2 text-xs text-[var(--brand-contrast)] outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
                Budget range
              </label>
              <input
                name="budget_range"
                value={form.budget_range}
                onChange={handleChange}
                placeholder="e.g. 20M–150M UGX"
                className="mt-1 w-full rounded-xl border border-[var(--brand-green)]/20 bg-[#fdfcf7] px-3 py-2 text-xs text-[var(--brand-contrast)] outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
                Project location
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="District / town"
                className="mt-1 w-full rounded-xl border border-[var(--brand-green)]/20 bg-[#fdfcf7] px-3 py-2 text-xs text-[var(--brand-contrast)] outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
              Brief description
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              className="mt-1 w-full rounded-xl border border-[var(--brand-green)]/20 bg-[#fdfcf7] px-3 py-2 text-xs text-[var(--brand-contrast)] outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]"
            />
          </div>

          <PrimaryButton
            type="submit"
            loading={submitting}
            text={submitting ? "Submitting..." : "Submit Request"}
          />

          {feedback && (
            <p className="text-xs text-[var(--brand-contrast)]/80 mt-2">
              {feedback}
            </p>
          )}
        </form>
      </section>
    </>
  );
}

export default Quote;
