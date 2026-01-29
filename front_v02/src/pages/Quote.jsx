// src/pages/Quote.jsx
import { useState } from "react";
import InquiriesStore from "../lib/inquiriesStore.js";
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
  Building,
  ArrowRight,
  Users,
  Shield,
  Target,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback("");

    try {
      InquiriesStore.create({
        ...form,
        source: "quote",
      });

      setFeedbackType("success");
      setFeedback(
        "Request submitted! Our engineers will respond within 24 hours."
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
      setFeedback(err?.message || "Unable to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { number: "01", title: "Share Details", description: "Tell us about your project, location, and budget.", icon: FileText },
    { number: "02", title: "We Review", description: "Our engineering team evaluates your request.", icon: CheckCircle },
    { number: "03", title: "We Respond", description: "Receive expert guidance, BOQs, or site visit proposals.", icon: Clock },
  ];

  const trustMetrics = [
    { value: "100+", label: "Projects Completed", icon: Target },
    { value: "50+", label: "Happy Clients", icon: Users },
    { value: "98%", label: "Satisfaction Rate", icon: Shield },
  ];

  const projectTags = [
    "Animal production consultancy (dairy, beef, small ruminants, poultry)",
    "Farm & household waste management",
    "Biodigester installation (fixed dome & prefabricated)",
    "Supply of biogas appliances & accessories",
    "Capacity building – livestock & biodigester systems management",
    "Pasture establishment & management",
    "Integrated farm & energy packages",
  ];

  return (
    <>
      <Seo title="Request a Quote | Brisk Farm Solutions" />

      <section className="bg-[#f6fef9] min-h-screen">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16">

          {/* HERO */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white border border-[#83c441]/30 text-[#003023] text-xs font-semibold tracking-widest px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-[#f05010] rounded-full animate-pulse" />
              Get a Tailored Quote
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-[#003023] mb-4">
              Transform Your{" "}
              <span className="text-[#f05010]">Farm</span> or{" "}
              <span className="text-[#83c441]">Construction</span> Project
            </h1>

            <p className="text-[#003023]/70 text-lg max-w-2xl mx-auto">
              Share details about your system or construction work. Our engineers
              will provide tailored, professional guidance.
            </p>

            {/* TRUST METRICS */}
            <div className="flex justify-center gap-10 mt-10">
              {trustMetrics.map((metric, i) => {
                const Icon = metric.icon;
                return (
                  <div key={i} className="text-center">
                    <Icon className="w-7 h-7 text-[#83c441] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[#003023]">{metric.value}</div>
                    <div className="text-sm text-[#003023]/70">{metric.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEPS */}
          <div className="grid md:grid-cols-3 gap-8 mb-20 text-center">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.number}
                  className="bg-white rounded-3xl border border-[#003023]/10 p-10 shadow-sm"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#003023] to-[#004633] text-white rounded-2xl flex items-center justify-center mx-auto text-xl font-bold mb-4">
                    {s.number}
                  </div>

                  <Icon className="w-6 h-6 text-[#f05010] mx-auto mb-2" />

                  <h3 className="text-lg font-semibold text-[#003023]">{s.title}</h3>

                  <p className="text-[#003023]/60 text-sm mt-2">{s.description}</p>
                </div>
              );
            })}
          </div>

          {/* MAIN CONTENT GRID */}
          <div className="grid lg:grid-cols-3 gap-10 items-start">

            {/* LEFT COLUMN */}
            <div className="space-y-8">
              {/* WHY CHOOSE */}
              <div className="bg-gradient-to-br from-[#003023] to-[#004633] rounded-3xl p-10 text-white shadow-md">
                <h2 className="text-2xl font-bold mb-4">Why Choose Brisk Farm?</h2>

                <p className="text-white/85 mb-6">
                  We design farm solutions for today’s and tomorrow’s challenges —
                  using research-driven engineering and maximising farm waste to
                  generate clean energy and bio-fertilisers.
                </p>

                <div className="space-y-4">
                  {[
                    "Waste-to-energy & bio-fertiliser optimisation for your farm",
                    "Research-backed designs tailored to your enterprise",
                    "On-ground support from site assessment to after-sales follow-up",
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-[#83c441] flex-shrink-0 mt-1" />
                      <span className="text-white/90">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* TAGS */}
              <div className="bg-white rounded-3xl border border-[#003023]/10 p-10">
                <h3 className="font-semibold text-[#003023] flex items-center gap-2 mb-4">
                  <Building className="w-5 h-5 text-[#f05010]" />
                  Project Types We Handle
                </h3>

                <div className="flex flex-wrap gap-3">
                  {projectTags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-[#f6fef9] border border-[#83c441]/25 rounded-lg text-xs text-[#003023]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* CONTACT */}
              <div className="bg-white rounded-3xl border border-[#003023]/10 p-10">
                <h3 className="font-semibold text-[#003023] flex items-center gap-2 mb-4">
                  <Phone className="w-5 h-5 text-[#f05010]" />
                  Prefer Direct Contact?
                </h3>

                <div className="space-y-4">
                  <a
                    href="tel:+256783111015"
                    className="flex items-center gap-3 hover:bg-[#f6fef9] p-3 rounded-xl transition"
                  >
                    <div className="w-10 h-10 bg-[#003023]/5 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-[#003023]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#003023]/60">Call / WhatsApp</p>
                      <p className="font-semibold">+256 783 111 015</p>
                    </div>
                  </a>

                  <a
                    href="mailto:briskfarmsolutions@gmail.com"
                    className="flex items-center gap-3 hover:bg-[#f6fef9] p-3 rounded-xl transition"
                  >
                    <div className="w-10 h-10 bg-[#003023]/5 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-[#003023]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#003023]/60">Email</p>
                      <p className="font-semibold">briskfarmsolutions@gmail.com</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN – FORM */}
            <div className="lg:col-span-2">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl border border-[#003023]/10 p-10 shadow-md space-y-10"
              >
                {/* INPUT GRID */}
                <div className="grid md:grid-cols-2 gap-8">
                  {[
                    {
                      id: "full_name",
                      label: "Full Name *",
                      name: "full_name",
                      placeholder: " Eng. Sarah N., Farm Manager",
                    },
                    {
                      id: "email",
                      label: "Email Address",
                      name: "email",
                      placeholder: " projects@greenvalleydairy.co.ug",
                    },
                    {
                      id: "phone",
                      label: "Phone / WhatsApp",
                      name: "phone",
                      placeholder: " +256 783 111 015",
                    },
                    {
                      id: "budget_range",
                      label: "Budget Range",
                      name: "budget_range",
                      placeholder: " UGX 40M – 120M (estimated)",
                    },
                    {
                      id: "location",
                      label: "Project Location",
                      name: "location",
                      placeholder: " Ssenge, Wakiso District",
                    },
                  ].map((field, i) => (
                    <div key={i} className="space-y-2">
                      <label
                        htmlFor={field.id}
                        className="text-sm font-semibold text-[#003023]"
                      >
                        {field.label}
                      </label>

                      <input
                        id={field.id}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        className="w-full bg-[#f6fef9] border border-[#003023]/20 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#003023]/20"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>
                {/* PROJECT TYPE DROPDOWN */}
                <div className="mt-4">
                  <label
                    htmlFor="project_type"
                    className="text-sm font-semibold text-[#003023] mb-2 block"
                  >
                    Project Type *
                  </label>
                  <select
                    id="project_type"
                    name="project_type"
                    value={form.project_type}
                    onChange={handleChange}
                    className="w-full bg-[#f6fef9] border border-[#003023]/20 rounded-xl px-4 py-3 text-sm text-[#003023] outline-none focus:ring-2 focus:ring-[#003023]/20 focus:border-[#003023] transition"
                    required
                  >
                    <option value="">
                      Select the service that best matches your project
                    </option>

                    {/* 1. Animal Production consultancy */}
                    <option value="animal_production">
                      Animal production consultancy (dairy, beef, small ruminants, poultry)
                    </option>

                    {/* 2. Farm & household waste management */}
                    <option value="waste_management">
                      Farm &amp; household waste management
                    </option>

                    {/* 3. Biodigester installation */}
                    <option value="biodigester_installation">
                      Biodigester installation (fixed dome &amp; prefabricated)
                    </option>

                    {/* 4. Supply of biogas appliances */}
                    <option value="biogas_appliances">
                      Supply of biogas appliances (heaters, generators, pumps, etc.)
                    </option>

                    {/* 5. Capacity building services */}
                    <option value="capacity_building">
                      Capacity building (livestock &amp; biodigester systems management)
                    </option>

                    {/* 6. Pasture establishment & management */}
                    <option value="pasture_management">
                      Pasture establishment &amp; management
                    </option>

                    {/* Strategic bucket */}
                    <option value="other">
                      Mixed / custom project or partnership
                    </option>
                  </select>
                </div>

                {/* MESSAGE BOX */}
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-semibold text-[#003023]"
                  >
                    Project Description
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    className="w-full bg-[#f6fef9] border border-[#003023]/20 rounded-xl px-4 py-3 text-sm resize-none outline-none focus:ring-2 focus:ring-[#003023]/20"
                    placeholder="Briefly describe your current setup, key challenges, desired outcomes and timelines for this project..."
                  />
                </div>

                {/* SUBMIT */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <p className="text-sm text-[#003023]/70 text-center md:text-left">
                    Our engineering team typically responds within 1 business day with next steps or a proposed site visit.
                  </p>

                  <PrimaryButton
                    type="submit"
                    loading={submitting}
                    text={submitting ? "Submitting..." : "Submit Request"}
                    className="px-10 py-3.5 bg-gradient-to-r from-[#003023] to-[#004633] text-white rounded-xl shadow-md hover:shadow-lg transition"
                    icon={<ArrowRight className="w-4 h-4 ml-2" />}
                  />
                </div>

                {feedback && (
                  <div
                    className={`p-4 rounded-xl ${
                      feedbackType === "error"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-green-50 text-green-700 border border-green-200"
                    }`}
                  >
                    {feedback}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Quote;
