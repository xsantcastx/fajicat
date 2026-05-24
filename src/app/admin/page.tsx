import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [products, orders, pending] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  const cards = [
    { label: "Productos", value: products.count ?? 0, href: "/admin/productos" },
    { label: "Pedidos", value: orders.count ?? 0, href: "/admin/pedidos" },
    { label: "Pendientes", value: pending.count ?? 0, href: "/admin/pedidos" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-ink/10 bg-white p-6 transition hover:shadow-md"
          >
            <p className="text-sm text-ink/60">{c.label}</p>
            <p className="mt-2 text-3xl font-bold text-ink">{c.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
