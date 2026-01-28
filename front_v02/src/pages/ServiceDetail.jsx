// src/pages/ServiceDetail.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/apiClient";
import { ArrowRight } from "lucide-react";

export default function ServiceDetail() {
  const { slug } = useParams();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    api.get(`/api/v1/services/${slug}`)
      .then((data) => {
        setService(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  // ---------------------------
  // 1️⃣ Loading UI
  // ---------------------------
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f6fef9]">
        <p className="text-[#003023]/70 text-sm">Loading service…</p>
      </main>
    );
  }

  // ---------------------------
  // 2️⃣ Not Found UI
  // ---------------------------
  if (error || !service) {
    return (
      <main className="bg-[#f6fef9] min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h1 className="text-2xl font-bold text-[#003023] mb-4">
            Service not found
          </h1>

          <p className="text-sm text-[#003023]/70 mb-6">
            The requested service does not exist. Please return to all services.
          </p>

          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f05010] text-white text-sm font-semibold hover:bg-[#d9460c] transition"
          >
            View All Services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  // Normalize image path (fixes missing image issue)
  const heroImage =
    service.hero_image_url.startsWith("/")
      ? service.hero_image_url
      : "/" + service.hero_image_url;

  // ---------------------------
  // 3️⃣ Render Actual Service Content
  // ---------------------------
  return (
    <main className="bg-[#f6fef9] min-h-screen">
      <section className="relative py-10">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 items-center rounded-3xl bg-[#001a13] text-white px-6 py-10 lg:px-10 lg:py-12 shadow-[0_24px_80px_rgba(0,0,0,0.45)] overflow-hidden">
            
            <div>
              <p className="text-xs font-semibold tracking-[0.24em] text-[#83c441] uppercase mb-3">
                Brisk Farm Services
              </p>

              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                {service.name}
              </h1>

              <p className="text-white/80 text-sm md:text-base mb-6">
                {service.short_description}
              </p>

              <p className="text-[#83c441] font-semibold text-sm md:text-base mb-6">
                {service.tagline}
              </p>

              <ul className="space-y-2.5 text-sm text-white/85 mb-8">
                {service.highlight_1 && (
                  <li className="flex gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#83c441]" />
                    {service.highlight_1}
                  </li>
                )}
                {service.highlight_2 && (
                  <li className="flex gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#83c441]" />
                    {service.highlight_2}
                  </li>
                )}
                {service.highlight_3 && (
                  <li className="flex gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#83c441]" />
                    {service.highlight_3}
                  </li>
                )}
              </ul>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/quote"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#f05010] text-white text-sm font-semibold shadow-md hover:bg-[#d9460c] transition"
                >
                  Request a project quote
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 text-sm font-semibold text-white/90 hover:bg-white/5 transition"
                >
                  Talk to an engineer
                </Link>
              </div>
            </div>

            {/* FIXED: Correct image rendering */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-[#002018]">
                <img
                  src={heroImage}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

// (Optional future blocks can be added below)

      {/* (Optional) later: add gallery, stats, featured projects blocks here */}

