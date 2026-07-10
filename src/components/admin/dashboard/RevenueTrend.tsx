import { formatCOP } from "@/lib/format";

/**
 * Vertical bar chart for revenue over time. Hand-rolled SVG — one bar per
 * bucket (day or week). No chart library because the data is small.
 */
export function RevenueTrend({
  buckets,
  bucket,
}: {
  buckets: { label: string; total: number }[];
  bucket: "day" | "week";
}) {
  const max = buckets.reduce((m, b) => Math.max(m, b.total), 0);
  const total = buckets.reduce((s, b) => s + b.total, 0);
  const hasData = total > 0;

  const w = 100;
  const h = 40;
  const gap = buckets.length > 20 ? 0.4 : 0.8;
  const barW = buckets.length
    ? (w - gap * (buckets.length - 1)) / buckets.length
    : 0;

  // Show at most ~6 x-axis labels so they don't overlap
  const labelStep = Math.max(1, Math.ceil(buckets.length / 6));

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink">Ingresos por período</h2>
          <p className="text-xs text-ink/50">
            {bucket === "day" ? "Por día" : "Por semana"} · pedidos pagados
          </p>
        </div>
        <p className="text-lg font-bold text-brand-orange">
          {formatCOP(total)}
        </p>
      </div>

      {hasData ? (
        <div className="mt-6">
          <svg
            viewBox={`0 0 ${w} ${h}`}
            preserveAspectRatio="none"
            className="h-40 w-full"
            aria-hidden
          >
            {buckets.map((b, i) => {
              const x = i * (barW + gap);
              const barH = max > 0 ? (b.total / max) * (h - 2) : 0;
              const y = h - barH;
              return (
                <g key={i}>
                  {/* Track */}
                  <rect
                    x={x}
                    y={0}
                    width={barW}
                    height={h}
                    className="fill-cream"
                    rx={0.5}
                  />
                  {/* Bar */}
                  {barH > 0 && (
                    <rect
                      x={x}
                      y={y}
                      width={barW}
                      height={barH}
                      className="fill-brand-orange"
                      rx={0.5}
                    >
                      <title>
                        {b.label}: {formatCOP(b.total)}
                      </title>
                    </rect>
                  )}
                </g>
              );
            })}
          </svg>
          <div className="mt-2 flex justify-between text-[10px] text-ink/50">
            {buckets.map((b, i) =>
              i % labelStep === 0 || i === buckets.length - 1 ? (
                <span key={i} className="truncate">
                  {b.label}
                </span>
              ) : null,
            )}
          </div>
        </div>
      ) : (
        <p className="py-10 text-center text-sm text-ink/50">
          Sin pedidos pagados en el período.
        </p>
      )}
    </div>
  );
}
