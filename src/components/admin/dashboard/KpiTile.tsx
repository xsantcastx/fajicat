/**
 * KPI tile with optional previous-period delta.
 *
 * Delta arrow color: neutral (green up / red down) for money & counts we want
 * to grow; use `invertDelta` for metrics where lower is better (pending
 * orders, refunds).
 */
export function KpiTile({
  label,
  value,
  numeric,
  prev,
  href,
  invertDelta = false,
  accent = false,
}: {
  label: string;
  /** Display value (already formatted). */
  value: string | number;
  /**
   * Raw numeric value for delta calc. Required when `value` is a formatted
   * string (e.g. `formatCOP(...)`). If `value` is a plain number, omit.
   */
  numeric?: number;
  /** Previous-period numeric value for delta calc. Omit to hide the delta. */
  prev?: number;
  href?: string;
  invertDelta?: boolean;
  accent?: boolean;
}) {
  const current = typeof value === "number" ? value : (numeric ?? NaN);

  let deltaEl: React.ReactNode = null;
  if (typeof prev === "number" && !Number.isNaN(current)) {
    if (prev === 0 && current === 0) {
      deltaEl = <span className="text-ink/40">—</span>;
    } else if (prev === 0) {
      deltaEl = <span className="text-brand-green-dark">Nuevo</span>;
    } else {
      const delta = ((current - prev) / prev) * 100;
      const isUp = delta >= 0;
      const good = invertDelta ? !isUp : isUp;
      const color = good ? "text-brand-green-dark" : "text-red-600";
      const arrow = isUp ? "↑" : "↓";
      deltaEl = (
        <span className={color}>
          {arrow} {Math.abs(delta).toFixed(0)}%
        </span>
      );
    }
  }

  const card = (
    <div
      className={`h-full rounded-2xl border bg-white p-5 transition ${
        accent ? "border-brand-orange/40" : "border-ink/10"
      } ${href ? "hover:shadow-md" : ""}`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-ink/55">
        {label}
      </p>
      <p
        className={`mt-2 whitespace-nowrap text-xl font-bold lg:text-2xl ${
          accent ? "text-brand-orange" : "text-ink"
        }`}
      >
        {value}
      </p>
      {deltaEl && (
        <p className="mt-1 text-xs font-medium">
          {deltaEl}
          <span className="ml-1 text-ink/40">vs. período anterior</span>
        </p>
      )}
    </div>
  );

  // Using a plain <a> instead of next/link so this component can be a server
  // component embedded anywhere without the "use client" boundary.
  return href ? (
    <a href={href} className="block">
      {card}
    </a>
  ) : (
    card
  );
}
