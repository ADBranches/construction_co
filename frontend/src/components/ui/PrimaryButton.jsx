// src/components/ui/PrimaryButton.jsx
export default function PrimaryButton({
  text,
  onClick,
  href,
  type = "button",
  loading = false,
  className = "",
}) {
  const baseClasses =
    "inline-flex items-center justify-center px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-[0.16em] text-[#1f1f1f] " +
    "bg-gradient-to-r from-[#f0c02f] to-[#f7d85b] hover:from-[#f7d85b] hover:to-[#f0c02f] " +
    "shadow-md shadow-[#2f8f2f]/25 transition-all duration-200";

  if (href) {
    return (
      <a
        href={href}
        className={`${baseClasses} ${loading ? "opacity-70 cursor-not-allowed" : ""} ${className}`}
      >
        {loading ? "Loading..." : text}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`${baseClasses} ${
        loading ? "opacity-70 cursor-not-allowed" : ""
      } ${className}`}
    >
      {loading ? "Loading..." : text}
    </button>
  );
}
