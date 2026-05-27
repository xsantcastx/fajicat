import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateOrderStatus } from "@/app/admin/actions";
import { formatCOP } from "@/lib/format";
import { DeleteOrderButton } from "@/components/admin/DeleteOrderButton";

export const dynamic = "force-dynamic";

const STATUSES: [string, string][] = [
  ["pending", "Pendiente"],
  ["paid", "Pagado"],
  ["shipped", "Enviado"],
  ["delivered", "Entregado"],
  ["cancelled", "Cancelado"],
];

type Item = {
  id: string;
  product_name: string;
  size: string | null;
  quantity: number;
  line_total: number | string;
};

export default async function OrderDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("id", id)
    .maybeSingle();
  if (!order) notFound();

  const items = (order.items ?? []) as Item[];
  const addr = (order.shipping_address ?? {}) as {
    address?: string;
    city?: string;
    notes?: string;
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">
          Pedido #{order.id.slice(0, 8)}
        </h1>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/pedidos/${order.id}/editar`}
            className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-ink/5"
          >
            Editar
          </Link>
          <Link
            href={`/admin/pedidos/${order.id}/factura`}
            className="rounded-full border border-brand-orange px-4 py-2 text-sm font-semibold text-brand-orange transition hover:bg-brand-orange/10"
          >
            Ver factura
          </Link>
        </div>
      </div>
      {sp.saved && (
        <p className="mt-3 rounded-lg bg-brand-green/15 px-3 py-2 text-sm text-brand-green-dark">
          Cambios guardados.
        </p>
      )}

      <div className="rounded-2xl border border-ink/10 bg-white p-6">
        <h2 className="font-bold text-ink">Productos</h2>
        <ul className="mt-3 divide-y divide-ink/10">
          {items.map((it) => (
            <li key={it.id} className="flex justify-between py-2 text-sm">
              <span>
                {it.quantity} × {it.product_name} ({it.size})
              </span>
              <span>{formatCOP(Number(it.line_total))}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-ink/10 pt-3 font-bold">
          <span>Total</span>
          <span>{formatCOP(Number(order.total))}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-6 text-sm">
        <h2 className="font-bold text-ink">Cliente</h2>
        <p className="mt-2 text-ink/70">{order.contact_name ?? "—"}</p>
        <p className="text-ink/70">
          {order.contact_phone ?? "—"} · {order.contact_email ?? "—"}
        </p>
        <p className="text-ink/70">
          {[addr.address, addr.city].filter(Boolean).join(", ") || "—"}
        </p>
        {addr.notes && <p className="mt-1 text-ink/50">Notas: {addr.notes}</p>}
      </div>

      <form
        action={updateOrderStatus}
        className="flex items-end gap-3 rounded-2xl border border-ink/10 bg-white p-6"
      >
        <input type="hidden" name="id" value={order.id} />
        <label className="text-sm">
          Estado
          <select
            name="status"
            defaultValue={order.status}
            className="block w-48 rounded-xl border border-ink/15 px-4 py-2.5 text-sm"
          >
            {STATUSES.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <button className="rounded-full bg-brand-orange px-6 py-2.5 font-semibold text-white">
          Actualizar
        </button>
      </form>

      <div className="rounded-2xl border border-red-200 bg-red-50/30 p-6">
        <h3 className="font-bold text-ink">Zona de peligro</h3>
        <p className="mt-1 text-sm text-ink/70">
          Eliminar este pedido también borra todas sus líneas. No se puede
          deshacer.
        </p>
        <DeleteOrderButton
          orderId={order.id}
          label={`pedido #${order.id.slice(0, 8)}`}
        />
      </div>
    </div>
  );
}
