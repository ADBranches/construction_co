// src/pages/Quote.jsx
import { useState } from "react";
import api from "../lib/apiClient.js";
import PrimaryButton from "../components/ui/PrimaryButton.jsx";
import Seo from "../seo/Seo.jsx";
import { 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle, 
  FileText,
  MapPin,
  DollarSign,
  Building
} from "lucide-react";

function Quote() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    project_type: "",
    budget_range: "",
    location: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback("");
    setFeedbackType("");

    try {
      await api.post("/api/v1/inquiries", form);
      setFeedbackType("success");
      setFeedback(
        "Thank you! Your request has been submitted. Our team will review it and get back to you within 24 hours."
      );
      setForm({
        full_name: "",
        email: "",
        phone: "",
        project_type: "",
        budget_range: "",
        location: "",
        message: "",
      });
    } catch (err) {
      setFeedbackType("error");
      setFeedback(
        err?.message ||
          "Unable to submit your request at the moment. Please try again or contact us directly."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    {
      number: "01",
      title: "Share Details",
      description: "Tell us about your project, location, and budget range.",
      icon: FileText
    },
    {
      number: "02",
      title: "We Review",
      description: "Our engineering team manually evaluates every request.",
      icon: CheckCircle
    },
    {
      number: "03",
      title: "We Respond",
      description: "Get expert guidance, quotes, or site visit proposals.",
      icon: Clock
    }
  ];

  const projectTags = [
    "Biogas & Waste-to-Energy",
    "Smart Farm Systems",
    "Livestock Housing",
    "Farm Infrastructure",
    "Civil Works",
    "Irrigation Systems"
  ];

  return (
    <>
      <Seo
        title="Request a Quote | Brisk Farm Solutions"
        description="Get expert guidance for your farm or construction project. Share details and receive tailored solutions from our engineering team."
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#f6fef9] border border-[#83c441]/30 text-[#003023] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-[#f05010] rounded-full animate-pulse"></span>
            Get a Tailored Quote
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#003023] mb-4 leading-tight">
            Transform Your <span className="text-[#f05010]">Farm</span> or <span className="text-[#83c441]">Construction</span> Project
          </h1>
          
          <p className="text-lg text-[#003023]/70 max-w-3xl mx-auto">
            Share details about your biogas system, livestock unit, or construction work. 
            Our engineering team provides expert guidance and tailored solutions.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.number}
                className="relative group"
              >
                <div className="bg-white border border-[#003023]/10 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#003023] to-[#004633] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {step.number}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-5 h-5 text-[#f05010]" />
                        <h3 className="font-bold text-[#003023] text-lg">{step.title}</h3>
                      </div>
                      <p className="text-sm text-[#003023]/60">{step.description}</p>
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 w-6 h-0.5 bg-gradient-to-r from-[#003023]/20 to-transparent translate-x-full -translate-y-1/2"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact & Info Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-[#003023] via-[#004633] to-[#003023] rounded-2xl p-8 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f05010]/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#83c441]/10 rounded-full -translate-x-12 translate-y-12"></div>
              
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-4">Why Choose Brisk Farm?</h2>
                <p className="text-white/80 mb-6">
                  We combine engineering precision with practical field experience to deliver 
                  integrated agro-systems that work perfectly on the ground.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-[#83c441]" />
                    </div>
                    <span className="text-sm">Site Visits & Assessments</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-[#83c441]" />
                    </div>
                    <span className="text-sm">Detailed BOQs & Plans</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-[#83c441]" />
                    </div>
                    <span className="text-sm">Ongoing Design Support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Tags */}
            <div className="bg-white border border-[#003023]/10 rounded-2xl p-6">
              <h3 className="font-semibold text-[#003023] mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-[#f05010]" />
                Project Types We Handle
              </h3>
              <div className="flex flex-wrap gap-2">
                {projectTags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-[#f6fef9] border border-[#83c441]/20 text-[#003023] hover:border-[#83c441]/40 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-br from-[#f6fef9] to-white border border-[#83c441]/20 rounded-2xl p-6">
              <h3 className="font-semibold text-[#003023] mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#f05010]" />
                Prefer Direct Contact?
              </h3>
              <div className="space-y-4">
                <a 
                  href="tel:+256783111015"
                  className="flex items-center gap-3 text-[#003023] hover:text-[#f05010] transition-colors group"
                >
                  <div className="w-10 h-10 bg-[#003023]/5 rounded-lg flex items-center justify-center group-hover:bg-[#f05010]/10">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-[#003023]/60">Call / WhatsApp</p>
                    <p className="font-semibold">+256 783 111 015</p>
                  </div>
                </a>
                
                <a 
                  href="mailto:briskfarmsolutions@gmail.com"
                  className="flex items-center gap-3 text-[#003023] hover:text-[#f05010] transition-colors group"
                >
                  <div className="w-10 h-10 bg-[#003023]/5 rounded-lg flex items-center justify-center group-hover:bg-[#f05010]/10">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-[#003023]/60">Email</p>
                    <p className="font-semibold">briskfarmsolutions@gmail.com</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Form Panel */}
          <div className="lg:col-span-2">
            <form 
              onSubmit={handleSubmit}
              className="bg-white border border-[#003023]/10 rounded-2xl p-8 shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#003023]">
                    Full Name *
                  </label>
                  <input
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-[#003023]/20 bg-[#f6fef9] px-4 py-3 text-sm text-[#003023] outline-none focus:border-[#003023] focus:ring-2 focus:ring-[#003023]/20 transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#003023]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#003023]/20 bg-[#f6fef9] px-4 py-3 text-sm text-[#003023] outline-none focus:border-[#003023] focus:ring-2 focus:ring-[#003023]/20 transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#003023]">
                    Phone / WhatsApp
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#003023]/20 bg-[#f6fef9] px-4 py-3 text-sm text-[#003023] outline-none focus:border-[#003023] focus:ring-2 focus:ring-[#003023]/20 transition-all"
                    placeholder="+256 XXX XXX XXX"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#003023] flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Project Type
                  </label>
                  <input
                    name="project_type"
                    value={form.project_type}
                    onChange={handleChange}
                    placeholder="e.g., Biogas System, Livestock Housing"
                    className="w-full rounded-xl border border-[#003023]/20 bg-[#f6fef9] px-4 py-3 text-sm text-[#003023] outline-none focus:border-[#003023] focus:ring-2 focus:ring-[#003023]/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#003023] flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Budget Range
                  </label>
                  <input
                    name="budget_range"
                    value={form.budget_range}
                    onChange={handleChange}
                    placeholder="e.g., 20M–150M UGX"
                    className="w-full rounded-xl border border-[#003023]/20 bg-[#f6fef9] px-4 py-3 text-sm text-[#003023] outline-none focus:border-[#003023] focus:ring-2 focus:ring-[#003023]/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#003023] flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Project Location
                  </label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="District / Town"
                    className="w-full rounded-xl border border-[#003023]/20 bg-[#f6fef9] px-4 py-3 text-sm text-[#003023] outline-none focus:border-[#003023] focus:ring-2 focus:ring-[#003023]/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <label className="block text-sm font-semibold text-[#003023]">
                  Project Description
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us about your current site, objectives, timelines, and any specific requirements..."
                  className="w-full rounded-xl border border-[#003023]/20 bg-[#f6fef9] px-4 py-3 text-sm text-[#003023] outline-none focus:border-[#003023] focus:ring-2 focus:ring-[#003023]/20 transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-[#003023]/60">
                  <p>Our team typically responds within 24 hours</p>
                </div>
                
                <PrimaryButton
                  type="submit"
                  loading={submitting}
                  text={submitting ? "Processing..." : "Submit Request"}
                  className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#003023] to-[#004633] hover:from-[#004633] hover:to-[#003023] text-white shadow-lg hover:shadow-xl transition-all"
                />
              </div>

              {feedback && (
                <div className={`mt-6 p-4 rounded-xl ${
                  feedbackType === "error" 
                    ? "bg-red-50 border border-red-200 text-red-700" 
                    : "bg-green-50 border border-green-200 text-green-700"
                }`}>
                  <div className="flex items-center gap-2">
                    {feedbackType === "success" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="w-5 h-5">⚠️</span>
                    )}
                    <p className="text-sm font-medium">{feedback}</p>
                  </div>
                </div>
              )}
            </form>

            {/* Additional Info */}
            <div className="mt-6 text-center text-sm text-[#003023]/60">
              <p>
                By submitting this form, you agree to our terms and consent to our team contacting you 
                about your project requirements.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Quote;