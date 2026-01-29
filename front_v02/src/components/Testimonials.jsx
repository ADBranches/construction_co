// src/components/Testimonials.jsx
import { useEffect, useState } from "react";
import { MessageCircle, Quote, Star } from "lucide-react";
import TestimonialsStore from "../lib/testimonialsStore";

function StarRow({ rating = 5 }) {
  const safeRating = Number.isFinite(rating) ? rating : 5;

  const stars = [];
  for (let i = 0; i < 5; i += 1) {
    const filled = i < safeRating;
    stars.push(
      <Star
        key={i}
        className={`h-4 w-4 ${
          filled ? "text-amber-400 fill-amber-400" : "text-amber-200"
        }`}
      />
    );
  }
  return <div className="flex gap-0.5">{stars}</div>;
}

export default function Testimonials({ limit }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    function fetchTestimonials() {
      setLoading(true);
      try {
        const data = TestimonialsStore.listPublic();
        if (cancelled) return;

        const list = Array.isArray(data) ? data : [];
        setItems(limit ? list.slice(0, limit) : list);
      } catch {
        if (!cancelled) {
          setItems([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchTestimonials();
    return () => {
      cancelled = true;
    };
  }, [limit]);


  if (loading && items.length === 0) {
    return null;
  }

  if (!loading && items.length === 0) {
    // silent on public side if no testimonials yet
    return null;
  }

  return (
    <section className="bg-[#f6fef9] py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-contrast)]/70">
              <MessageCircle className="h-3.5 w-3.5 text-[var(--brand-green)]" />
              Client Stories
            </div>
            <h2 className="mt-3 text-2xl font-bold text-[var(--brand-contrast)] sm:text-3xl">
              What Our Clients Say
            </h2>
            <p className="mt-2 max-w-xl text-xs text-[var(--brand-contrast)]/70">
              Real feedback from farmers, site owners, and project partners
              we&apos;ve supported across Uganda and beyond.
            </p>
          </div>

          {items.length > 0 && (
            <div className="hidden text-right text-xs text-[var(--brand-contrast)]/60 md:block">
              <p>
                <span className="font-semibold text-[var(--brand-contrast)]">
                  {items.length}
                </span>{" "}
                verified testimonials
              </p>
              <p>Showing featured feedback for Brisk Farm Solutions.</p>
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => {
            const message = t.message || t.quote || "";
            const clientName = t.client_name || t.name || "Anonymous client";
            const clientRole = t.client_role || t.role || "";
            const company = t.company || "";
            const rating = t.rating ?? 5;

            return (
              <article
                key={t.id}
                className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--brand-contrast)]/5 bg-white p-6 shadow-sm"
              >
                <Quote className="absolute -right-1 -top-1 h-10 w-10 text-[var(--brand-green)]/10" />

                <div className="mb-3 flex items-center justify-between gap-3">
                  <StarRow rating={rating} />
                  {t.is_featured && (
                    <span className="rounded-full bg-[var(--brand-green)]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-green)]">
                      Featured
                    </span>
                  )}
                </div>

                <p className="mb-5 text-sm leading-relaxed text-[var(--brand-contrast)]/85">
                  {message}
                </p>

                <div className="mt-auto pt-4">
                  <p className="text-sm font-semibold text-[var(--brand-contrast)]">
                    {clientName}
                  </p>
                  {(clientRole || company) && (
                    <p className="mt-0.5 text-[11px] text-[var(--brand-contrast)]/60">
                      {clientRole}
                      {clientRole && company && " · "}
                      {company}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
