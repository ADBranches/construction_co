// src/pages/Home.jsx
import { Link } from "react-router-dom";
import PrimaryButton from "../components/ui/PrimaryButton";
import Seo from "../seo/Seo";

function Home() {
  return (
    <>
      <Seo
        title="Home"
        description="Brisk Farm Solutions & Construction Company – Smart Construction and Sustainable Agriculture solutions for farms, homes, and communities across Uganda."
      />

      <div className="space-y-12">
        {/* HERO */}
        <section className="overflow-hidden rounded-3xl bg-[var(--brand-green)] px-6 py-10 text-[#fdfcf7] shadow-lg md:flex md:items-center md:justify-between md:px-10">
          <div className="max-w-xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--brand-yellow)]">
              UGANDA • FARM & CONSTRUCTION SOLUTIONS
            </p>

            <h1 className="text-3xl font-black leading-tight md:text-4xl">
              Brisk Farm Solutions &amp;{" "}
              <span className="text-[var(--brand-yellow)]">
                Construction Company
              </span>
            </h1>

            <p className="text-sm font-semibold text-[#fdfcf7] md:text-base">
              Smart Construction. Sustainable Agriculture.
            </p>

            <p className="text-sm text-[#fdfcf7]/80 md:text-base">
              We combine modern construction, integrated farm systems, and
              renewable energy solutions to help households, farms, and
              institutions build stronger, more sustainable futures.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/quote">
                <PrimaryButton text="Request a Site Visit" />
              </Link>

              <Link
                to="/projects"
                className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.16em] text-[#fdfcf7]/80 hover:text-[var(--brand-yellow)]"
              >
                View Completed Projects
              </Link>
            </div>

            <div className="mt-4 flex flex-wrap gap-6 text-xs text-[#fdfcf7]/80">
              <div>
                <p className="text-lg font-bold text-[var(--brand-yellow)]">
                  Smart Builds
                </p>
                <p>Construction tailored for farms, homes &amp; institutions.</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[var(--brand-yellow)]">
                  Sustainable
                </p>
                <p>Biogas, waste-to-energy &amp; climate-smart farming.</p>
              </div>
            </div>
          </div>

          {/* Decorative Visual */}
          <div className="mt-8 hidden w-full max-w-xs justify-end md:mt-0 md:flex">
            <div className="relative h-52 w-full rounded-3xl bg-gradient-to-br from-[var(--brand-green)] via-[var(--brand-earth)] to-[var(--brand-contrast)]">
              <div className="absolute inset-4 rounded-3xl border border-white/25 bg-[#fdfcf7]/5 backdrop-blur-sm" />
              <p className="absolute bottom-4 left-4 max-w-[80%] text-[11px] font-medium uppercase tracking-[0.18em] text-white/80">
                SMART CONSTRUCTION • SUSTAINABLE AGRICULTURE
              </p>
            </div>
          </div>
        </section>

        {/* HIGHLIGHTS */}
        <section className="grid gap-4 rounded-2xl border border-[var(--brand-green)]/15 bg-white/95 p-5 shadow-sm md:grid-cols-3">
          <div>
            <h2 className="text-sm font-semibold text-[var(--brand-green)]">
              Smart Farm Systems
            </h2>
            <p className="mt-1 text-xs text-[var(--brand-contrast)]/80">
              Integrated crop, livestock, and water management systems designed
              to increase productivity and resilience.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[var(--brand-green)]">
              Biogas &amp; Waste-to-Energy
            </h2>
            <p className="mt-1 text-xs text-[var(--brand-contrast)]/80">
              Design and installation of biogas digesters and waste-to-energy
              solutions for homes, farms, and institutions.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[var(--brand-green)]">
              Construction &amp; Civil Works
            </h2>
            <p className="mt-1 text-xs text-[var(--brand-contrast)]/80">
              Housing, farm structures, storage facilities, and civil works
              delivered with engineering discipline and quality.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
