// src/pages/Services.jsx
import { useEffect, useState } from "react";
import api from "../lib/apiClient";
import Seo from "../seo/Seo";
import ServiceCard from "../components/ServiceCard";
import { Leaf, Zap, Building } from "lucide-react";

/**
 * Fallback hero images for services where backend hero_image_url
 * is not set. These match files in public/images/services.
 */
const SERVICE_HERO_MAP = {
  "biodigester-installation":
    "/images/services/biodigester-installation_02-hero.webp",
  "biogas-appliances-supply":
    "/images/services/biogas-appliances-supply_01-hero.webp",
  "farm-and-household-waste-management":
    "/images/services/farm-and-household-waste-management_05-hero.webp",
  "capacity-building-services":
    "/images/services/capacity-building-services_04-hero.webp",
  "pasture-establishment-and-management":
    "/images/services/pasture-establishment-and-management_05-hero.webp",
  "animal-production-consultancy":
    "/images/services/animal-production-consultancy_05-hero.webp",
};

/**
 * Icon + color mapping per service slug.
 * Color keys line up with ServiceCard colorVariants.
 */
const SERVICE_STYLE_MAP = {
  "biodigester-installation": { icon: Zap, color: "emerald" },
  "biogas-appliances-supply": { icon: Zap, color: "orange" },
  "farm-and-household-waste-management": { icon: Building, color: "orange" },
  "capacity-building-services": { icon: Leaf, color: "blue" },
  "pasture-establishment-and-management": { icon: Leaf, color: "emerald" },
  "animal-production-consultancy": { icon: Building, color: "emerald" },
};

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    api
      .get("/api/v1/services")
      .then((data) => {
        if (!isMounted) return;

        // backend returns a plain array
        const items = Array.isArray(data) ? data : data?.items || [];
        setServices(items);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;

        setError(err.message || "Failed to load services.");
        setLoading(false);
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

      <section className="space-y-8">
        {/* HEADER */}
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-yellow)]">
            Services
          </p>
          <h1 className="mt-1 text-2xl md:text-3xl font-extrabold text-[var(--brand-green)]">
            Integrated Farm &amp; Construction Solutions
          </h1>
          <p className="mt-2 max-w-xl text-xs md:text-sm text-[var(--brand-contrast)]/80">
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
        <section className="space-y-4">
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
            <div className="grid gap-5 md:grid-cols-2">
              {services.map((service, index) => {
                const style = SERVICE_STYLE_MAP[service.slug] || {
                  icon: Leaf,
                  color: "emerald",
                };

                const imageUrl =
                  service.hero_image_url ||
                  SERVICE_HERO_MAP[service.slug] ||
                  null;

                return (
                  <ServiceCard
                    key={service.id}
                    icon={style.icon}
                    title={service.name}
                    description={
                      service.short_description || service.description || ""
                    }
                    tagline={service.tagline}
                    features={[
                      service.highlight_1,
                      service.highlight_2,
                      service.highlight_3,
                    ].filter(Boolean)}
                    color={style.color}
                    delay={index * 0.05}
                    slug={service.slug}
                    imageUrl={imageUrl}
                  />
                );
              })}
            </div>
          )}
        </section>
      </section>
    </>
  );
}

export default Services;
