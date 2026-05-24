import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCOP } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS: Record<string, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

type Row = {
  id: string;
  created_at: string;
  contact_name: string | null;
  total: number | string;
  status: string;
  channel: string;
};

export default async function AdminPedidos() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("id, created_at, contact_name, total, status, channel")
    .order("created_at", { ascending: false });
  const orders = (data ?? []) as Row[];

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Pedidos</h1>
      <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white">
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
                <td className="px-4 py-3">{STATUS[o.status] ?? o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="px-4 py-8 text-center text-ink/50">
            Aún no hay pedidos.
          </p>
        )}
      </div>
    </div>
  );
}
