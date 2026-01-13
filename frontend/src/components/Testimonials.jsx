// src/components/Testimonials.jsx
import { useEffect, useState } from "react";
import api from "../lib/apiClient";

function TestimonialCard({ item }) {
  return (
    <figure className="flex h-full flex-col justify-between rounded-2xl border border-[var(--brand-green)]/15 bg-white p-4 shadow-sm">
      <blockquote className="text-sm leading-relaxed text-[var(--brand-contrast)]/80">
        “{item.quote}”
      </blockquote>

      <figcaption className="mt-4 border-t border-[var(--brand-green)]/15 pt-3 text-xs">
        <div className="font-semibold text-[var(--brand-contrast)]">
          {item.name}
        </div>
        {(item.role || item.company) && (
          <div className="mt-0.5 text-[11px] text-[var(--brand-contrast)]/70">
            {[item.role, item.company].filter(Boolean).join(" · ")}
          </div>
        )}
      </figcaption>
    </figure>
  );
}

export default function Testimonials({ limit = 6 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchTestimonials() {
      try {
        const data = await api.get("/api/v1/testimonials?featured=true");
        if (!mounted) return;

        const list = Array.isArray(data) ? data.slice(0, limit) : [];
        setItems(list);
      } catch (err) {
        console.error("Failed to load testimonials", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchTestimonials();
    return () => {
      mounted = false;
    };
  }, [limit]);

  if (loading) {
    return (
      <section className="container py-10">
        <p className="text-xs text-[var(--brand-contrast)]/70">
          Loading client testimonials…
        </p>
      </section>
    );
  }

  if (!items.length) {
    // If none yet, just don't render anything on the public side.
    return null;
  }

  return (
    <section className="container py-10">
      <header className="mb-6 max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-yellow)]">
          Client stories
        </p>
        <h2 className="mt-1 text-2xl font-bold text-[var(--brand-contrast)]">
          What our clients say
        </h2>
        <p className="mt-2 text-xs text-[var(--brand-contrast)]/80">
          Feedback from farmers, homeowners, and partners who have trusted
          Brisk for biogas, livestock, and construction projects.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <TestimonialCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
