import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { InvoiceForm } from "@/components/admin/InvoiceForm";
import { createInvoice } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

type Client = { id: string; name: string };

export default async function NuevaFactura({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("clients")
    .select("id, name")
    .order("name");
  const clients = (data ?? []) as Client[];

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Nueva factura</h1>
        <Link
          href="/admin/pedidos"
          className="text-sm text-ink/60 hover:text-ink"
        >
          ← Volver
        </Link>
      </div>
      <p className="mt-1 text-ink/60">
        Crea una factura para un cliente. Las cantidades se calculan automáticamente
        y el total es editable para aplicar promociones.
      </p>
      {sp.error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {sp.error}
        </p>
      )}
      <InvoiceForm clients={clients} action={createInvoice} />
    </div>
  );
}
