import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ClientsTable, type ClientRow } from "@/components/admin/ClientsTable";

export const dynamic = "force-dynamic";

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; deleted?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("clients")
    .select("id, name, phone, email")
    .order("name");
  const clients = (data ?? []) as ClientRow[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Clientes</h1>
        <Link
          href="/admin/clientes/nuevo"
          className="rounded-full bg-brand-orange px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-brand-orange-dark"
        >
          + Nuevo cliente
        </Link>
      </div>

      {sp.created && (
        <p className="mt-3 rounded-lg bg-brand-green/15 px-3 py-2 text-sm text-brand-green-dark">
          Cliente <b>{decodeURIComponent(sp.created)}</b> creado.
        </p>
      )}
      {sp.deleted && (
        <p className="mt-3 rounded-lg bg-ink/5 px-3 py-2 text-sm text-ink/70">
          Cliente eliminado.
        </p>
      )}

      <ClientsTable clients={clients} />
    </div>
  );
}
