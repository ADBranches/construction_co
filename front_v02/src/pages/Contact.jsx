// src/pages/Contact.jsx
import { useState } from "react";
import Seo from "../seo/Seo";
import api from "../lib/apiClient";
import PrimaryButton from "../components/ui/PrimaryButton";
import InquiriesStore from "../lib/inquiriesStore";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Send,
  CheckCircle,
  Users,
  Building,
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";

function Contact() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      InquiriesStore.create({
        ...form,
        source: "contact",
      });

      setStatus("success");
      setIsSubmitted(true);
      setForm({
        full_name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Our Location",
      details: ["Ssenge, Naluvule", "Wakiso District, Uganda"],
      color: "bg-gradient-to-br from-[#003023] to-[#004633]",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+256 783 111 015", "Mon - Fri: 8:00 AM - 5:00 PM"],
      color: "bg-gradient-to-br from-[#f05010] to-[#ff6b35]",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["briskfarmsolutions@gmail.com", "24/7 Response"],
      color: "bg-gradient-to-br from-[#83c441] to-[#a0d64b]",
    },
  ];

  const directors = [
    { name: "Gideon", role: "Managing Director" },
    { name: "Morret", role: "Operations Director" },
    { name: "Bwambale", role: "Technical Director" },
  ];

  return (
    <>
      <Seo
        title="Contact Us | Brisk Farm Solutions"
        description="Get in touch with our team for biogas systems, livestock solutions, and modern construction services across Uganda."
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16 md:space-y-24">
        {/* Hero Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-[#f6fef9] border border-[#83c441]/30 text-[#003023] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-[#f05010] rounded-full animate-pulse" />
              Get in Touch
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-[#003023] mb-4">
              Let&apos;s Build Your{" "}
              <span className="text-[#f05010]">Sustainable</span> Future
            </h1>

            <p className="text-lg text-[#003023]/70 max-w-3xl mx-auto">
              Reach out for biogas installations, livestock units, crop
              production support, or construction works. Our team responds
              within 24 hours.
            </p>
          </motion.div>
        </section>

        {/* Contact cards + map + form */}
        <section>
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-10 items-start">
            {/* Left: cards + map */}
            <div className="lg:col-span-2 space-y-8 md:space-y-10">
              {/* Contact Info Cards */}
              <div className="grid md:grid-cols-3 gap-6 md:gap-7">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <motion.div
                      key={info.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.03 }}
                      className="bg-white rounded-2xl md:rounded-3xl border border-[#003023]/10 p-6 md:p-7 shadow-md hover:shadow-xl transition-all"
                    >
                      <div
                        className={`w-14 h-14 ${info.color} rounded-xl flex items-center justify-center mb-4`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      <h3 className="text-lg font-bold text-[#003023] mb-2">
                        {info.title}
                      </h3>

                      <div className="space-y-1">
                        {info.details.map((detail, idx) => (
                          <p
                            key={idx}
                            className="text-sm text-[#003023]/70 leading-snug"
                          >
                            {detail}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Map */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl md:rounded-3xl overflow-hidden border border-[#003023]/10 shadow-md md:shadow-lg"
              >
                <div className="relative h-64 md:h-80 bg-gradient-to-br from-[#003023] to-[#004633]">
                  <iframe
                    title="Brisk Farm Solutions & Construction Company Location"
                    src="https://www.google.com/maps?q=0.40653,32.5118&z=14&output=embed"
                    className="absolute inset-0 w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#f05010]" />
                      <span className="text-sm font-semibold text-[#003023]">
                        Wakiso District
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: contact form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl md:rounded-3xl border border-[#003023]/10 p-8 md:p-9 shadow-lg"
            >
              {isSubmitted ? (
                <div className="text-center py-10 md:py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#83c441] to-[#a0d64b] rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#003023] mb-3">
                    Message Sent!
                  </h3>
                  <p className="text-[#003023]/70 mb-6">
                    Thank you for contacting us. Our team will get back to you
                    within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-[#f05010] font-semibold hover:text-[#003023] transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#f05010] to-[#ff6b35] rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#003023]">
                        Send a Message
                      </h2>
                      <p className="text-sm text-[#003023]/70">
                        Average response time: within 1 business day
                      </p>

                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-[#003023] mb-2">
                        Full Name *
                      </label>
                      <input
                        name="full_name"
                        value={form.full_name}
                        onChange={handleChange}
                        required
                        placeholder="Eng. Sarah N, Farm Manager"
                        className="w-full rounded-xl border border-[#003023]/20 bg-[#f6fef9] px-4 py-3 text-sm text-[#003023] outline-none focus:border-[#003023] focus:ring-2 focus:ring-[#003023]/20 transition-all"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-[#003023] mb-2">
                          Email *
                        </label>
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="projects@greenvalleydairy.co.ug"
                          className="w-full rounded-xl border border-[#003023]/20 bg-[#f6fef9] px-4 py-3 text-sm text-[#003023] outline-none focus:border-[#003023] focus:ring-2 focus:ring-[#003023]/20 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#003023] mb-2">
                          Phone
                        </label>
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+256 783 111 015"
                          className="w-full rounded-xl border border-[#003023]/20 bg-[#f6fef9] px-4 py-3 text-sm text-[#003023] outline-none focus:border-[#003023] focus:ring-2 focus:ring-[#003023]/20 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#003023] mb-2">
                        Subject
                      </label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-[#003023]/20 bg-[#f6fef9] px-4 py-3 text-sm text-[#003023] outline-none focus:border-[#003023] focus:ring-2 focus:ring-[#003023]/20 transition-all"
                      >
                        <option value="">
                          Choose what you&apos;d like to discuss
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

                        {/* Extra: strategic / partnership bucket */}
                        <option value="partnership">
                          Partnerships, pilots or other strategic inquiry
                        </option>
                      </select>

                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#003023] mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        value={form.message}
                        onChange={handleChange}
                        required
                        placeholder="Tell us about your project, timeline, and requirements..."
                        className="w-full rounded-xl border border-[#003023]/20 bg-[#f6fef9] px-4 py-3 text-sm text-[#003023] outline-none focus:border-[#003023] focus:ring-2 focus:ring-[#003023]/20 transition-all resize-none"
                      />
                    </div>

                    <PrimaryButton
                      type="submit"
                      loading={loading}
                      text={loading ? "Sending..." : "Send Message"}
                      className="w-full bg-gradient-to-r from-[#003023] to-[#004633] hover:from-[#004633] hover:to-[#003023] text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                      icon={<Send className="w-5 h-5 ml-2" />}
                    />

                    {status === "error" && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-600 text-sm">
                          Something went wrong. Please try again or contact us
                          directly.
                        </p>
                      </div>
                    )}
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </section>

        {/* Directors & Service Areas */}
        <section>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-10 items-start">
            {/* Directors */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-[#003023] to-[#004633] rounded-2xl md:rounded-3xl p-8 md:p-10 text-white shadow-md"
            >
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-8 h-8 text-[#f05010]" />
                <h3 className="text-2xl font-bold">Our Leadership Team</h3>
              </div>

              <div className="grid gap-6">
                {directors.map((director, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <span className="text-lg font-bold text-white">
                        {director.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{director.name}</h4>
                      <p className="text-white/70">{director.role}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-white/80">
                  Our directors bring decades of combined experience in
                  agriculture, construction, and renewable energy solutions.
                </p>
              </div>
            </motion.div>

            {/* Service Areas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl md:rounded-3xl border border-[#003023]/10 p-8 md:p-10 shadow-md md:shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <Building className="w-8 h-8 text-[#83c441]" />
                <h3 className="text-2xl font-bold text-[#003023]">
                  Service Areas
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-[#003023]/10">
                  <span className="text-[#003023] font-medium">
                    Central Uganda
                  </span>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-[#f05010] rounded-full" />
                    <div className="w-2 h-2 bg-[#83c441] rounded-full" />
                    <div className="w-2 h-2 bg-[#003023] rounded-full" />
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[#003023]/10">
                  <span className="text-[#003023] font-medium">
                    Western Uganda
                  </span>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-[#f05010] rounded-full" />
                    <div className="w-2 h-2 bg-[#83c441] rounded-full" />
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[#003023]/10">
                  <span className="text-[#003023] font-medium">
                    Eastern Uganda
                  </span>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-[#f05010] rounded-full" />
                    <div className="w-2 h-2 bg-[#003023] rounded-full" />
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-[#003023] font-medium">
                    Northern Uganda
                  </span>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-[#83c441] rounded-full" />
                    <div className="w-2 h-2 bg-[#003023] rounded-full" />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#003023]/10">
                <p className="text-sm text-[#003023]/70 leading-relaxed">
                  We serve clients nationwide with a focus on sustainable,
                  high-quality solutions tailored to local needs.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Contact;
