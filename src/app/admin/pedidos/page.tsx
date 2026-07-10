import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCOP } from "@/lib/format";
import { resolveRange } from "@/lib/dateRange";
import { DateRangePicker } from "@/components/admin/DateRangePicker";

export const dynamic = "force-dynamic";

const STATUS: Record<string, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const STATUS_TONE: Record<string, string> = {
  pending: "bg-brand-orange/15 text-brand-orange-dark",
  paid: "bg-brand-green/20 text-brand-green-dark",
  shipped: "bg-brand-blue/20 text-ink/80",
  delivered: "bg-brand-green/20 text-brand-green-dark",
  cancelled: "bg-cream text-ink/60",
};

const STATUS_FILTER_OPTIONS: [string, string][] = [
  ["all", "Todos los estados"],
  ["pending", "Pendientes"],
  ["paid", "Pagados"],
  ["shipped", "Enviados"],
  ["delivered", "Entregados"],
  ["cancelled", "Cancelados"],
];

type Row = {
  id: string;
  created_at: string;
  contact_name: string | null;
  total: number | string;
  status: string;
  channel: string;
};

export default async function AdminPedidos({
  searchParams,
}: {
  searchParams: Promise<{
    range?: string;
    from?: string;
    to?: string;
    status?: string;
  }>;
}) {
  const params = await searchParams;
  const range = resolveRange(params);
  const statusFilter =
    params.status && params.status !== "all" ? params.status : null;

  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select("id, created_at, contact_name, total, status, channel")
    .gte("created_at", range.from.toISOString())
    .lte("created_at", range.to.toISOString())
    .order("created_at", { ascending: false });
  if (statusFilter) query = query.eq("status", statusFilter);
  const { data } = await query;
  const orders = (data ?? []) as Row[];

  // Summary totals
  const paidOrders = orders.filter((o) => o.status === "paid");
  const revenue = paidOrders.reduce((s, o) => s + Number(o.total), 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Pedidos</h1>
          <p className="mt-1 text-sm capitalize text-ink/60">{range.label}</p>
        </div>
      </div>

      <DateRangePicker
        resolved={range}
        basePath="/admin/pedidos"
        keep={{ status: statusFilter ?? undefined }}
      />

      {/* Summary tiles */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryTile label="Pedidos" value={orders.length} />
        <SummaryTile label="Ingresos" value={formatCOP(revenue)} accent />
        <SummaryTile label="Pagados" value={paidOrders.length} />
        <SummaryTile label="Pendientes" value={pendingCount} />
      </section>

      {/* Status filter — GET form so it participates in the URL */}
      <form
        method="GET"
        action="/admin/pedidos"
        className="flex flex-wrap items-center gap-3 rounded-2xl border border-ink/10 bg-white p-4"
      >
        <input type="hidden" name="range" value={range.key} />
        {range.key === "custom" && (
          <>
            <input
              type="hidden"
              name="from"
              value={new Date(range.from).toISOString().slice(0, 10)}
            />
            <input
              type="hidden"
              name="to"
              value={new Date(range.to).toISOString().slice(0, 10)}
            />
          </>
        )}
        <label className="flex items-center gap-2 text-xs text-ink/60">
          Estado
          <select
            name="status"
            defaultValue={statusFilter ?? "all"}
            className="rounded-lg border border-ink/10 bg-white px-3 py-1.5 text-sm text-ink focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
          >
            {STATUS_FILTER_OPTIONS.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-ink/85"
        >
          Aplicar
        </button>
        {statusFilter && (
          <Link
            href={`/admin/pedidos?range=${range.key}`}
            className="ml-auto text-xs text-ink/55 hover:text-brand-orange"
          >
            Limpiar filtro
          </Link>
        )}
      </form>

      <div className="rounded-2xl border border-ink/10 bg-white">
        {/* Mobile: cards */}
        <ul className="divide-y divide-ink/10 sm:hidden">
          {orders.map((o) => (
            <li key={o.id}>
              <Link
                href={`/admin/pedidos/${o.id}`}
                className="block p-4 hover:bg-cream"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate font-medium text-ink">
                    {o.contact_name || `#${o.id.slice(0, 8)}`}
                  </p>
                  <p className="text-sm font-semibold text-ink">
                    {formatCOP(Number(o.total))}
                  </p>
                </div>
                <div className="mt-1 flex items-center justify-between gap-2 text-xs text-ink/50">
                  <span className="truncate">
                    #{o.id.slice(0, 8)} ·{" "}
                    {new Date(o.created_at).toLocaleDateString("es-CO")} ·{" "}
                    {o.channel}
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 font-semibold ${
                      STATUS_TONE[o.status] ?? "bg-cream text-ink/70"
                    }`}
                  >
                    {STATUS[o.status] ?? o.status}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        {/* Desktop: table */}
        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full text-sm">
            <thead className="bg-cream text-left text-ink/60">
              <tr>
                <th className="px-4 py-3">Pedido</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Canal</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-cream">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/pedidos/${o.id}`}
                      className="font-medium text-ink hover:text-brand-orange"
                    >
                      #{o.id.slice(0, 8)}
                    </Link>
                    <div className="text-xs text-ink/50">
                      {new Date(o.created_at).toLocaleDateString("es-CO")}
                    </div>
                  </td>
                  <td className="px-4 py-3">{o.contact_name ?? "—"}</td>
                  <td className="px-4 py-3">{formatCOP(Number(o.total))}</td>
                  <td className="px-4 py-3">{o.channel}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                        STATUS_TONE[o.status] ?? "bg-cream text-ink/70"
                      }`}
                    >
                      {STATUS[o.status] ?? o.status}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length > 0 && (
                <tr className="bg-cream/50 font-semibold text-ink">
                  <td className="px-4 py-3">Total</td>
                  <td className="px-4 py-3 text-ink/50">
                    {orders.length} pedido{orders.length === 1 ? "" : "s"}
                  </td>
                  <td className="px-4 py-3">{formatCOP(revenue)}</td>
                  <td className="px-4 py-3" colSpan={2}>
                    <span className="text-xs font-normal text-ink/50">
                      Solo pagados
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <p className="px-4 py-8 text-center text-ink/50">
            No hay pedidos en el período{statusFilter ? " y filtro" : ""}{" "}
            seleccionado.
          </p>
        )}
      </div>
    </div>
  );
}

function SummaryTile({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-ink/55">
        {label}
      </p>
      <p
        className={`mt-1 text-lg font-bold ${
          accent ? "text-brand-orange" : "text-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
