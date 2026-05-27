import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
};

export default async function ClientesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clients")
    .select("id, name, phone, email")
    .order("name");
  const clients = (data ?? []) as Row[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Clientes</h1>
        <Link
          href="/admin/clientes/nuevo"
          className="rounded-full bg-brand-orange px-4 py-2 text-sm font-semibold text-white"
        >
          Nuevo cliente
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-ink/60">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Correo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {clients.map((c) => (
              <tr key={c.id} className="hover:bg-cream">
                <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                <td className="px-4 py-3 text-ink/70">{c.phone || "—"}</td>
                <td className="px-4 py-3 text-ink/70">{c.email || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {clients.length === 0 && (
          <p className="px-4 py-8 text-center text-ink/50">
            Aún no hay clientes. Crea el primero.
          </p>
        )}
      </div>
    </div>
  );
}
