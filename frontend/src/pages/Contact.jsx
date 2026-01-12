// src/pages/Contact.jsx
import { useState } from "react";
import Seo from "../seo/Seo";
import api from "../lib/apiClient";
import PrimaryButton from "../components/ui/PrimaryButton";

function Contact() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      await api.post("/api/v1/inquiries", form);
      setStatus("Your message has been sent successfully.");
      setForm({ full_name: "", email: "", message: "" });
    } catch (err) {
      setStatus("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* SEO */}
      <Seo
        title="Contact"
        description="Get in touch with Brisk Farm Solutions & Construction Company for biogas systems, livestock and crop production support, and modern construction services in Uganda."
      />

      <section className="space-y-4">
        {/* Header */}
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-yellow)]">
            Contact
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--brand-green)]">
            Let’s talk about your farm or construction project.
          </h1>
          <p className="mt-2 max-w-xl text-xs text-[var(--brand-contrast)]/80">
            Reach out for biogas installations, livestock units, crop
            production support, or construction works. We typically respond
            within 1–2 working days.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
          {/* Contact Info */}
          <div className="space-y-4 rounded-2xl border border-[var(--brand-green)]/20 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-[var(--brand-green)]">
              Office &amp; Field Location
            </h2>
            <p className="text-xs text-[var(--brand-contrast)]/80">
              Ssenge, Naluvule, Wakiso District, Uganda <br />
              Serving farmers, households and institutions across Central
              Uganda and beyond.
            </p>

            <h2 className="mt-4 text-sm font-semibold text-[var(--brand-green)]">
              Contact Details
            </h2>
            <p className="text-xs text-[var(--brand-contrast)]/80">
              Phone:{" "}
              <span className="font-semibold">+256 783 111 015</span>
              <br />
              Email:{" "}
              <a
                href="mailto:briskfarmsolutions@gmail.com"
                className="text-[var(--brand-yellow)] hover:underline"
              >
                briskfarmsolutions@gmail.com
              </a>
            </p>

            <h2 className="mt-4 text-sm font-semibold text-[var(--brand-green)]">
              Directors
            </h2>
            <p className="text-xs text-[var(--brand-contrast)]/80">
              Gideon <br />
              Morret <br />
              Bwambale
            </p>
          </div>

          {/* Google Maps Embed */}
          <div className="h-56 rounded-2xl border border-[var(--brand-green)]/20 bg-gradient-to-br from-[var(--brand-green)] via-[var(--brand-earth)] to-[var(--brand-contrast)] p-[2px]">
            <div className="h-full overflow-hidden rounded-2xl bg-[#fdfcf7]/95">
              <iframe
                title="Brisk Farm Solutions & Construction Company Location"
                src="https://www.google.com/maps?q=0.40653,32.5118&z=14&output=embed"
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-[var(--brand-green)]/20 bg-white p-5 shadow-sm"
        >
          <div>
            <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
              Full Name
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
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-[var(--brand-green)]/20 bg-[#fdfcf7] px-3 py-2 text-xs text-[var(--brand-contrast)] outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--brand-contrast)]">
              Message
            </label>
            <textarea
              name="message"
              rows={4}
              value={form.message}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-[var(--brand-green)]/20 bg-[#fdfcf7] px-3 py-2 text-xs text-[var(--brand-contrast)] outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]"
            />
          </div>

          <PrimaryButton
            type="submit"
            loading={loading}
            text={loading ? "Sending..." : "Send Message"}
          />

          {status && (
            <p className="text-xs text-[var(--brand-contrast)]/80 mt-2">
              {status}
            </p>
          )}
        </form>
      </section>
    </>
  );
}

export default Contact;
