// src/pages/Home.jsx
import Seo from "../seo/Seo";
import Hero from "../components/Hero.jsx";
import { 
  Leaf, 
  Zap, 
  Building, 
  Target, 
  Users, 
  Shield,
  TrendingUp,
  CheckCircle
} from "lucide-react";

function Home() {
  const services = [
    {
      icon: Leaf,
      title: "Smart Farm Systems",
      description: "Integrated crop, livestock, and water management systems designed to maximize productivity and resilience.",
      features: ["IoT Monitoring", "Precision Agriculture", "Automated Irrigation"],
      color: "from-emerald-50 to-teal-50",
      borderColor: "border-emerald-200"
    },
    {
      icon: Zap,
      title: "Biogas & Waste-to-Energy",
      description: "Custom biogas digesters and renewable energy solutions for sustainable homes, farms, and institutions.",
      features: ["Energy Efficiency", "Waste Management", "Cost Savings"],
      color: "from-amber-50 to-orange-50",
      borderColor: "border-amber-200"
    },
    {
      icon: Building,
      title: "Construction & Civil Works",
      description: "Modern farm structures, housing, and civil works delivered with engineering precision.",
      features: ["Quality Materials", "Timely Delivery", "Sustainable Design"],
      color: "from-slate-50 to-blue-50",
      borderColor: "border-slate-200"
    }
  ];

  const stats = [
    { value: "100+", label: "Projects Completed", icon: Target },
    { value: "50+", label: "Happy Clients", icon: Users },
    { value: "10+", label: "Years of Experience", icon: Shield },
    { value: "98%", label: "Satisfaction Rate", icon: TrendingUp }
  ];

  return (
    <>
      <Seo
        title="Modern Farm & Construction Solutions | Brisk Farm"
        description="Transforming agriculture and construction with sustainable, innovative solutions for Uganda's farms, homes, and communities."
      />

      <div className="min-h-screen bg-white">
        <Hero />

        {/* Main page sections with vertical spacing */}
        <main className="space-y-24 md:space-y-28">
          {/* Stats Section */}
          <section className="py-12 md:py-16 bg-gradient-to-b from-white to-[#f8fafc]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div 
                      key={index}
                      className="text-center group"
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 md:w-18 md:h-18 bg-gradient-to-br from-[#003023] to-[#004633] rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-2xl md:text-4xl font-bold text-[#003023] mb-1 md:mb-2">
                        {stat.value}
                      </div>
                      <div className="text-xs md:text-sm text-[#003023]/70 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section id="services" className="py-16 md:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section Header */}
              <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
                <div className="inline-flex items-center gap-2 bg-[#f6fef9] border border-[#83c441]/30 text-[#003023] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-5 md:mb-6">
                  <span className="w-2 h-2 bg-[#f05010] rounded-full animate-pulse"></span>
                  Our Core Solutions
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#003023] mb-3 md:mb-4">
                  Integrated Solutions for <span className="text-[#f05010]">Modern</span> Farming
                </h2>
                <p className="text-base md:text-lg text-[#003023]/70 leading-relaxed">
                  We combine engineering excellence with practical innovation to deliver sustainable results.
                </p>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                {services.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <div 
                      key={index}
                      className="group relative"
                    >
                      {/* Soft gradient background */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${service.color} rounded-3xl transform group-hover:scale-105 transition-transform duration-500`}
                      />

                      {/* Foreground card */}
                      <div
                        className={`relative bg-white/95 backdrop-blur-sm border ${service.borderColor} rounded-3xl p-7 md:p-9 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col`}
                      >
                        <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#003023] to-[#004633] rounded-xl mb-5 md:mb-6 group-hover:rotate-3 transition-transform duration-300">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        
                        <h3 className="text-lg md:text-xl font-bold text-[#003023] mb-2.5 md:mb-3 group-hover:text-[#f05010] transition-colors">
                          {service.title}
                        </h3>
                        
                        <p className="text-sm md:text-base text-[#003023]/75 mb-5 md:mb-6 leading-relaxed">
                          {service.description}
                        </p>
                        
                        <div className="space-y-3 md:space-y-3.5 flex-1">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 mt-0.5 text-[#83c441]" />
                              <span className="text-sm md:text-sm text-[#003023]/80 leading-snug">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-7 md:mt-8 pt-5 md:pt-6 border-t border-[#003023]/10">
                          <a 
                            href="/quote"
                            className="inline-flex items-center text-sm font-semibold text-[#003023] hover:text-[#f05010] transition-colors group/link"
                          >
                            Get Started
                            <svg 
                              className="w-4 h-4 ml-2 transform group-hover/link:translate-x-1 transition-transform" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA Section */}
              <div className="mt-16 md:mt-20 text-center">
                <div className="bg-gradient-to-r from-[#003023] to-[#004633] rounded-3xl p-10 md:p-14 relative overflow-hidden">
                  {/* Soft pattern overlay */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_#ffffff33,_transparent_55%)]" />
                  
                  <div className="relative z-10 max-w-2xl mx-auto space-y-5 md:space-y-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                      Ready to Transform Your Project?
                    </h3>
                    <p className="text-sm md:text-base text-white/90 leading-relaxed">
                      Join hundreds of satisfied clients who trust us with their farm and construction needs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                      <a 
                        href="/quote"
                        className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#003023] font-semibold rounded-xl hover:bg-gray-100 transition-all hover:scale-105 shadow-lg text-sm md:text-base"
                      >
                        Start Your Project
                      </a>
                      <a 
                        href="tel:+256783111015"
                        className="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-sm md:text-base"
                      >
                        Call Us Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Process Section */}
          <section className="py-16 md:py-20 bg-[#f8fafc]">
            <div className="max-w-6xl md:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-[#003023] mb-3 md:mb-4">
                  How We <span className="text-[#f05010]">Work</span>
                </h2>
                <p className="text-base md:text-lg text-[#003023]/70 leading-relaxed">
                  A streamlined process from concept to completion.
                </p>
              </div>

              <div className="relative space-y-10 md:space-y-0">
                {/* Timeline Line */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#83c441] to-[#f05010] transform -translate-x-1/2" />
                
                {/* Process Steps */}
                {[
                  {
                    step: "01",
                    title: "Consultation",
                    description: "We discuss your needs, site conditions, and objectives.",
                    icon: "💬"
                  },
                  {
                    step: "02",
                    title: "Design & Planning",
                    description: "Our engineers create detailed plans and BOQs.",
                    icon: "📐"
                  },
                  {
                    step: "03",
                    title: "Site Preparation",
                    description: "We prepare the site and mobilize resources.",
                    icon: "🚜"
                  },
                  {
                    step: "04",
                    title: "Execution",
                    description: "Professional implementation with quality control.",
                    icon: "⚡"
                  },
                  {
                    step: "05",
                    title: "Handover & Support",
                    description: "Project delivery and ongoing maintenance support.",
                    icon: "🎯"
                  }
                ].map((process, index) => (
                  <div 
                    key={index}
                    className={`relative flex flex-col md:flex-row items-center mb-10 md:mb-24 last:mb-0 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Desktop Timeline Dot */}
                    <div className="hidden md:flex absolute left-1/2 top-1/2 w-8 h-8 bg-white border-4 border-[#003023] rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10" />
                    
                    {/* Mobile Timeline Dot */}
                    <div className="md:hidden absolute left-8 top-0 w-8 h-8 bg-white border-4 border-[#003023] rounded-full transform -translate-y-1/2 z-10" />
                    
                    {/* Content */}
                    <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                      <div className="bg-white rounded-2xl p-7 md:p-9 shadow-lg border border-[#003023]/10">
                        <div className="flex items-center gap-4 mb-3 md:mb-4 md:justify-start">
                          <div className="text-2xl md:text-3xl">{process.icon}</div>
                          <div className="text-left md:text-left">
                            <span className="text-xs md:text-sm font-semibold text-[#f05010] tracking-wide">
                              STEP {process.step}
                            </span>
                            <h3 className="text-lg md:text-xl font-bold text-[#003023]">
                              {process.title}
                            </h3>
                          </div>
                        </div>
                        <p className="text-sm md:text-base text-[#003023]/70 leading-relaxed">
                          {process.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default Home;
