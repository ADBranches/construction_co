// src/pages/Services.jsx
import { useEffect, useState } from "react";
import api from "../lib/apiClient";
import Seo from "../seo/Seo";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    api
      .get("/api/v1/services")
      .then((data) => {
        if (isMounted) {
          setServices(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Failed to load services.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {/* SEO */}
      <Seo
        title="Our Services"
        description="Brisk Farm Solutions & Construction Company offers biogas systems, livestock enhancement, crop production support, waste-to-energy solutions, farm training, and modern construction services across Uganda."
      />

      <section className="space-y-6">
        {/* HEADER */}
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-yellow)]">
            Services
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--brand-green)]">
            Integrated Farm &amp; Construction Solutions
          </h1>
          <p className="mt-2 max-w-xl text-xs text-[var(--brand-contrast)]/80">
            We design and deliver sustainable systems that combine modern
            construction, integrated farming, and renewable energy to help
            households, farms, and institutions grow safely and profitably.
          </p>
        </header>

        {/* CORE SERVICE PILLARS */}
        <section className="grid gap-4 rounded-2xl border border-[var(--brand-green)]/20 bg-white/95 p-5 shadow-sm md:grid-cols-3">
          <article className="space-y-1">
            <h2 className="text-sm font-semibold text-[var(--brand-green)]">
              Biogas Solutions
            </h2>
            <p className="text-xs text-[var(--brand-contrast)]/80">
              Design and installation of biogas digesters for households and
              farms, turning organic waste into clean cooking energy and
              organic fertilizer.
            </p>
          </article>

          <article className="space-y-1">
            <h2 className="text-sm font-semibold text-[var(--brand-green)]">
              Livestock Enhancement
            </h2>
            <p className="text-xs text-[var(--brand-contrast)]/80">
              Improved housing, feeding systems, and manure management for
              dairy, beef, and mixed livestock enterprises.
            </p>
          </article>

          <article className="space-y-1">
            <h2 className="text-sm font-semibold text-[var(--brand-green)]">
              Crop Production
            </h2>
            <p className="text-xs text-[var(--brand-contrast)]/80">
              Climate-smart crop production, soil fertility management, and
              integrated farm planning for higher, more stable yields.
            </p>
          </article>

          <article className="space-y-1">
            <h2 className="text-sm font-semibold text-[var(--brand-green)]">
              General Construction
            </h2>
            <p className="text-xs text-[var(--brand-contrast)]/80">
              Housing, farm structures, storage facilities, and civil works
              executed with engineering discipline and quality materials.
            </p>
          </article>

          <article className="space-y-1">
            <h2 className="text-sm font-semibold text-[var(--brand-green)]">
              Waste-to-Energy Systems
            </h2>
            <p className="text-xs text-[var(--brand-contrast)]/80">
              Converting farm and household waste into useful energy and
              bio-fertilizer through well-designed waste management systems.
            </p>
          </article>

          <article className="space-y-1">
            <h2 className="text-sm font-semibold text-[var(--brand-green)]">
              Farm Training &amp; Tours
            </h2>
            <p className="text-xs text-[var(--brand-contrast)]/80">
              Practical capacity building, on-farm demonstrations, and learning
              visits for farmers, youth groups, and institutions.
            </p>
          </article>
        </section>

        {/* DETAILED SERVICE PACKAGES (BACKEND) */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--brand-green)]">
            Detailed Service Packages
          </h2>

          {loading && (
            <p className="text-xs text-[var(--brand-contrast)]/70">
              Loading services...
            </p>
          )}

          {error && (
            <p className="text-xs text-red-600">
              {error} – please try again later.
            </p>
          )}

          {!loading && !error && services.length === 0 && (
            <p className="text-xs text-[var(--brand-contrast)]/70">
              No detailed service packages are published yet. Please check back
              soon or contact us directly.
            </p>
          )}

          {!loading && !error && services.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {services.map((service) => (
                <article
                  key={service.id}
                  className="rounded-2xl border border-[var(--brand-green)]/20 bg-white p-4 shadow-sm"
                >
                  <h3 className="text-sm font-semibold text-[var(--brand-green)]">
                    {service.name}
                  </h3>

                  {service.short_description && (
                    <p className="mt-1 text-xs text-[var(--brand-contrast)]/80">
                      {service.short_description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </>
  );
}

export default Services;
