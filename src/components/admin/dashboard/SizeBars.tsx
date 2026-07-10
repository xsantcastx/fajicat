/**
 * Horizontal bar row: quantity sold per talla. Uses the canonical size order
 * XS → XL. Sizes with no sales still render (at 0) so Mariana can see the
 * gap at a glance.
 */
const CANONICAL_SIZES = ["XS", "S", "M", "L", "XL"];

export function SizeBars({
  data,
}: {
  data: { size: string; qty: number }[];
}) {
  // Include canonical sizes + any unknown ones that showed up in orders
  const bySize = new Map<string, number>();
  for (const s of CANONICAL_SIZES) bySize.set(s, 0);
  for (const row of data) {
    bySize.set(row.size, (bySize.get(row.size) ?? 0) + row.qty);
  }

  const rows = Array.from(bySize.entries()).map(([size, qty]) => ({
    size,
    qty,
  }));
  // Canonical order first, then any extras
  rows.sort((a, b) => {
    const ai = CANONICAL_SIZES.indexOf(a.size);
    const bi = CANONICAL_SIZES.indexOf(b.size);
    if (ai === -1 && bi === -1) return a.size.localeCompare(b.size);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  const max = rows.reduce((m, r) => Math.max(m, r.qty), 0);
  const total = rows.reduce((s, r) => s + r.qty, 0);

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink">Ventas por talla</h2>
          <p className="text-xs text-ink/50">Unidades pagadas en el período</p>
        </div>
        <p className="text-lg font-bold text-brand-green-dark">{total} u.</p>
      </div>

      {total === 0 ? (
        <p className="py-10 text-center text-sm text-ink/50">
          Sin ventas por talla en el período.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {rows.map((r) => {
            const pct = max > 0 ? (r.qty / max) * 100 : 0;
            return (
              <li key={r.size} className="flex items-center gap-3">
                <span className="w-8 text-sm font-bold text-ink">{r.size}</span>
                <div className="relative h-6 flex-1 overflow-hidden rounded-full bg-cream">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-orange to-brand-orange-dark"
                    style={{ width: `${Math.max(pct, r.qty > 0 ? 6 : 0)}%` }}
                  />
                </div>
                <span className="w-12 text-right text-sm font-semibold text-ink">
                  {r.qty}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
