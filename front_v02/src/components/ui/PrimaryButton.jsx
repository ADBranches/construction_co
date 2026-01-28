// src/components/ui/PrimaryButton.jsx
export default function PrimaryButton({
  text,
  onClick,
  href,
  type = "button",
  loading = false,
  className = "",
}) {
  const baseClasses = [
    "inline-flex items-center justify-center",
    "px-5 py-2.5 rounded-full",
    "text-[11px] font-semibold uppercase tracking-[0.16em]",
    "bg-[var(--brand-yellow)] text-[var(--brand-contrast)]",
    "shadow-md shadow-black/10",
    "transition-transform duration-150",
    "hover:brightness-110 hover:-translate-y-[1px]",
    "focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)] focus:ring-offset-1",
    "focus:ring-offset-[var(--brisk-cream,#f6fef9)]",
    loading ? "opacity-70 cursor-not-allowed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {loading ? "Loading..." : text}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={baseClasses}
    >
      {loading ? "Loading..." : text}
    </button>
  );
}
