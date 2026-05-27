import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateClientAction } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { DeleteClientButton } from "@/components/admin/DeleteClientButton";

export const dynamic = "force-dynamic";

const input =
  "w-full rounded-xl border border-ink/15 px-4 py-2.5 text-sm outline-none focus:border-brand-orange";

type Client = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
};

export default async function ClientePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("clients")
    .select("id, name, phone, email, address, notes")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const client = data as Client;

  // How many invoices/orders reference this client?
  const { count: invoiceCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("client_id", id);

  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">{client.name}</h1>
          <p className="mt-1 text-sm text-ink/60">
            {invoiceCount ?? 0}{" "}
            {invoiceCount === 1 ? "factura asociada" : "facturas asociadas"}
          </p>
        </div>
        <Link
          href="/admin/clientes"
          className="text-sm text-ink/60 hover:text-ink"
        >
          ← Volver
        </Link>
      </div>

      {sp.saved && (
        <p className="mt-3 rounded-lg bg-brand-green/15 px-3 py-2 text-sm text-brand-green-dark">
          Cambios guardados.
        </p>
      )}
      {sp.error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {sp.error}
        </p>
      )}

      <form
        action={updateClientAction}
        className="mt-6 space-y-4 rounded-2xl border border-ink/10 bg-white p-6"
      >
        <input type="hidden" name="id" value={client.id} />
        <label className="block text-sm font-medium text-ink/70">
          Nombre
          <input
            name="name"
            required
            defaultValue={client.name}
            className={input}
          />
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium text-ink/70">
            Teléfono
            <input
              name="phone"
              defaultValue={client.phone ?? ""}
              className={input}
            />
          </label>
          <label className="block text-sm font-medium text-ink/70">
            Correo
            <input
              name="email"
              type="email"
              defaultValue={client.email ?? ""}
              className={input}
            />
          </label>
        </div>
        <label className="block text-sm font-medium text-ink/70">
          Dirección
          <input
            name="address"
            defaultValue={client.address ?? ""}
            className={input}
          />
        </label>
        <label className="block text-sm font-medium text-ink/70">
          Notas
          <textarea
            name="notes"
            rows={3}
            defaultValue={client.notes ?? ""}
            className={input}
          />
        </label>
        <SubmitButton pendingText="Guardando…">Guardar cambios</SubmitButton>
      </form>

      <div className="mt-6 rounded-2xl border border-red-200 bg-red-50/30 p-6">
        <h3 className="font-bold text-ink">Zona de peligro</h3>
        <p className="mt-1 text-sm text-ink/70">
          Al eliminar este cliente sus facturas se conservan, pero quedan sin
          cliente asociado (la información del cliente ya está copiada en cada
          factura).
        </p>
        <DeleteClientButton clientId={client.id} clientName={client.name} />
      </div>
    </div>
  );
}
