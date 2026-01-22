// src/components/FooterNewsletter.jsx
import { useState } from "react";
import api from "../lib/apiClient";
import { Mail, Send, CheckCircle } from "lucide-react";

export default function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      await api.post("/api/v1/subscribers", { email });

      setStatus({
        type: "success",
        message: "Thank you! You've been successfully subscribed.",
      });
      setEmail("");
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#003023]/95 to-[#004633]/95 backdrop-blur-sm border border-white/10 shadow-xl">
        {/* Subtle overlay pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,#ffffff22_0%,transparent_70%)]" />
        </div>

        <div className="relative px-6 py-7 sm:px-8 sm:py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#83c441]/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-[#83c441]" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Brisk Farm newsletter
            </h3>
          </div>

          <p className="text-sm text-white/80 leading-relaxed mb-6">
            Get curated updates on new biodigester projects, farm systems and
            smart construction solutions — practical insights from the field,
            not spam.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                required
                placeholder="edovice@farms.co.ug"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/15 rounded-xl text-white placeholder:text-white/50 outline-none focus:border-[#83c441]/60 focus:bg-white/15 transition-all"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`
                relative w-full sm:w-auto px-8 py-3.5 rounded-xl font-medium text-base
                overflow-hidden transition-all duration-300
                ${
                  submitting
                    ? "bg-white/20 text-white/60 cursor-not-allowed"
                    : "bg-[#83c441] hover:bg-[#94d354] text-[#001f17] shadow-lg hover:shadow-xl active:scale-[0.98]"
                }
              `}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {submitting ? (
                  "Processing..."
                ) : (
                  <>
                    Subscribe
                    <Send className="w-4 h-4" />
                  </>
                )}
              </span>

              {/* Hover shine effect */}
              {!submitting && (
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              )}
            </button>
          </form>

          {/* Status messages */}
          {status.message && (
            <div
              className={`mt-5 flex items-start gap-2.5 text-sm ${
                status.type === "success"
                  ? "text-[#83c441]"
                  : "text-rose-400"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 mt-0.5 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold">!</span>
                </div>
              )}
              <span>{status.message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}