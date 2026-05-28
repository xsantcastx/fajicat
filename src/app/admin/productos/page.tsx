import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCOP } from "@/lib/format";

export const dynamic = "force-dynamic";

type Row = { id: string; name: string; status: string; base_price: number | string };

export default async function AdminProductos() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, status, base_price")
    .order("created_at", { ascending: false });
  const products = (data ?? []) as Row[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-full bg-brand-orange px-4 py-2 text-sm font-semibold text-white"
        >
          Nuevo producto
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-ink/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-ink/60">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Precio base</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-cream">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/productos/${p.id}`}
                    className="font-medium text-ink hover:text-brand-orange"
                  >
                    {p.name}
                  </Link>
                </td>
                <td className="px-4 py-3">{formatCOP(Number(p.base_price))}</td>
                <td className="px-4 py-3">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="px-4 py-8 text-center text-ink/50">
            No hay productos. Crea el primero.
          </p>
        )}
      </div>
    </div>
  );
}
