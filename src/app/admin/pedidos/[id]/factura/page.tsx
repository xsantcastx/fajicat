import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatCOP } from "@/lib/format";
import { PrintButton } from "@/components/admin/PrintButton";

export const dynamic = "force-dynamic";

type Item = {
  id: string;
  product_name: string;
  size: string | null;
  quantity: number;
  unit_price: number | string;
  line_total: number | string;
};

export default async function FacturaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("id", id)
    .maybeSingle();
  if (!order) notFound();

  const items = (order.items ?? []) as Item[];
  const date = new Date(order.created_at).toLocaleDateString("es-CO");

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex justify-end">
        <PrintButton />
      </div>

      <div className="rounded-xl border border-ink/10 bg-white p-8 print:border-0 print:p-0">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink">
              FAJICAT
            </h1>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/60">
              Animal Health
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold text-ink">Comodidad para tu mascota</p>
            <p className="text-ink/60">Medellín, Ant.</p>
            <p className="text-ink/60">Cel 314 560 2688</p>
            <p className="text-ink/60">mariana.rtp@gmail.com</p>
          </div>
        </div>

        <div className="mt-6 h-1.5 rounded bg-gradient-to-r from-brand-orange to-brand-green" />

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">CUENTA DE COBRO</h2>
          <p className="text-sm text-ink/60">Fecha: {date}</p>
        </div>
        <p className="mt-1 text-sm text-ink/60">
          Pedido #{order.id.slice(0, 8)} · Cliente: {order.contact_name ?? "—"}
        </p>

        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="bg-ink text-left text-white">
              <th className="px-3 py-2">Producto / Talla</th>
              <th className="px-3 py-2">Cantidad</th>
              <th className="px-3 py-2">Precio</th>
              <th className="px-3 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-b border-ink/10">
                <td className="px-3 py-2">
                  {it.product_name}
                  {it.size ? ` (${it.size})` : ""}
                </td>
                <td className="px-3 py-2">{it.quantity}</td>
                <td className="px-3 py-2">{formatCOP(Number(it.unit_price))}</td>
                <td className="px-3 py-2 text-right">
                  {formatCOP(Number(it.line_total))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <div className="w-60 border-2 border-ink/80 px-4 py-3 text-right">
            <span className="text-lg font-bold text-ink">
              Total: {formatCOP(Number(order.total))}
            </span>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-bold text-ink">Métodos de pago</h3>
          <p className="text-sm text-ink/70">Banco: Bancolombia</p>
          <p className="text-sm text-ink/70">Cuenta ahorros # 33126948170</p>
        </div>
      </div>
    </div>
  );
}
