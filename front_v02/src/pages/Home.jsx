// src/pages/Home.jsx
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Seo from "../seo/Seo";
import Hero from "../components/Hero.jsx";
import { Leaf, Zap, Building } from "lucide-react";
import ProjectCard from "../components/ProjectCard.jsx";
import ServicesStore from "../lib/servicesStore";
import ProjectsStore from "../lib/projectsStore";
import ServiceCard from "../components/ServiceCard.jsx";

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

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index]);

  const t = testimonials[index];

  return (
    <div className="relative max-w-4xl mx-auto text-center px-6">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 px-6 md:px-8 py-8 md:py-9">
        <p className="text-lg md:text-xl text-[#003023] italic leading-relaxed">
          “{t.quote}”
        </p>
        <div className="mt-5">
          <p className="text-base md:text-lg font-semibold text-[#003023]">
            {t.name}
          </p>
          <p className="text-xs md:text-sm text-[#003023]/70">{t.role}</p>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-4 gap-2.5">
        {testimonials.map((_, i) => (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition ${
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

      const fetchServices = () => {
        try {
          const items = ServicesStore.getFeatured(3);
          if (mounted) {
            setServices(items);
            setLoadingServices(false);
          }
        } catch (err) {
          if (mounted) {
            setServicesError(err.message || "Failed to load services.");
            setLoadingServices(false);
          }
        }
      };

      const fetchProjects = () => {
        try {
          const items = ProjectsStore.getFeatured(6);
          if (mounted) {
            setProjects(items);
            setLoadingProjects(false);
          }
        } catch (err) {
          if (mounted) {
            setProjectsError(err.message || "Failed to load projects.");
            setLoadingProjects(false);
          }
        }
      };

      fetchServices();
      fetchProjects();

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

  // Featured Work: show minimum 3 projects (if available)
  const featuredProjects = (projects || []).slice(0, 3);

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
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#003023] mb-10">
              Our Pillars of Excellence
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                  className="bg-[#f6fef9] border border-[#83c441]/30 rounded-3xl p-7 md:p-8 shadow-sm hover:shadow-xl transition"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#003023] flex items-center justify-center mx-auto mb-5">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-[#003023] mb-2.5">
                    {item.title}
                  </h3>

                  <p className="text-sm md:text-base text-[#003023]/70">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED SERVICES */}
        <section className="py-16 md:py-20 bg-[#f6fef9]" id="services">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <h2 className="text-center text-3xl md:text-4xl font-bold text-[#003023] mb-4">
              Featured Services
            </h2>
            <p className="text-center text-sm md:text-base text-[#003023]/70 max-w-2xl mx-auto mb-10">
              A snapshot of the core Brisk Farm services we deliver most often.
              Tap a service to see the full package.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loadingServices && (
              <p className="col-span-full text-center text-gray-600">
                Loading services…
              </p>
            )}

            {!loadingServices &&
              !servicesError &&
              featuredServices.map((service, index) => {
                const Icon = service.icon;

                // hero image from seed (you already set hero_image_url on each service)
                const imageUrl = service.hero_image_url || null;

                return (
                  <ServiceCard
                    key={service.id || index}
                    icon={Icon}
                    title={service.name}
                    description={
                      service.short_description || service.description || ""
                    }
                    tagline={service.tagline}
                    // we don’t have highlights yet, so this will be an empty array for now
                    features={[
                      service.highlight_1,
                      service.highlight_2,
                      service.highlight_3,
                    ].filter(Boolean)}
                    color={index === 0 ? "emerald" : index === 1 ? "orange" : "blue"}
                    delay={index * 0.05}
                    slug={service.slug}
                    imageUrl={imageUrl}
                    galleryImages={service.gallery_images}
                  />
                );
              })}
          </div>


            {!loadingServices && servicesError && (
              <p className="text-center text-red-600 mt-5 text-sm">
                {servicesError}
              </p>
            )}

            {!loadingServices && !servicesError && featuredServices.length > 0 && (
              <div className="mt-8 text-center">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 rounded-2xl border border-[#003023]/15 bg-white px-8 py-3 text-sm font-semibold text-[#003023] hover:bg-[#003023] hover:text-white transition"
                >
                  View all services
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* PROJECT GALLERY – FEATURED WORK */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <h2 className="text-center text-3xl md:text-4xl font-bold text-[#003023] mb-4">
              Featured Work
            </h2>
            <p className="text-center text-sm md:text-base text-[#003023]/70 mb-10 max-w-2xl mx-auto">
              A snapshot of biogas systems, waste management, capacity building and
              construction projects we’ve delivered with farmers and partners across
              Uganda.
            </p>

            {loadingProjects && (
              <p className="text-center text-gray-600 text-sm">
                Loading featured work…
              </p>
            )}

            {!loadingProjects && projectsError && (
              <p className="text-center text-red-600 text-sm">
                {projectsError}
              </p>
            )}

            {!loadingProjects &&
              !projectsError &&
              featuredProjects.length === 0 && (
                <p className="text-center text-[#003023]/60 text-sm">
                  Featured projects will appear here soon.
                </p>
              )}

            {!loadingProjects &&
              !projectsError &&
              featuredProjects.length > 0 && (
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

                  <div className="mt-8 flex justify-center">
                    <a
                      href="/projects"
                      className="px-9 py-3 rounded-xl border border-[#003023]/20 text-sm font-semibold text-[#003023] hover:bg-[#003023] hover:text-white transition"
                    >
                      View More Projects
                    </a>
                  </div>
                </>
              )}
          </div>
        </section>

        {/* MAIN CTA BLOCK */}
        <section className="py-16 md:py-20 bg-[#003023] text-white">
          <div className="max-w-7xl mx-auto text-center px-6 md:px-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-5">
              Ready to Start Your Project?
            </h2>
            <p className="text-base md:text-lg text-white/80 mb-8 max-w-3xl mx-auto">
              Transform your farm, business, or construction project with sustainable,
              modern solutions.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/quote"
                className="px-9 py-3.5 bg-[#f05010] rounded-2xl text-sm md:text-base font-semibold hover:bg-[#d6490e] transition"
              >
                Start Your Project
              </a>

              <a
                href="tel:+256783111015"
                className="px-9 py-3.5 border-2 border-white rounded-2xl text-sm md:text-base font-semibold hover:bg-white hover:text-[#003023] transition"
              >
                Call Us Now
              </a>
            </div>
          </div>
        </section>

        {/* TESTIMONIAL SLIDER */}
        <section className="py-16 md:py-20 bg-[#f6fef9]">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#003023] mb-12">
              What Our Clients Say
            </h2>

            <TestimonialSlider />
          </div>
        </section>

        {/* PROCESS – TREE STYLE ALTERNATING */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#003023] mb-16">
              Our Process
            </h2>

            <div className="relative max-w-5xl mx-auto">
              {/* Vertical Trunk Line */}
              <div
                className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[3px]
                              bg-gradient-to-b from-[#83c441]/40 via-[#f0b010]/40 to-[#f05010]/40
                              transform -translate-x-1/2"
              />

              <div className="space-y-14">
                {processSteps.map((step, index) => {
                  const isLeft = index % 2 === 0;

                  return (
                    <div key={index} className="relative">
                      {/* Desktop alternating */}
                      <div className="hidden md:grid md:grid-cols-2 md:gap-6 items-center">
                        {isLeft ? (
                          <>
                            <div className="flex justify-end pr-8">
                              <div className="bg-[#f6fef9] border border-[#83c441]/30 rounded-3xl shadow-md p-6 w-full max-w-md">
                                <p className="text-[#f05010] text-xs md:text-sm font-semibold mb-1">
                                  Step {step.step}
                                </p>
                                <h3 className="text-xl md:text-2xl font-bold text-[#003023] mb-1.5">
                                  {step.title}
                                </h3>
                                <p className="text-sm text-[#003023]/70">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                            <div></div>
                          </>
                        ) : (
                          <>
                            <div></div>
                            <div className="flex justify-start pl-8">
                              <div className="bg-[#f6fef9] border border-[#83c441]/30 rounded-3xl shadow-md p-6 w-full max-w-md">
                                <p className="text-[#f05010] text-xs md:text-sm font-semibold mb-1">
                                  Step {step.step}
                                </p>
                                <h3 className="text-xl md:text-2xl font-bold text-[#003023] mb-1.5">
                                  {step.title}
                                </h3>
                                <p className="text-sm text-[#003023]/70">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Mobile */}
                      <div className="md:hidden">
                        <div className="bg-[#f6fef9] border border-[#83c441]/30 rounded-3xl shadow-md p-6">
                          <p className="text-[#f05010] text-xs font-semibold mb-1">
                            Step {step.step}
                          </p>
                          <h3 className="text-xl font-bold text-[#003023] mb-1.5">
                            {step.title}
                          </h3>
                          <p className="text-sm text-[#003023]/70">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Node */}
                      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className="w-12 h-12 bg-white rounded-full border-[3px] border-[#003023]/70 shadow-lg flex items-center justify-center text-[#003023] text-sm md:text-base font-bold">
                          {step.step}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
