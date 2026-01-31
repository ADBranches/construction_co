// src/pages/About.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Seo from "../seo/Seo";
import {
  Target,
  Rocket,
  Users,
  Globe,
  Shield,
  Zap,
  TrendingUp,
  Heart,
  CheckCircle,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

function About() {
  const { hash } = useLocation();

  // Smooth scroll when using /about#section links from the navbar
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [hash]);

  // Each core value now has a motion image attached
  const coreValues = [
    {
      icon: Shield,
      title: "Integrity",
      description:
        "We act with transparency, accountability, and high ethical standards in all our work.",
      color: "from-emerald-500 to-teal-500",
      image: "/images/projects/farm-construction_03.webp",
    },
    {
      icon: Heart,
      title: "Empowerment",
      description:
        "We empower women, youth, and communities to drive their own sustainable development.",
      color: "from-orange-500 to-amber-500",
      image: "/images/projects/capacity-building_02.webp",
    },
    {
      icon: Zap,
      title: "Innovation",
      description:
        "We embrace creative, practical solutions in agriculture and energy to solve real community challenges.",
      color: "from-blue-500 to-cyan-500",
      image: "/images/projects/biodigester-installation_02.webp",
    },
    {
      icon: Globe,
      title: "Inclusivity",
      description:
        "We ensure our solutions benefit everyone, leaving no one behind in the transition to clean energy and smart farming.",
      color: "from-purple-500 to-pink-500",
      image: "/images/projects/farm-and-household-waste-management_02.webp",
    },
    {
      icon: Users,
      title: "Collaboration",
      description:
        "We partner with farmers, institutions, and sector players to scale impact and share knowledge.",
      color: "from-rose-500 to-red-500",
      image: "/images/projects/capacity-building_01.webp",
    },
  ];

  const objectives = [
    "Promote sustainable agriculture practices that are climate-resilient and environmentally friendly.",
    "Advance renewable energy solutions like biogas and solar for farms, homes, and institutions.",
    "Foster partnerships with NGOs, government structures, and private sector to scale sustainable initiatives.",
    "Educate and raise awareness on clean energy and climate-smart agriculture across Uganda.",
    "Enhance eco-friendly livelihoods by improving income, health, and environment for communities.",
  ];

  // Each audience card also gets its own photo now
  const targetMarkets = [
    {
      category: "Farmers & Rural Communities",
      items: [
        "Small and medium-scale farmers focused on growth and productivity",
        "Rural communities reliant on agriculture",
        "Communities with limited access to clean and sustainable energy",
      ],
      image: "/images/projects/pasture-establishment_01.webp",
    },
    {
      category: "Institutions & Learning",
      items: [
        "Schools, universities, and training centers",
        "NGOs and community organisations",
        "Research institutions working on agriculture and energy",
      ],
      image: "/images/projects/capacity-building_01.webp",
    },
    {
      category: "Partners & Agribusiness",
      items: [
        "Agribusinesses adopting sustainable practices",
        "Private sector companies in technology and energy",
        "Government agencies and development partners",
      ],
      image: "/images/projects/farm-construction_02.webp",
    },
  ];

  // Realistic timeline (no fake 2027 / Present)
  const timeline = [
    {
      year: "2025",
      event:
        "Brisk founded by a multidisciplinary   team to tackle agriculture and energy challenges across Uganda.",
      highlight: true,
    },
    {
      year: "2025–Now",
      event:
        "Started pilots on clean cooking, waste management and climate-smart agriculture in regions like Busoga, Teso, Karamoja, Acholi, Rwenzori and Buganda.",
    },
    {
      year: "Future",
      event:
        "Scaling biogas, solar and sustainable agriculture solutions with NGOs, ministries and private sector partners, sowing sustainability and harvesting hope for all.",
    },
  ];

  // NEW: rich gallery items with motion, overlay captions & tags
  const galleryItems = [
    {
      title: "Biodigester Installation on a Dairy Farm",
      tag: "Biogas System",
      description:
        "Designing and installing a biodigester that turns cow dung into clean cooking gas and organic fertiliser.",
      image: "/images/projects/biodigester-installation_01.webp",
      location: "Rural farm, Uganda",
    },
    {
      title: "Biogas Storage & Safety Training",
      tag: "Clean Cooking",
      description:
        "Farmers learning how to safely operate gas bags and biogas appliances for daily cooking.",
      image: "/images/projects/biodigester-installation_03.webp",
      location: "Farmer training centre",
    },
    {
      title: "Waste-to-Energy Plant Visit",
      tag: "Waste Management",
      description:
        "Exploring industrial-scale waste management and gas purification systems with local partners.",
      image: "/images/projects/farm-and-household-waste-management_03.webp",
      location: "Industrial site",
    },
    {
      title: "Farmer Field Training Session",
      tag: "Capacity Building",
      description:
        "Hands-on demonstration on climate-smart livestock housing and barn design for improved animal welfare.",
      image: "/images/projects/capacity-building_01.webp",
      location: "Training farm",
    },
    {
      title: "Eco-Friendly Farm Structures",
      tag: "Construction",
      description:
        "Designing strong, ventilated structures that support both animal comfort and biogas integration.",
      image: "/images/projects/farm-construction_02.webp",
      location: "Construction site",
    },
    {
      title: "Pasture Plot Establishment",
      tag: "Pasture Management",
      description:
        "Supporting farmers to establish improved pastures that boost milk and meat production.",
      image: "/images/projects/pasture-establishment_02.webp",
      location: "Pasture demonstration field",
    },
  ];

  const faqs = [
    {
      question: "What does Brisk Farm Solutions and Construction Company do?",
      answer:
        "We are a Ugandan, women-led company providing sustainable agriculture, biogas and clean energy solutions, and eco-friendly construction for farms, institutions and communities.",
    },
    {
      question: "Where do you operate?",
      answer:
        "We are based in Kampala along Ntinda–Kigoowa Road, Mai Mall, and we work with farmers and partners across multiple regions in Uganda, including Busoga, Teso, Karamoja, Acholi, Rwenzori and Buganda.",
    },
    {
      question: "How can I start a project with Brisk?",
      answer:
        "You can request a quote directly from our website, call us on +256 783 111 015, or visit the Contact page to share details about your farm, institution or project.",
    },
  ];

  return (
    <>
      <Seo
        title="About Us | Brisk Farm Solutions & Construction Company"
        description="Learn about Brisk Farm Solutions and Construction Company, a   Ugandan company advancing sustainable agriculture, biogas, clean energy and modern construction."
      />

      {/* HERO / COMPANY */}
      <section
        id="company"
        className="relative overflow-hidden bg-gradient-to-br from-[#003023] via-[#004633] to-[#002219] rounded-3xl mb-16"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#ffffff0d,_transparent_60%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8"
              >
                <div className="w-2 h-2 bg-[#f05010] rounded-full animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-widest text-white">
                    • Agro-Energy • Construction
                </span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Sowing <span className="text-[#83c441]">Sustainability</span>,{" "}
                Harvesting <span className="text-[#f05010]">Hope</span> for All
              </h1>

              <p className="text-xl text-white/90 mb-8 max-w-2xl">
                Brisk Farm Solutions and Construction Company is a Ugandan,
                 , multi-disciplinary company advancing sustainable
                agriculture and clean energy – from biodigesters and farm
                structures to livestock systems and eco-friendly construction.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-[#f05010]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">20+</div>
                    <div className="text-sm text-white/70">
                      Projects & Pilots Delivered
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#83c441]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">100+</div>
                    <div className="text-sm text-white/70">
                      Farmers & Households Reached
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vision & Mission cards */}
            <div className="space-y-6">
              <motion.div
                id="values"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#f05010] to-[#ff6b35] rounded-2xl flex items-center justify-center">
                    <Rocket className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Our Vision</h3>
                    <div className="w-12 h-1 bg-[#f05010] rounded-full mt-2" />
                  </div>
                </div>
                <p className="text-white/90 leading-relaxed">
                  Contributing to a sustainable future where agriculture and
                  energy thrive in harmony with the environment through
                  innovation, education, and partnership.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#83c441] to-[#a0d64b] rounded-2xl flex items-center justify-center">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      Our Mission
                    </h3>
                    <div className="w-12 h-1 bg-[#83c441] rounded-full mt-2" />
                  </div>
                </div>
                <p className="text-white/90 leading-relaxed">
                  We innovate and partner to advance sustainable agriculture
                  practices and renewable energy solutions, enhancing food
                  security, promoting eco-friendly livelihoods, and contributing
                  to a greener Uganda and beyond.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section
        id="story"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20"
      >
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#003023] mb-4">
              Our Story
            </h2>
            <p className="text-lg text-[#003023]/80 mb-4">
              In June 2025, a multidisciplinary team of passionate women came
              together to form Brisk Farm Solutions and Construction Company.
              Inspired by energy poverty, degrading environments, and declining
              agricultural productivity among smallholder farmers, they decided
              to create hope by sowing sustainable practices, skills, and
              technologies across Uganda.
            </p>
            <p className="text-lg text-[#003023]/80 mb-4">
              Guided by sector experts in waste management, renewable energy,
              biofertiliser and agricultural mechanisation, Brisk is building a
              bridge between research, innovation, and practical solutions that
              farmers and communities can use today.
            </p>
            <p className="text-lg text-[#003023]/80">
              Today, the company works with youth, women, and institutions to
              promote clean cooking, climate-smart agriculture, and sustainable
              livelihoods—one project and one community at a time.
            </p>
          </div>

          {/* Story image strip */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl overflow-hidden shadow-lg"
            >
              <img
                src="/images/projects/biodigester-installation_01.webp"
                alt="Biodigester system"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl overflow-hidden shadow-lg"
            >
              <img
                src="/images/projects/biodigester-installation_03.webp"
                alt="Biogas storage bag"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl overflow-hidden shadow-lg col-span-2"
            >
              <img
                src="/images/projects/capacity-building_01.webp"
                alt="Farmer training"
                className="w-full h-56 object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CORE VALUES – now with small motion image footer per card */}
      <section
        id="values-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#003023] mb-4">
            Our <span className="text-[#f05010]">Core</span> Values
          </h2>
          <p className="text-lg text-[#003023]/70">
            Principles that shape how we design, build, and serve every
            community we work with.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreValues.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -6 }}
                className="group relative bg-white rounded-3xl border border-[#003023]/10 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-3xl" />
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="mb-4">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#003023] mb-2">
                      {value.title}
                    </h3>
                    <p className="text-[#003023]/70 text-sm">
                      {value.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-auto mb-2">
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                    <Star className="w-4 h-4 text-gray-300 group-hover:text-amber-400 transition-colors" />
                  </div>

                  {/* Motion image footer */}
                  <motion.div
                    className="overflow-hidden rounded-2xl h-24"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.img
                      src={value.image}
                      alt={value.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.4 }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* OBJECTIVES & JOURNEY */}
      <section
        id="journey"
        className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20"
      >
        {/* Objectives card */}
        <div className="bg-gradient-to-br from-[#003023] to-[#004633] rounded-3xl p-8 text-white">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
              <Target className="w-7 h-7 text-[#f05010]" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Our Objectives</h3>
              <div className="w-12 h-1 bg-[#f05010] rounded-full mt-2" />
            </div>
          </div>

          <div className="space-y-4">
            {objectives.map((objective, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-8 h-8 bg-[#f05010] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <p className="text-white/90 text-sm md:text-base">
                  {objective}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Journey timeline */}
        <div className="bg-white rounded-3xl border border-[#003023]/10 p-8 shadow-lg">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-[#83c441] to-[#a0d64b] rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#003023]">
                Our Journey
              </h3>
              <div className="w-12 h-1 bg-[#83c441] rounded-full mt-2" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#83c441] to-[#f05010]" />

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="relative flex items-start gap-6">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      item.highlight
                        ? "bg-gradient-to-r from-[#f05010] to-[#ff6b35] text-white"
                        : "bg-white border-2 border-[#83c441]"
                    }`}
                  >
                    <span
                      className={`font-bold ${
                        item.highlight ? "text-[11px]" : "text-[10px]"
                      }`}
                    >
                      {item.year}
                    </span>
                  </div>
                  <div className="pt-2">
                    <p
                      className={`font-semibold text-sm md:text-base ${
                        item.highlight ? "text-[#f05010]" : "text-[#003023]"
                      }`}
                    >
                      {item.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE SERVE – each card gets its own motion image */}
      <section
        id="markets"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#003023] mb-4">
            Who We <span className="text-[#f05010]">Serve</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {targetMarkets.map((market, index) => (
            <motion.div
              key={market.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-white rounded-3xl border border-[#003023]/10 p-6 shadow-lg hover:shadow-xl transition-all flex flex-col"
            >
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#003023] to-[#004633] rounded-xl flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#003023]">
                  {market.category}
                </h3>
              </div>

              <ul className="space-y-2 mb-4 flex-1">
                {market.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-[#83c441] rounded-full" />
                    <span className="text-[#003023]/80">{item}</span>
                  </li>
                ))}
              </ul>

              <motion.div
                className="overflow-hidden rounded-2xl h-24"
                whileHover={{ scale: 1.02 }}
              >
                <motion.img
                  src={market.image}
                  alt={market.category}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* GALLERY – motion cards with overlapping captions */}
      <section
        id="gallery"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#003023] mb-4">
            Our Work in <span className="text-[#f05010]">Pictures</span>
          </h2>
          <p className="text-lg text-[#003023]/70">
            Motion moments from the field – biodigesters, farm structures,
            trainings and clean energy in action.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative rounded-3xl overflow-hidden shadow-xl group"
            >
              {/* Motion image */}
              <motion.img
                src={item.image}
                alt={item.title}
                className="w-full h-64 object-cover"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.5 }}
              />

              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

              {/* Tag chip */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-[#003023] shadow-sm">
                  {item.tag}
                </span>
              </div>

              {/* Caption – overlapping & animated */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-4 text-white"
                initial={{ y: 20, opacity: 0.9 }}
                whileHover={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-xs text-white/90 mb-1">{item.description}</p>
                <p className="text-[11px] text-white/70">{item.location}</p>
              </motion.div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section
        id="faqs"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20"
      >
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#003023] mb-4">
            Frequently Asked <span className="text-[#f05010]">Questions</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl border border-[#003023]/10 p-6 shadow-md"
            >
              <h3 className="font-semibold text-[#003023] mb-2 text-sm md:text-base">
                {faq.question}
              </h3>
              <p className="text-sm text-[#003023]/75">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-gradient-to-r from-[#003023] to-[#004633] rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#ffffff1a,_transparent_60%)]" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Sow Sustainability and Harvest Hope?
            </h3>
            <p className="text-white/90 mb-8 text-lg">
              Partner with Brisk Farm Solutions and Construction Company to
              bring clean energy, smart agriculture, and modern construction to
              your farm, institution, or community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/quote"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#003023] font-semibold rounded-xl hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
              >
                Start Your Project
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                Talk to Our Team
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
