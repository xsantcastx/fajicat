// Shared date-range helper for admin dashboard + list pages.
// URL-driven so filters are shareable and work without client JS.

export type RangeKey =
  | "hoy"
  | "7d"
  | "30d"
  | "mes"
  | "mes-anterior"
  | "ano"
  | "custom";

export type ResolvedRange = {
  key: RangeKey;
  label: string;
  from: Date;
  to: Date;
  prevFrom: Date;
  prevTo: Date;
  /** Bucketing hint for charts: "day" for ≤ 31d ranges, "week" otherwise. */
  bucket: "day" | "week";
};

const PRESETS: { key: RangeKey; label: string }[] = [
  { key: "hoy", label: "Hoy" },
  { key: "7d", label: "7 días" },
  { key: "30d", label: "30 días" },
  { key: "mes", label: "Este mes" },
  { key: "mes-anterior", label: "Mes pasado" },
  { key: "ano", label: "Este año" },
];

export function rangePresets() {
  return PRESETS;
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function parseISO(s: string | undefined): Date | null {
  if (!s) return null;
  // Accept YYYY-MM-DD from <input type="date">
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

type PresetKey = Exclude<RangeKey, "custom">;

const KNOWN_KEYS = new Set<RangeKey>([
  "hoy",
  "7d",
  "30d",
  "mes",
  "mes-anterior",
  "ano",
  "custom",
]);

function normalizeKey(raw: string | undefined): RangeKey {
  return raw && KNOWN_KEYS.has(raw as RangeKey) ? (raw as RangeKey) : "30d";
}

function presetRange(
  key: PresetKey,
  now: Date,
  today: Date,
): { from: Date; to: Date; label: string } {
  switch (key) {
    case "hoy":
      return { from: startOfDay(today), to: endOfDay(today), label: "Hoy" };
    case "7d":
      return {
        from: startOfDay(addDays(today, -6)),
        to: endOfDay(today),
        label: "Últimos 7 días",
      };
    case "mes":
      return {
        from: new Date(now.getFullYear(), now.getMonth(), 1),
        to: endOfDay(today),
        label: now.toLocaleDateString("es-CO", {
          month: "long",
          year: "numeric",
        }),
      };
    case "mes-anterior": {
      const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const last = new Date(now.getFullYear(), now.getMonth(), 0);
      return {
        from: first,
        to: endOfDay(last),
        label: first.toLocaleDateString("es-CO", {
          month: "long",
          year: "numeric",
        }),
      };
    }
    case "ano":
      return {
        from: new Date(now.getFullYear(), 0, 1),
        to: endOfDay(today),
        label: String(now.getFullYear()),
      };
    case "30d":
      return {
        from: startOfDay(addDays(today, -29)),
        to: endOfDay(today),
        label: "Últimos 30 días",
      };
  }
}

export function resolveRange(params: {
  range?: string;
  from?: string;
  to?: string;
}): ResolvedRange {
  const now = new Date();
  const today = startOfDay(now);
  let key = normalizeKey(params.range);

  let from: Date;
  let to: Date;
  let label: string;

  if (key === "custom") {
    const f = parseISO(params.from);
    const t = parseISO(params.to);
    if (f && t && f <= t) {
      from = startOfDay(f);
      to = endOfDay(t);
      label = `${f.toLocaleDateString("es-CO")} – ${t.toLocaleDateString("es-CO")}`;
    } else {
      // URL param was malformed (edited/shared badly). Degrade to 30d so the
      // page renders rather than 500ing.
      key = "30d";
      ({ from, to, label } = presetRange("30d", now, today));
    }
  } else {
    ({ from, to, label } = presetRange(key, now, today));
  }

  // Previous period = same length, ending the millisecond before `from`
  const span = to.getTime() - from.getTime();
  const prevTo = new Date(from.getTime() - 1);
  const prevFrom = new Date(prevTo.getTime() - span);

  const days = Math.round(span / 86_400_000);
  const bucket: "day" | "week" = days <= 31 ? "day" : "week";

  return { key, label, from, to, prevFrom, prevTo, bucket };
}

/** Build a URL query string that swaps only the range params. */
export function rangeHref(
  base: string,
  next: { range: RangeKey; from?: string; to?: string },
  keep: Record<string, string | undefined> = {},
) {
  const params = new URLSearchParams();
  params.set("range", next.range);
  if (next.range === "custom") {
    if (next.from) params.set("from", next.from);
    if (next.to) params.set("to", next.to);
  }
  for (const [k, v] of Object.entries(keep)) {
    if (v) params.set(k, v);
  }
  return `${base}?${params.toString()}`;
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Bucket a list of {date, value} items into day-or-week buckets covering the
 * full range so bars for empty days still render.
 */
export function bucketize(
  range: ResolvedRange,
  rows: { at: Date; value: number }[],
): { label: string; total: number }[] {
  const buckets: { start: Date; end: Date; label: string; total: number }[] = [];

  if (range.bucket === "day") {
    let cur = new Date(range.from);
    while (cur <= range.to) {
      const end = endOfDay(cur);
      buckets.push({
        start: new Date(cur),
        end,
        label: cur.toLocaleDateString("es-CO", {
          day: "numeric",
          month: "short",
        }),
        total: 0,
      });
      cur = addDays(cur, 1);
    }
  } else {
    // Weekly buckets aligned to `from`
    let cur = new Date(range.from);
    while (cur <= range.to) {
      const end = new Date(
        Math.min(addDays(cur, 7).getTime() - 1, range.to.getTime()),
      );
      buckets.push({
        start: new Date(cur),
        end,
        label: cur.toLocaleDateString("es-CO", {
          day: "numeric",
          month: "short",
        }),
        total: 0,
      });
      cur = addDays(cur, 7);
    }
  }

  for (const r of rows) {
    const t = r.at.getTime();
    for (const b of buckets) {
      if (t >= b.start.getTime() && t <= b.end.getTime()) {
        b.total += r.value;
        break;
      }
    }
  }

  return buckets.map((b) => ({ label: b.label, total: b.total }));
}
