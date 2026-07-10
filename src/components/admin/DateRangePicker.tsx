import Link from "next/link";
import {
  type RangeKey,
  type ResolvedRange,
  rangeHref,
  rangePresets,
  toISODate,
} from "@/lib/dateRange";

/**
 * URL-driven date range picker. Preset chips are plain <Link>s; the custom
 * range is a GET <form> — so filters are shareable and work without JS.
 */
export function DateRangePicker({
  resolved,
  basePath,
  keep = {},
}: {
  resolved: ResolvedRange;
  basePath: string;
  /** Other query params to preserve (e.g. status filter). */
  keep?: Record<string, string | undefined>;
}) {
  const presets = rangePresets();
  const fromISO = toISODate(resolved.from);
  const toISO = toISODate(resolved.to);

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        {presets.map((p) => {
          const active = resolved.key === p.key;
          return (
            <Link
              key={p.key}
              href={rangeHref(basePath, { range: p.key }, keep)}
              className={
                active
                  ? "rounded-full bg-brand-orange px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-brand-orange/30"
                  : "rounded-full border border-ink/10 bg-white px-3.5 py-1.5 text-xs font-semibold text-ink/70 transition hover:border-brand-orange/40 hover:text-brand-orange"
              }
            >
              {p.label}
            </Link>
          );
        })}
      </div>

      <form
        method="GET"
        action={basePath}
        className="mt-3 flex flex-col gap-2 border-t border-ink/10 pt-3 sm:flex-row sm:items-center"
      >
        <input type="hidden" name="range" value="custom" />
        {Object.entries(keep).map(([k, v]) =>
          v ? <input key={k} type="hidden" name={k} value={v} /> : null,
        )}
        <label className="flex items-center gap-2 text-xs text-ink/60">
          Desde
          <input
            type="date"
            name="from"
            defaultValue={fromISO}
            className="rounded-lg border border-ink/10 bg-white px-2 py-1.5 text-sm text-ink focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
          />
        </label>
        <label className="flex items-center gap-2 text-xs text-ink/60">
          Hasta
          <input
            type="date"
            name="to"
            defaultValue={toISO}
            className="rounded-lg border border-ink/10 bg-white px-2 py-1.5 text-sm text-ink focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-ink/85"
        >
          Aplicar
        </button>
        <p className="ml-auto hidden text-xs text-ink/50 sm:block">
          <span className="font-medium text-ink/70 capitalize">
            {resolved.label}
          </span>
        </p>
      </form>
      <p className="mt-2 text-xs text-ink/50 sm:hidden">
        Período:{" "}
        <span className="font-medium text-ink/70 capitalize">
          {resolved.label}
        </span>
      </p>
    </div>
  );
}

// Re-export the type so pages don't have to double-import
export type { ResolvedRange, RangeKey };
