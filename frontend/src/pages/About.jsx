// src/pages/About.jsx
import Seo from "../seo/Seo";

function About() {
  return (
    <>
      <Seo
        title="About Us"
        description="Learn about Brisk Farm Solutions & Construction Company — our vision, mission, objectives, history, values, and the communities we serve across Uganda."
      />

      <div className="space-y-8">
        {/* Header */}
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-yellow)]">
            About Us
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--brand-green)]">
            Brisk Farm Solutions &amp; Construction Company
          </h1>
          <p className="mt-2 max-w-2xl text-xs text-[var(--brand-contrast)]/80">
            We are an integrated agro-systems and construction company focused
            on biogas, livestock, crops, and sustainable building solutions that
            empower farmers, institutions, and households across Uganda.
          </p>
        </header>

        {/* Vision & Mission */}
        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-[var(--brand-green)]/40 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-[var(--brand-green)]">
              Vision
            </h2>
            <p className="mt-2 text-xs text-[var(--brand-contrast)]/80">
              A future where sustainable agriculture and modern construction
              work together to uplift communities everywhere.
            </p>
          </article>

          <article className="rounded-2xl border border-[var(--brand-green)]/40 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-[var(--brand-green)]">
              Mission
            </h2>
            <p className="mt-2 text-xs text-[var(--brand-contrast)]/80">
              To design and build integrated agro-systems—from biogas and
              construction to livestock and crop production—that are productive,
              sustainable, and scalable.
            </p>
          </article>
        </section>

        {/* Objectives */}
        <section className="space-y-3 rounded-2xl border border-[var(--brand-green)]/40 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--brand-green)]">
            Objectives
          </h2>
          <ul className="list-disc space-y-1 pl-4 text-xs text-[var(--brand-contrast)]/80">
            <li>
              Boost farm productivity through mechanization, improved breeds,
              and practical innovation.
            </li>
            <li>
              Coordinate and deliver farm trainings, tours, and learning
              programs for farmers and institutions.
            </li>
            <li>
              Expand biodigester and biogas technologies to enhance production,
              energy supply, fertilizer output, and waste management.
            </li>
            <li>
              Advocate for policies that support innovation in agriculture,
              renewable energy, and organic practices.
            </li>
            <li>
              Implement sustainable, modern construction methods across farm
              structures and general building projects.
            </li>
          </ul>
        </section>

        {/* Target Market */}
        <section className="space-y-3 rounded-2xl border border-[var(--brand-green)]/40 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--brand-green)]">
            Target Market
          </h2>
          <p className="text-xs text-[var(--brand-contrast)]/80">
            Brisk Farm Solutions &amp; Construction Company serves a wide range
            of clients within the agricultural, construction, and renewable
            energy ecosystem:
          </p>
          <div className="grid gap-3 text-xs text-[var(--brand-contrast)]/80 md:grid-cols-2">
            <ul className="list-disc space-y-1 pl-4">
              <li>
                Small, medium, and large-scale farmers seeking biogas systems,
                livestock housing, irrigation, and farm construction.
              </li>
              <li>
                Commercial livestock enterprises such as dairy farms, piggery
                units, poultry farms, and ranches.
              </li>
              <li>
                Agricultural cooperatives and farmer groups that need training,
                farm tours, and modern farming technologies.
              </li>
              <li>
                Institutions and organizations including schools, universities,
                health centers, NGOs, and community groups.
              </li>
            </ul>
            <ul className="list-disc space-y-1 pl-4">
              <li>
                Real estate developers and construction clients needing
                eco-friendly buildings, farm structures, and biogas systems.
              </li>
              <li>
                Government agencies and local authorities promoting agriculture,
                clean energy, and rural transformation.
              </li>
              <li>
                Urban and rural households looking for affordable biogas and
                sustainable waste management solutions.
              </li>
            </ul>
          </div>
        </section>

        {/* Competitors */}
        <section className="space-y-4 rounded-2xl border border-[var(--brand-green)]/40 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--brand-green)]">
            Competitors
          </h2>

          <div>
            <h3 className="text-xs font-semibold text-[var(--brand-earth)]">
              Global Competitors
            </h3>
            <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-[var(--brand-contrast)]/80">
              <li>Sistema.bio</li>
              <li>HomeBiogas</li>
              <li>Biogas Systems AB</li>
              <li>EnviTec Biogas</li>
              <li>AGCO Corporation</li>
              <li>Yara International</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-[var(--brand-earth)]">
              Local &amp; Regional Competitors
            </h3>
            <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-[var(--brand-contrast)]/80">
              <li>Green Heat Uganda</li>
              <li>CREEC (Makerere University)</li>
              <li>Biogas Solutions Uganda Ltd (BSUL)</li>
              <li>Village Energy Uganda</li>
              <li>Agromax Uganda</li>
              <li>Farm Engineering Industries Ltd (FEIL)</li>
              <li>Davis &amp; Shirtliff</li>
            </ul>
          </div>
        </section>

        {/* Company History */}
        <section className="space-y-3 rounded-2xl border border-[var(--brand-green)]/40 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--brand-green)]">
            Company History
          </h2>
          <p className="text-xs text-[var(--brand-contrast)]/80">
            Brisk Farm Solutions &amp; Construction Company was founded in 2025
            by Muhindo Gideon, starting as a single-member initiative with a
            dream of becoming one of Uganda&apos;s leading agro and construction
            companies.
          </p>
          <p className="text-xs text-[var(--brand-contrast)]/80">
            The founder initially operated as an individual, then expanded the
            vision into a company limited by shares to serve more farmers,
            institutions, and communities with integrated agro-construction
            solutions.
          </p>
        </section>

        {/* Core Values */}
        <section className="space-y-3 rounded-2xl border border-[var(--brand-green)]/40 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--brand-green)]">
            Core Values
          </h2>
          <div className="grid gap-3 text-xs text-[var(--brand-contrast)]/80 md:grid-cols-2">
            <div className="space-y-1">
              <h3 className="font-semibold text-[var(--brand-earth)]">
                Sustainability
              </h3>
              <p>
                We champion renewable energy, eco-friendly farming, and
                responsible use of natural resources.
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-[var(--brand-earth)]">
                Innovation
              </h3>
              <p>
                We apply modern technologies, smart farming systems, and
                continuous improvement in every project we deliver.
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-[var(--brand-earth)]">
                Integrity
              </h3>
              <p>
                We operate with transparency, honesty, and strong ethical
                standards across all client engagements.
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-[var(--brand-earth)]">
                Community Empowerment
              </h3>
              <p>
                We train, support, and uplift farmers, institutions, and
                communities through practical knowledge and tailored solutions.
              </p>
            </div>

            <div className="space-y-1 md:col-span-2">
              <h3 className="font-semibold text-[var(--brand-earth)]">
                Quality &amp; Reliability
              </h3>
              <p>
                We deliver durable, efficient, and professional services that
                clients can trust for long-term success and impact.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default About;
