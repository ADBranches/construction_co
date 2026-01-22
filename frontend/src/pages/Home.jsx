// src/pages/Home.jsx
import { useEffect, useState, useRef } from "react";
import Seo from "../seo/Seo";
import Hero from "../components/Hero.jsx";
import api from "../lib/apiClient";
import { Leaf, Zap, Building } from "lucide-react";
import ProjectCard from "../components/ProjectCard.jsx";

/* ---------------------------------------------
   BRAND COLORS
---------------------------------------------- */
const BRAND = {
  dark: "#003023",
  orange: "#f05010",
  green: "#83c441",
  mint: "#f6fef9",
};

/* ---------------------------------------------
   TESTIMONIAL SLIDER
---------------------------------------------- */
const testimonials = [
  {
    quote:
      "Brisk Farm Solutions transformed our production workflow. The biogas and irrigation systems doubled our efficiency.",
    name: "Mugisha Daniel",
    role: "Commercial Farmer – Mbarara",
  },
  {
    quote:
      "Their construction and engineering team exceeded expectations — professional, timely, and very reliable.",
    name: "Eng. Komugisha Hope",
    role: "Civil Engineer – Kampala",
  },
  {
    quote:
      "We were impressed by how seamlessly the renewable energy system integrated into our operations.",
    name: "Sarah N.",
    role: "Agripreneur – Wakiso",
  },
];

function TestimonialSlider() {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 4500);
    return () => clearTimeout(timeoutRef.current);
  }, [index]);

  const t = testimonials[index];

  return (
    <div className="relative max-w-3xl mx-auto text-center px-6">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 px-8 py-10">
        <p className="text-xl md:text-2xl text-[#003023] italic leading-relaxed">
          “{t.quote}”
        </p>
        <div className="mt-6">
          <p className="text-lg font-semibold text-[#003023]">{t.name}</p>
          <p className="text-sm text-[#003023]/70">{t.role}</p>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-5 gap-3">
        {testimonials.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full transition ${
              index === i ? "bg-[#f05010]" : "bg-[#003023]/30"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------
   HOME COMPONENT
---------------------------------------------- */

export default function Home() {
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState("");

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState("");

  useEffect(() => {
    let mounted = true;

    // Services
    api
      .get("/api/v1/services")
      .then((data) => {
        if (!mounted) return;
        setServices(Array.isArray(data) ? data : data?.items || []);
        setLoadingServices(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setServicesError(err.message || "Failed to load services.");
        setLoadingServices(false);
      });

    // Featured projects (Featured Work)
    api
      .get("/api/v1/projects?featured=true&limit=6")
      .then((data) => {
        if (!mounted) return;
        const items = Array.isArray(data) ? data : data?.items || [];
        setProjects(items);
        setLoadingProjects(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setProjectsError(err.message || "Failed to load projects.");
        setLoadingProjects(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const iconMap = [Leaf, Zap, Building];

  const featuredServices = (services || [])
    .slice(0, 3)
    .map((service, i) => ({
      ...service,
      icon: iconMap[i] || Leaf,
    }));

  /* ---------------------------------------------
     RESTORED TREE-STYLE PROCESS STEPS
  ---------------------------------------------- */
  const processSteps = [
    {
      step: "01",
      title: "Consultation",
      description: "We assess your needs, requirements, and goals.",
      icon: "💬",
    },
    {
      step: "02",
      title: "Design & Planning",
      description: "Engineering drawings, BOQs, and system design.",
      icon: "📐",
    },
    {
      step: "03",
      title: "Site Preparation",
      description: "Mobilization, excavation, and infrastructure setup.",
      icon: "🚜",
    },
    {
      step: "04",
      title: "Execution",
      description: "Professional construction and installation.",
      icon: "⚡",
    },
    {
      step: "05",
      title: "Handover & Support",
      description: "Commissioning, training, and ongoing support.",
      icon: "🎯",
    },
  ];

  // Featured Work: show minimum 3 projects (if available)
  const featuredProjects = (projects || []).slice(0, 3);

  return (
    <>
      <Seo
        title="Modern Farm & Construction Solutions | Brisk Farm"
        description="Sustainable farm systems, renewable energy, and construction services."
      />

      <div className="bg-[#f6fef9]">
        {/* HERO */}
        <Hero />

        {/* PILLARS */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[#003023] mb-12">
              Our Pillars of Excellence
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  icon: Leaf,
                  title: "Agriculture",
                  desc: "Smart farming, irrigation, livestock & productivity tools.",
                },
                {
                  icon: Zap,
                  title: "Renewable Energy",
                  desc: "Biogas systems, solar integration & sustainable energy.",
                },
                {
                  icon: Building,
                  title: "Construction",
                  desc: "Modern, durable construction for homes & farms.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-[#f6fef9] border border-[#83c441]/30 rounded-3xl p-10 shadow-sm hover:shadow-xl transition"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#003023] flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-[#003023] mb-3">
                    {item.title}
                  </h3>

                  <p className="text-[#003023]/70">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED SERVICES */}
        <section className="py-28 bg-[#f6fef9]" id="services">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <h2 className="text-center text-4xl md:text-5xl font-bold text-[#003023] mb-16">
              Featured Services
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {loadingServices && (
                <p className="col-span-full text-center text-gray-600">
                  Loading services…
                </p>
              )}

              {!loadingServices &&
                !servicesError &&
                featuredServices.map((service, index) => {
                  const Icon = service.icon;

                  return (
                    <div
                      key={index}
                      className="group bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-2xl p-10 transition relative"
                    >
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#83c441]/10 to-[#f05010]/10 opacity-0 group-hover:opacity-100 transition"></div>

                      <div className="relative">
                        <div className="w-16 h-16 bg-[#003023] rounded-2xl flex items-center justify-center mb-6 shadow">
                          <Icon className="w-8 h-8 text-white" />
                        </div>

                        <h3 className="text-2xl font-bold text-[#003023] mb-4 group-hover:text-[#f05010]">
                          {service.name}
                        </h3>

                        <p className="text-[#003023]/70 mb-8">
                          {service.short_description ||
                            "Tailored solution for your next project."}
                        </p>

                        <a
                          href="/quote"
                          className="text-[#003023] font-semibold hover:text-[#f05010]"
                        >
                          Learn More →
                        </a>
                      </div>
                    </div>
                  );
                })}
            </div>

            {!loadingServices && servicesError && (
              <p className="text-center text-red-600">{servicesError}</p>
            )}
          </div>
        </section>

        {/* PROJECT GALLERY – FEATURED WORK */}
        <section className="py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <h2 className="text-center text-4xl md:text-5xl font-bold text-[#003023] mb-6">
              Featured Work
            </h2>
            <p className="text-center text-[#003023]/70 mb-12 max-w-2xl mx-auto">
              A snapshot of biogas systems, waste management, capacity building and
              construction projects we’ve delivered with farmers and partners across Uganda.
            </p>

            {loadingProjects && (
              <p className="text-center text-gray-600">Loading featured work…</p>
            )}

            {!loadingProjects && projectsError && (
              <p className="text-center text-red-600">{projectsError}</p>
            )}

            {!loadingProjects && !projectsError && featuredProjects.length === 0 && (
              <p className="text-center text-[#003023]/60">
                Featured projects will appear here soon.
              </p>
            )}

            {!loadingProjects && !projectsError && featuredProjects.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredProjects.map((project, index) => (
                    <ProjectCard
                      key={project.id || project.slug || index}
                      project={project}
                      index={index}
                    />
                  ))}
                </div>

                <div className="mt-10 flex justify-center">
                  <a
                    href="/projects"
                    className="px-8 py-3 rounded-xl border border-[#003023]/20 text-sm font-semibold text-[#003023] hover:bg-[#003023] hover:text-white transition"
                  >
                    View More Projects
                  </a>
                </div>
              </>
            )}
          </div>
        </section>

        {/* CTA BLOCK */}
        <section className="py-24 bg-[#003023] text-white">
          <div className="max-w-5xl mx-auto text-center px-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-lg md:text-xl text-white/80 mb-10">
              Transform your farm, business, or construction project with sustainable,
              modern solutions.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <a
                href="/quote"
                className="px-10 py-4 bg-[#f05010] rounded-2xl hover:bg-[#d6490e] transition"
              >
                Start Your Project
              </a>

              <a
                href="tel:+256783111015"
                className="px-10 py-4 border-2 border-white rounded-2xl hover:bg-white hover:text-[#003023] transition"
              >
                Call Us Now
              </a>
            </div>
          </div>
        </section>

        {/* TESTIMONIAL SLIDER */}
        <section className="py-28 bg-[#f6fef9]">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-[#003023] mb-16">
              What Our Clients Say
            </h2>

            <TestimonialSlider />
          </div>
        </section>

        {/* PROCESS – TREE STYLE ALTERNATING */}
        <section className="py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-[#003023] mb-20">
              Our Process
            </h2>

            <div className="relative max-w-5xl mx-auto">
              {/* Vertical Trunk Line */}
              <div
                className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[3px]
                              bg-gradient-to-b from-[#83c441]/40 via-[#f0b010]/40 to-[#f05010]/40
                              transform -translate-x-1/2"
              />

              <div className="space-y-20">
                {processSteps.map((step, index) => {
                  const isLeft = index % 2 === 0;

                  return (
                    <div key={index} className="relative">
                      {/* Desktop alternating */}
                      <div className="hidden md:grid md:grid-cols-2 md:gap-8 items-center">
                        {isLeft ? (
                          <>
                            <div className="flex justify-end pr-10">
                              <div className="bg-[#f6fef9] border border-[#83c441]/30 rounded-3xl shadow-md p-8 w-full max-w-md">
                                <p className="text-[#f05010] text-sm font-semibold mb-1">
                                  Step {step.step}
                                </p>
                                <h3 className="text-2xl font-bold text-[#003023] mb-2">
                                  {step.title}
                                </h3>
                                <p className="text-[#003023]/70">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                            <div></div>
                          </>
                        ) : (
                          <>
                            <div></div>
                            <div className="flex justify-start pl-10">
                              <div className="bg-[#f6fef9] border border-[#83c441]/30 rounded-3xl shadow-md p-8 w-full max-w-md">
                                <p className="text-[#f05010] text-sm font-semibold mb-1">
                                  Step {step.step}
                                </p>
                                <h3 className="text-2xl font-bold text-[#003023] mb-2">
                                  {step.title}
                                </h3>
                                <p className="text-[#003023]/70">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Mobile */}
                      <div className="md:hidden">
                        <div className="bg-[#f6fef9] border border-[#83c441]/30 rounded-3xl shadow-md p-8">
                          <p className="text-[#f05010] text-sm font-semibold mb-1">
                            Step {step.step}
                          </p>
                          <h3 className="text-2xl font-bold text-[#003023] mb-2">
                            {step.title}
                          </h3>
                          <p className="text-[#003023]/70">{step.description}</p>
                        </div>
                      </div>

                      {/* Node */}
                      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className="w-14 h-14 bg-white rounded-full border-[4px] border-[#003023]/70 shadow-lg flex items-center justify-center text-[#003023] font-bold">
                          {step.step}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA under Process */}
              <div className="text-center mt-20">
                <a
                  href="/quote"
                  className="px-10 py-4 bg-[#f05010] text-white font-semibold rounded-xl 
                            shadow-md hover:bg-[#d9470e] transition duration-300"
                >
                  Get Started Today →
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
