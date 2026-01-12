// src/components/ui/Input.jsx
export default function Input({ label, error, className = "", ...props }) {
  const baseInputClasses = [
    "w-full rounded-[var(--radius)] border px-4 py-2 text-sm",
    "bg-[var(--brisk-cream,#f6fef9)] text-[var(--brand-contrast)]",
    "placeholder:text-gray-400 shadow-sm",
    "focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)] focus:border-[var(--brand-green)]",
    error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="mb-4">
      {label && (
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-contrast)]">
          {label}
        </label>
      )}

      <input {...props} className={baseInputClasses} />

      {error && (
        <p className="mt-1 text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
