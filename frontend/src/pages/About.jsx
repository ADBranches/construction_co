// src/pages/About.jsx
import Seo from "../seo/Seo";
import { 
  Target, 
  Rocket, 
  Users, 
  Award, 
  Globe, 
  Shield,
  Zap,
  Leaf,
  Building,
  TrendingUp,
  Heart,
  CheckCircle,
  Star
} from "lucide-react";
import { motion } from "framer-motion";

function About() {
  const coreValues = [
    {
      icon: Leaf,
      title: "Sustainability",
      description: "We champion renewable energy, eco-friendly farming, and responsible use of natural resources.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We apply modern technologies, smart farming systems, and continuous improvement in every project.",
      color: "from-orange-500 to-amber-500"
    },
    {
      icon: Shield,
      title: "Integrity",
      description: "We operate with transparency, honesty, and strong ethical standards across all client engagements.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Community Empowerment",
      description: "We train, support, and uplift farmers, institutions, and communities through practical knowledge.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Award,
      title: "Quality & Reliability",
      description: "We deliver durable, efficient, and professional services that clients can trust for long-term success.",
      color: "from-rose-500 to-red-500"
    }
  ];

  const objectives = [
    "Boost farm productivity through mechanization and practical innovation",
    "Coordinate farm trainings, tours, and learning programs for farmers",
    "Expand biogas technologies for energy, fertilizer, and waste management",
    "Advocate for policies supporting agriculture and renewable energy",
    "Implement sustainable construction methods across all projects"
  ];

  const targetMarkets = [
    {
      category: "Farmers & Agriculture",
      items: ["Small to large-scale farmers", "Commercial livestock enterprises", "Agricultural cooperatives"]
    },
    {
      category: "Institutions & Organizations",
      items: ["Schools & Universities", "Health centers", "NGOs & Community groups"]
    },
    {
      category: "Construction & Development",
      items: ["Real estate developers", "Government agencies", "Urban & rural households"]
    }
  ];

  const timeline = [
    { year: "2025", event: "Company founded by Muhindo Gideon", highlight: true },
    { year: "2026", event: "Expanded to full-scale operations" },
    { year: "2027", event: "Launched nationwide services" },
    { year: "Present", event: "Leading agro-construction solutions provider" }
  ];

  return (
    <>
      <Seo
        title="About Us | Brisk Farm Solutions & Construction"
        description="Discover our vision, mission, and commitment to sustainable agriculture and modern construction solutions across Uganda."
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#003023] via-[#004633] to-[#002219] rounded-3xl mb-16">
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
                  Our Story & Vision
                </span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Building <span className="text-[#83c441]">Sustainable</span> Futures Together
              </h1>
              
              <p className="text-xl text-white/90 mb-8 max-w-2xl">
                We are an integrated agro-systems and construction company 
                focused on biogas, livestock, crops, and sustainable building 
                solutions that empower communities across Uganda.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-[#f05010]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">50+</div>
                    <div className="text-sm text-white/70">Projects Completed</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#83c441]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">100+</div>
                    <div className="text-sm text-white/70">Happy Clients</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vision & Mission Cards */}
            <div className="space-y-6">
              <motion.div
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
                  A future where sustainable agriculture and modern construction 
                  work together to uplift communities everywhere.
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
                    <h3 className="text-2xl font-bold text-white">Our Mission</h3>
                    <div className="w-12 h-1 bg-[#83c441] rounded-full mt-2" />
                  </div>
                </div>
                <p className="text-white/90 leading-relaxed">
                  To design and build integrated agro-systems that are productive, 
                  sustainable, and scalable for lasting impact.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#003023] mb-4">
            Our <span className="text-[#f05010]">Core</span> Values
          </h2>
          <p className="text-lg text-[#003023]/70">
            Principles that guide every decision and project we undertake
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
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative bg-white rounded-3xl border border-[#003023]/10 p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-3xl" />
                <div className="relative z-10">
                  <div className="mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#003023] mb-3">
                      {value.title}
                    </h3>
                    <p className="text-[#003023]/70">
                      {value.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                    <Star className="w-4 h-4 text-gray-300 group-hover:text-amber-400 transition-colors" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Objectives & Timeline */}
      <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        {/* Objectives */}
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
                <p className="text-white/90">{objective}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-3xl border border-[#003023]/10 p-8 shadow-lg">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-[#83c441] to-[#a0d64b] rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#003023]">Our Journey</h3>
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
                    <span className={`font-bold ${item.highlight ? "text-sm" : "text-xs"}`}>
                      {item.year}
                    </span>
                  </div>
                  <div className="pt-2">
                    <p
                      className={`font-semibold ${
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
      </div>

      {/* Target Markets */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#003023] mb-4">
            Who We <span className="text-[#f05010]">Serve</span>
          </h2>
          <p className="text-lg text-[#003023]/70">
            We work with diverse clients across the agricultural and construction ecosystem
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {targetMarkets.map((market, index) => (
            <motion.div
              key={market.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-3xl border border-[#003023]/10 p-8 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#003023] to-[#004633] rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#003023]">
                  {market.category}
                </h3>
              </div>
              
              <ul className="space-y-3">
                {market.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#83c441] rounded-full" />
                    <span className="text-[#003023]/80">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-gradient-to-r from-[#003023] to-[#004633] rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#ffffff1a,_transparent_60%)]" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Build Your Sustainable Future?
            </h3>
            <p className="text-white/90 mb-8 text-lg">
              Join hundreds of satisfied clients who trust us with their farm 
              and construction projects.
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
                Contact Our Team
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
