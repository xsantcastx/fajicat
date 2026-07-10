import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCOP } from "@/lib/format";
import { bucketize, resolveRange } from "@/lib/dateRange";
import { DateRangePicker } from "@/components/admin/DateRangePicker";
import { KpiTile } from "@/components/admin/dashboard/KpiTile";
import { RevenueTrend } from "@/components/admin/dashboard/RevenueTrend";
import { SizeBars } from "@/components/admin/dashboard/SizeBars";
import { ChannelSplit } from "@/components/admin/dashboard/ChannelSplit";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
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

type OrderRow = {
  id: string;
  created_at: string;
  contact_name: string | null;
  total: number | string;
  status: string;
  channel: string;
};

type ItemRow = {
  size: string | null;
  quantity: number;
};

type LowStock = {
  size: string;
  stock_qty: number;
  product: { name: string } | { name: string }[] | null;
};

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; from?: string; to?: string }>;
}) {
  const params = await searchParams;
  const range = resolveRange(params);
  const supabase = await createClient();

  const fromISO = range.from.toISOString();
  const toISO = range.to.toISOString();
  const prevFromISO = range.prevFrom.toISOString();
  const prevToISO = range.prevTo.toISOString();

  const [
    ordersInRangeRes,
    prevOrdersRes,
    itemsInRangeRes,
    recentRes,
    lowStockRes,
    clientsRes,
    productsRes,
  ] = await Promise.all([
    // Every order in range (we compute revenue / counts / channel / trend in JS)
    supabase
      .from("orders")
      .select("id, created_at, total, status, channel")
      .gte("created_at", fromISO)
      .lte("created_at", toISO),
    // Previous-period orders — only fields needed for delta
    supabase
      .from("orders")
      .select("total, status")
      .gte("created_at", prevFromISO)
      .lte("created_at", prevToISO),
    // Paid line items in range for the talla widget
    supabase
      .from("order_items")
      .select("size, quantity, orders!inner(status, created_at)")
      .eq("orders.status", "paid")
      .gte("orders.created_at", fromISO)
      .lte("orders.created_at", toISO),
    // Recent orders (ignores range — always the last 5 anywhere)
    supabase
      .from("orders")
      .select("id, created_at, contact_name, total, status, channel")
      .order("created_at", { ascending: false })
      .limit(5),
    // Live stock — present-tense, not date-scoped
    supabase
      .from("product_variants")
      .select("size, stock_qty, product:products(name)")
      .lt("stock_qty", 5)
      .order("stock_qty")
      .limit(8),
    supabase.from("clients").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }),
  ]);

  const ordersInRange = (ordersInRangeRes.data ?? []) as OrderRow[];
  const prevOrders = (prevOrdersRes.data ?? []) as Pick<
    OrderRow,
    "total" | "status"
  >[];
  const items = (itemsInRangeRes.data ?? []) as ItemRow[];
  const recent = (recentRes.data ?? []) as OrderRow[];
  const lowStock = (lowStockRes.data ?? []) as LowStock[];

  const paidOrders = ordersInRange.filter((o) => o.status === "paid");
  const revenue = paidOrders.reduce((s, o) => s + Number(o.total), 0);
  const paidCount = paidOrders.length;
  const pendingCount = ordersInRange.filter(
    (o) => o.status === "pending",
  ).length;
  const avgTicket = paidCount > 0 ? revenue / paidCount : 0;

  const prevPaid = prevOrders.filter((o) => o.status === "paid");
  const prevRevenue = prevPaid.reduce((s, o) => s + Number(o.total), 0);
  const prevPaidCount = prevPaid.length;
  const prevPending = prevOrders.filter((o) => o.status === "pending").length;
  const prevAvgTicket = prevPaidCount > 0 ? prevRevenue / prevPaidCount : 0;

  // Revenue trend buckets
  const trend = bucketize(
    range,
    paidOrders.map((o) => ({
      at: new Date(o.created_at),
      value: Number(o.total),
    })),
  );

  // Talla aggregation
  const bySizeMap = new Map<string, number>();
  for (const it of items) {
    if (!it.size) continue;
    bySizeMap.set(it.size, (bySizeMap.get(it.size) ?? 0) + it.quantity);
  }
  const bySize = Array.from(bySizeMap.entries()).map(([size, qty]) => ({
    size,
    qty,
  }));

  // Channel split
  const web = ordersInRange.filter((o) => o.channel === "web").length;
  const whatsapp = ordersInRange.filter((o) => o.channel === "whatsapp").length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm capitalize text-ink/60">{range.label}</p>
      </header>

      <DateRangePicker resolved={range} basePath="/admin" />

      {/* KPIs */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiTile
          label="Ingresos"
          value={formatCOP(revenue)}
          numeric={revenue}
          prev={prevRevenue}
          accent
        />
        <KpiTile
          label="Pedidos pagados"
          value={paidCount}
          prev={prevPaidCount}
          href={`/admin/pedidos?range=${range.key}&status=paid`}
        />
        <KpiTile
          label="Ticket promedio"
          value={formatCOP(Math.round(avgTicket))}
          numeric={Math.round(avgTicket)}
          prev={Math.round(prevAvgTicket)}
        />
        <KpiTile
          label="Pendientes"
          value={pendingCount}
          prev={prevPending}
          invertDelta
          href={`/admin/pedidos?range=${range.key}&status=pending`}
        />
      </section>

      {/* Trend + tallas */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueTrend buckets={trend} bucket={range.bucket} />
        </div>
        <SizeBars data={bySize} />
      </section>

      {/* Canal + últimos + stock */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChannelSplit web={web} whatsapp={whatsapp} />

        <div className="rounded-2xl border border-ink/10 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Últimos pedidos</h2>
            <Link
              href="/admin/pedidos"
              className="text-sm font-semibold text-brand-orange hover:underline"
            >
              Ver todos →
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="mt-6 text-center text-sm text-ink/50">
              Aún no hay pedidos.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-ink/10">
              {recent.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/admin/pedidos/${o.id}`}
                    className="flex items-center justify-between gap-3 py-2.5 hover:bg-cream"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">
                        {o.contact_name || `#${o.id.slice(0, 8)}`}
                      </p>
                      <p className="text-xs text-ink/50">
                        {new Date(o.created_at).toLocaleDateString("es-CO")}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        STATUS_TONE[o.status] ?? "bg-cream text-ink/70"
                      }`}
                    >
                      {STATUS_LABEL[o.status] ?? o.status}
                    </span>
                    <span className="w-20 text-right text-sm font-semibold text-ink">
                      {formatCOP(Number(o.total))}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Stock bajo</h2>
            <Link
              href="/admin/productos"
              className="text-sm font-semibold text-brand-orange hover:underline"
            >
              Ver productos →
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="mt-6 text-center text-sm text-ink/50">
              Todo en stock ✓
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-ink/10">
              {lowStock.map((v, i) => {
                const product = Array.isArray(v.product)
                  ? v.product[0]
                  : v.product;
                const outOfStock = v.stock_qty === 0;
                return (
                  <li
                    key={i}
                    className="flex items-center justify-between py-2.5"
                  >
                    <span className="text-sm font-medium text-ink">
                      {product?.name ?? "Producto"} · talla{" "}
                      <b className="text-brand-orange">{v.size}</b>
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        outOfStock
                          ? "bg-red-100 text-red-700"
                          : "bg-brand-orange/15 text-brand-orange-dark"
                      }`}
                    >
                      {outOfStock ? "Agotado" : `${v.stock_qty} u.`}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <QuickAction
          href="/admin/facturas/nueva"
          title="Nueva factura"
          subtitle="Crear una factura para un cliente"
        />
        <QuickAction
          href="/admin/clientes/nuevo"
          title="Nuevo cliente"
          subtitle="Guardar un cliente nuevo"
        />
        <QuickAction
          href="/admin/productos/nuevo"
          title="Nuevo producto"
          subtitle="Agregar un producto al catálogo"
        />
      </section>

      {/* Footnote for totals */}
      <p className="text-xs text-ink/40">
        {productsRes.count ?? 0} productos · {clientsRes.count ?? 0} clientes
      </p>
    </div>
  );
}

function QuickAction({
  href,
  title,
  subtitle,
}: {
  href: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-2xl border border-brand-orange/25 bg-brand-orange/5 px-5 py-4 transition hover:border-brand-orange hover:bg-brand-orange/10"
    >
      <div>
        <p className="font-bold text-ink">{title}</p>
        <p className="text-xs text-ink/60">{subtitle}</p>
      </div>
      <span className="ml-auto text-brand-orange">→</span>
    </Link>
  );
}
