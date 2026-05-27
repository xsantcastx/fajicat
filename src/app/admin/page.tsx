import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};
const STATUS_TONE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-emerald-100 text-emerald-800",
  shipped: "bg-sky-100 text-sky-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-zinc-200 text-zinc-700",
};

function cop(n: number) {
  return "$" + Math.round(n).toLocaleString("es-CO");
}

type RecentOrder = {
  id: string;
  created_at: string;
  contact_name: string | null;
  total: number | string;
  status: string;
};

type LowStock = {
  size: string;
  stock_qty: number;
  product: { name: string } | { name: string }[] | null;
};

export default async function AdminDashboard() {
  const supabase = await createClient();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    productsRes,
    ordersRes,
    pendingRes,
    paidRes,
    revenueRes,
    clientsRes,
    recentRes,
    lowStockRes,
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "paid"),
    supabase
      .from("orders")
      .select("total")
      .eq("status", "paid")
      .gte("created_at", monthStart.toISOString()),
    supabase.from("clients").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("id, created_at, contact_name, total, status")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("product_variants")
      .select("size, stock_qty, product:products(name)")
      .lt("stock_qty", 5)
      .order("stock_qty")
      .limit(8),
  ]);

  const products = productsRes.count ?? 0;
  const orders = ordersRes.count ?? 0;
  const pending = pendingRes.count ?? 0;
  const paid = paidRes.count ?? 0;
  const clientCount = clientsRes.count ?? 0;
  const revenue = (revenueRes.data ?? []).reduce(
    (s, o) => s + Number(o.total),
    0,
  );
  const recent = (recentRes.data ?? []) as RecentOrder[];
  const lowStock = (lowStockRes.data ?? []) as LowStock[];

  const today = now.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const monthLabel = now.toLocaleDateString("es-CO", { month: "long" });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-ink/60 first-letter:uppercase">
          {today}
        </p>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon="🧾"
          label="Pedidos totales"
          value={orders}
          href="/admin/pedidos"
        />
        <StatCard
          icon="⏳"
          label="Pendientes"
          value={pending}
          tone="amber"
          href="/admin/pedidos"
        />
        <StatCard
          icon="✅"
          label="Pagados"
          value={paid}
          tone="emerald"
          href="/admin/pedidos"
        />
        <StatCard
          icon="💰"
          label={`Ventas (${monthLabel})`}
          value={cop(revenue)}
          tone="orange"
        />
        <StatCard
          icon="🛍️"
          label="Productos"
          value={products}
          href="/admin/productos"
        />
        <StatCard
          icon="👥"
          label="Clientes"
          value={clientCount}
          href="/admin/clientes"
        />
        <StatCard
          icon="⚠️"
          label="Stock bajo"
          value={lowStock.length}
          tone={lowStock.length > 0 ? "amber" : undefined}
        />
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <QuickAction
          href="/admin/facturas/nueva"
          icon="🧾"
          title="Nueva factura"
          subtitle="Crear una factura para un cliente"
        />
        <QuickAction
          href="/admin/clientes/nuevo"
          icon="👤"
          title="Nuevo cliente"
          subtitle="Guardar un cliente nuevo"
        />
        <QuickAction
          href="/admin/productos/nuevo"
          icon="🛍️"
          title="Nuevo producto"
          subtitle="Agregar un producto al catálogo"
        />
      </section>

      {/* Activity */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
            <ul className="mt-4 divide-y divide-ink/10">
              {recent.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/admin/pedidos/${o.id}`}
                    className="flex items-center justify-between gap-3 py-3 hover:bg-cream"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink">
                        {o.contact_name || `#${o.id.slice(0, 8)}`}
                      </p>
                      <p className="text-xs text-ink/50">
                        {new Date(o.created_at).toLocaleDateString("es-CO")}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        STATUS_TONE[o.status] ?? "bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {STATUS_LABEL[o.status] ?? o.status}
                    </span>
                    <span className="w-24 text-right text-sm font-semibold text-ink">
                      {cop(Number(o.total))}
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
              Todo en stock 🎉
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-ink/10">
              {lowStock.map((v, i) => {
                const product = Array.isArray(v.product)
                  ? v.product[0]
                  : v.product;
                return (
                  <li
                    key={i}
                    className="flex items-center justify-between py-3"
                  >
                    <span className="font-medium text-ink">
                      {product?.name ?? "Producto"} · talla{" "}
                      <b className="text-brand-orange">{v.size}</b>
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        v.stock_qty === 0
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {v.stock_qty === 0 ? "Agotado" : `${v.stock_qty} u.`}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

// ----- helpers -----

const TONE_RING: Record<string, string> = {
  amber: "ring-amber-200",
  emerald: "ring-emerald-200",
  orange: "ring-orange-200",
};

function StatCard({
  icon,
  label,
  value,
  tone,
  href,
}: {
  icon: string;
  label: string;
  value: string | number;
  tone?: string;
  href?: string;
}) {
  const card = (
    <div
      className={`h-full rounded-2xl border border-ink/10 bg-white p-5 transition hover:shadow-md ${
        tone ? `ring-1 ${TONE_RING[tone]}` : ""
      }`}
    >
      <div className="text-2xl">{icon}</div>
      <p className="mt-3 text-xs uppercase tracking-wide text-ink/50">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{card}</Link> : card;
}

function QuickAction({
  href,
  icon,
  title,
  subtitle,
}: {
  href: string;
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-2xl border border-brand-orange/25 bg-brand-orange/5 px-5 py-4 transition hover:border-brand-orange hover:bg-brand-orange/10"
    >
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="font-bold text-ink">{title}</p>
        <p className="text-xs text-ink/60">{subtitle}</p>
      </div>
    </Link>
  );
}
