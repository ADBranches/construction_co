// src/components/Hero.jsx
import PrimaryButton from "./ui/PrimaryButton";

export default function Hero() {
  return (
    <section className="relative -mx-4 mb-16 md:mt-4">
      <div className="container">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#04140a] via-[var(--brand-green)] to-[var(--brand-earth)] text-white shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
          {/* subtle vignette */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/60" />

          <div className="relative z-10 grid gap-10 px-6 py-10 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] md:px-10 md:py-12">
            {/* LEFT: copy */}
            <div className="space-y-5">
              <p className="inline-flex items-center gap-2 rounded-full bg-black/30 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--brand-yellow)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-yellow)]" />
                Uganda · Farm &amp; Construction Solutions
              </p>

              <h1 className="text-3xl font-black leading-tight md:text-4xl lg:text-5xl">
                Brisk Farm Solutions &amp;{" "}
                <span className="text-[var(--brand-yellow)]">
                  Construction Company
                </span>
              </h1>

              <p className="text-sm font-semibold md:text-base">
                Smart Construction. Sustainable Agriculture.
              </p>

              <p className="max-w-xl text-sm text-gray-100/90 md:text-base">
                We combine modern construction, integrated farm systems, and
                renewable energy solutions to help households, farms, and
                institutions build stronger, more sustainable futures.
              </p>

              <div className="mt-2 flex flex-wrap gap-3">
                <PrimaryButton text="Request a Site Visit" href="/quote" />

                <a
                  href="#services"
                  className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-100/85 hover:text-[var(--brand-yellow)]"
                >
                  View Completed Projects
                </a>
              </div>

              {/* mini pillars */}
              <div className="mt-4 grid gap-4 text-xs text-gray-100/90 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-bold text-[var(--brand-yellow)]">
                    Smart Builds
                  </p>
                  <p>
                    Construction tailored for farms, homes &amp; institutions.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--brand-yellow)]">
                    Sustainable Systems
                  </p>
                  <p>
                    Biogas, waste-to-energy &amp; climate-smart farming for
                    resilient livelihoods.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT: glass card */}
            <div className="flex items-center justify-end">
              <div className="relative h-56 w-full max-w-xs rounded-[28px] bg-gradient-to-br from-black/20 via-[var(--brand-earth)]/60 to-black/80 shadow-[0_18px_40px_rgba(0,0,0,0.55)] md:h-64">
                <div className="absolute inset-3 rounded-[24px] border border-white/25 bg-white/5 backdrop-blur-md" />
                <div className="absolute inset-5 rounded-[22px] bg-gradient-to-br from-[var(--brand-green)]/25 via-black/40 to-black/80" />
                <p className="absolute bottom-6 left-7 max-w-[80%] text-[11px] font-medium uppercase tracking-[0.18em] text-white/85">
                  SMART CONSTRUCTION • SUSTAINABLE AGRICULTURE
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
