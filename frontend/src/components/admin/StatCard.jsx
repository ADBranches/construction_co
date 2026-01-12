// src/components/admin/StatCard.jsx
export default function StatCard({ label, value, color = "orange" }) {
  const colorClass =
    color === "orange"
      ? "bg-[var(--brand-yellow)]"
      : color === "blue"
      ? "bg-[var(--brand-earth)]"
      : "bg-[var(--brand-green)]";

  return (
    <div className="rounded-lg border border-[var(--brand-green)]/15 bg-white p-6 shadow-sm">
      <p className="text-xs font-medium text-[var(--brand-contrast)]/70">
        {label}
      </p>
      <h2 className="mt-2 text-3xl font-extrabold text-[var(--brand-contrast)]">
        {value}
      </h2>
      <div className={`mt-3 h-1.5 w-16 rounded-full ${colorClass}`}></div>
    </div>
  );
}
