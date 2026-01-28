// src/pages/Services.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/apiClient";
import Seo from "../seo/Seo";
import ServiceCard from "../components/ServiceCard";
import { Leaf, Zap, Building } from "lucide-react";

/**
 * Fallback hero images for services where backend hero_image_url
 * is not set. These match files in public/images/services.
 */
const SERVICE_HERO_MAP = {
  "animal-production-consultancy":
    "/images/services/animal-production-consultancy_05-hero.webp",
  "farm-and-household-waste-management":
    "/images/services/farm-and-household-waste-management_05-hero.webp",
  "biodigester-installation":
    "/images/services/biodigester-installation_02-hero.webp",
  "biogas-appliances-supply":
    "/images/services/biogas-appliances-supply_01-hero.webp",
  "capacity-building-services":
    "/images/services/capacity-building-services_04-hero.webp",
  "pasture-establishment-and-management":
    "/images/services/pasture-establishment-and-management_05-hero.webp",
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

/**
 * Category pills for quick navigation to each detailed package.
 */
const SERVICE_PILLS = [
  { label: "Animal Production", slug: "animal-production-consultancy" },
  { label: "Waste Management", slug: "farm-and-household-waste-management" },
  { label: "Biodigester Installation", slug: "biodigester-installation" },
  { label: "Biogas Appliances", slug: "biogas-appliances-supply" },
  { label: "Capacity Building", slug: "capacity-building-services" },
  { label: "Pasture & Forage", slug: "pasture-establishment-and-management" },
];

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
        title="Services | Brisk Farm Solutions & Construction Company"
        description="Animal production consultancy, farm & household waste management, biodigester installation, biogas appliances supply, capacity building, and pasture establishment across Uganda."
      />

      <section className="space-y-10">
        {/* PAGE HERO BLOCK (intro + high-level overview) */}
        <section className="rounded-3xl border border-[var(--brand-green)]/10 bg-white/95 shadow-sm p-6 md:p-8 space-y-6">
          {/* HEADER INTRO */}
          <header>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-yellow)]">
              Services
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-bold text-[var(--brand-green)]">
              Integrated Farm &amp; Construction Solutions
            </h1>
            <p className="mt-2 max-w-2xl text-xs md:text-sm text-[var(--brand-contrast)]/80">
              We design and deliver sustainable systems that combine modern
              construction, integrated farming, and renewable energy to help
              households, farms, and institutions grow safely and profitably
              across Uganda.
            </p>
          </header>

          {/* HIGH-LEVEL SERVICE OVERVIEW (TOP GRID) */}
          <section className="grid gap-4 rounded-2xl border border-[var(--brand-green)]/15 bg-white p-5 md:p-6 shadow-sm md:grid-cols-3">
            <article className="space-y-1">
              <h2 className="text-sm font-semibold text-[var(--brand-green)]">
                Animal Production Consultancy
              </h2>
              <p className="text-xs text-[var(--brand-contrast)]/80">
                Dairy, beef, small ruminant and poultry enterprises – production
                planning, housing, feeding and profitability support tailored to
                your farm realities.
              </p>
            </article>

            <article className="space-y-1">
              <h2 className="text-sm font-semibold text-[var(--brand-green)]">
                Farm &amp; Household Waste Management
              </h2>
              <p className="text-xs text-[var(--brand-contrast)]/80">
                Turning organic waste into a resource through structured
                collection, sorting and treatment strategies that prepare
                feedstock for composting and biodigesters.
              </p>
            </article>

            <article className="space-y-1">
              <h2 className="text-sm font-semibold text-[var(--brand-green)]">
                Biodigester Installation
              </h2>
              <p className="text-xs text-[var(--brand-contrast)]/80">
                Design and installation of fixed-dome and prefabricated
                biodigesters for reliable biogas and slurry, sized for
                households, farms and institutions.
              </p>
            </article>

            <article className="space-y-1">
              <h2 className="text-sm font-semibold text-[var(--brand-green)]">
                Supply of Biogas Appliances
              </h2>
              <p className="text-xs text-[var(--brand-contrast)]/80">
                Brooder heaters, generators, compressors, cylinders, analyzers,
                scrubbers, pressure gauges, boilers, steam generators, pumps,
                flow meters and more – properly matched to your system.
              </p>
            </article>

            <article className="space-y-1">
              <h2 className="text-sm font-semibold text-[var(--brand-green)]">
                Capacity Building Services
              </h2>
              <p className="text-xs text-[var(--brand-contrast)]/80">
                Practical training on livestock management, biodigester
                operation, safety, maintenance and record-keeping for farmers,
                operators and technicians.
              </p>
            </article>

            <article className="space-y-1">
              <h2 className="text-sm font-semibold text-[var(--brand-green)]">
                Pasture Establishment &amp; Management
              </h2>
              <p className="text-xs text-[var(--brand-contrast)]/80">
                Pasture planning, fodder systems, grazing plans and
                conservation strategies to keep animals well-fed and farms
                resilient.
              </p>
            </article>
          </section>
        </section>

        {/* DETAILED SERVICE PACKAGES (BACKEND-DRIVEN) */}
        <section className="space-y-5">
          {/* Section label + category pills */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[0.7rem] md:text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-yellow)]">
                Detailed Service Packages
              </p>
              <h2 className="mt-1 text-base md:text-lg font-semibold text-[var(--brand-green)]">
                Choose the service that matches your farm or project
              </h2>
            </div>

            {!loading && !error && services.length > 0 && (
              <div className="flex flex-wrap gap-2 md:gap-3">
                {SERVICE_PILLS.filter((pill) =>
                  services.some((s) => s.slug === pill.slug)
                ).map((pill) => (
                  <button
                    key={pill.slug}
                    type="button"
                    onClick={() => {
                      const el = document.getElementById(
                        `service-${pill.slug}`
                      );
                      if (el) {
                        el.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }}
                    className="rounded-full border border-[var(--brand-green)]/20 bg-white/80 px-3 py-1 text-[0.68rem] md:text-xs text-[var(--brand-contrast)]/80 hover:bg-[var(--brand-green)] hover:text-white transition-colors"
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* STATES */}
          {loading && (
            <div className="rounded-2xl border border-dashed border-[var(--brand-green)]/30 bg-white/70 px-4 py-3 text-xs md:text-sm text-[var(--brand-contrast)]/80">
              Loading services…
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs md:text-sm text-red-700">
              {error} – please try again later.
            </div>
          )}

          {!loading && !error && services.length === 0 && (
            <div className="rounded-2xl border border-[var(--brand-green)]/15 bg-white/80 px-4 py-3 text-xs md:text-sm text-[var(--brand-contrast)]/80">
              No detailed service packages are published yet. Please check back
              soon or{" "}
              <Link
                to="/contact"
                className="font-medium text-[var(--brand-green)] underline underline-offset-2"
              >
                contact us directly
              </Link>
              .
            </div>
          )}

          {/* CARDS GRID */}
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
                  <div
                    key={service.id}
                    id={`service-${service.slug}`}
                    className="scroll-mt-32"
                  >
                    <ServiceCard
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
                  </div>
                );
              })}
            </div>
          )}

          {/* BOTTOM CTA BAND */}
          {/* BOTTOM CTA BAND */}
          {!loading && !error && services.length > 0 && (
            <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#003023] to-[#83c441] px-6 py-6 md:px-8 md:py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="max-w-xl">
                <h3 className="text-sm md:text-base lg:text-lg font-semibold text-[#f6fef9]">
                  Not sure which package fits your farm?
                </h3>
                <p className="mt-1 text-[0.72rem] md:text-xs lg:text-sm text-[#f6fef9] leading-relaxed">
                  Tell us about your farm, institution or construction project and we’ll
                  recommend a tailored combination of services.
                </p>
              </div>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full bg-[#f6fef9] text-[#003023] px-5 py-2 text-xs md:text-sm font-semibold shadow-sm hover:bg-white transition-colors"
              >
                Talk to an expert →
              </Link>
            </div>
          )}


        </section>
      </section>
    </>
  );
}

export default Services;
