/**
 * WhatsApp vs Web split. Tiny widget — the two numbers matter most; the bar
 * is just to make the ratio glanceable.
 */
export function ChannelSplit({
  web,
  whatsapp,
}: {
  web: number;
  whatsapp: number;
}) {
  const total = web + whatsapp;
  const webPct = total > 0 ? (web / total) * 100 : 0;
  const waPct = total > 0 ? (whatsapp / total) * 100 : 0;

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-bold text-ink">Canal de venta</h2>
        <p className="text-xs text-ink/50">{total} pedidos</p>
      </div>

      {total === 0 ? (
        <p className="py-10 text-center text-sm text-ink/50">
          Sin pedidos en el período.
        </p>
      ) : (
        <>
          <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-cream">
            <div
              className="bg-brand-green"
              style={{ width: `${waPct}%` }}
              title={`WhatsApp: ${whatsapp}`}
            />
            <div
              className="bg-brand-orange"
              style={{ width: `${webPct}%` }}
              title={`Web: ${web}`}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-brand-green/10 p-3">
              <p className="text-xs font-medium text-ink/60">WhatsApp</p>
              <p className="mt-1 text-lg font-bold text-brand-green-dark">
                {whatsapp}
              </p>
              <p className="text-xs text-ink/50">
                {waPct.toFixed(0)}% del total
              </p>
            </div>
            <div className="rounded-xl bg-brand-orange/10 p-3">
              <p className="text-xs font-medium text-ink/60">Web</p>
              <p className="mt-1 text-lg font-bold text-brand-orange-dark">
                {web}
              </p>
              <p className="text-xs text-ink/50">
                {webPct.toFixed(0)}% del total
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
