import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InvoiceForm, type InvoiceInitial } from "@/components/admin/InvoiceForm";
import { updateInvoice } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

type Item = { size: string | null; quantity: number };
type Client = { id: string; name: string };

export default async function EditarFactura({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const supabase = await createClient();

  const [orderRes, clientsRes] = await Promise.all([
    supabase
      .from("orders")
      .select("*, items:order_items(size, quantity)")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("clients").select("id, name").order("name"),
  ]);

  if (!orderRes.data) notFound();
  const order = orderRes.data;
  const clients = (clientsRes.data ?? []) as Client[];

  const quantities: Record<string, number> = {
    XS: 0,
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
  };
  for (const it of (order.items ?? []) as Item[]) {
    if (it.size && it.size in quantities) {
      quantities[it.size] += Number(it.quantity);
    }
  }

  const initial: InvoiceInitial = {
    orderId: id,
    clientId: order.client_id ?? "",
    date: new Date(order.created_at).toISOString().slice(0, 10),
    quantities,
    totalOverride:
      order.promo_total != null ? String(Number(order.promo_total)) : "",
    notes: order.notes ?? "",
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Editar factura</h1>
        <Link
          href={`/admin/pedidos/${id}`}
          className="text-sm text-ink/60 hover:text-ink"
        >
          ← Volver
        </Link>
      </div>
      <p className="mt-1 text-sm text-ink/60">
        Pedido #{id.slice(0, 8)}. Al guardar se reemplazan todas las líneas.
      </p>
      {sp.error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {sp.error}
        </p>
      )}
      <InvoiceForm
        clients={clients}
        initial={initial}
        action={updateInvoice}
        submitLabel="Guardar cambios"
        pendingLabel="Guardando…"
      />
    </div>
  );
}
