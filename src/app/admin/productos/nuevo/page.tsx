import { createClient } from "@/lib/supabase/server";
import { createProduct } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const input =
  "w-full rounded-xl border border-ink/15 px-4 py-2.5 text-sm outline-none focus:border-brand-orange";

type Cat = { id: string; name: string };

export default async function NuevoProducto({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("id, name")
    .order("position");
  const categories = (data ?? []) as Cat[];

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-ink">Nuevo producto</h1>
      {sp.error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {sp.error}
        </p>
      )}
      <form action={createProduct} className="mt-6 space-y-4">
        <input name="name" required placeholder="Nombre" className={input} />
        <input name="slug" placeholder="Slug (opcional)" className={input} />
        <textarea
          name="description"
          rows={4}
          placeholder="Descripción"
          className={input}
        />
        <input
          name="base_price"
          type="number"
          min="0"
          required
          placeholder="Precio base (COP)"
          className={input}
        />
        <select name="category_id" className={input} defaultValue="">
          <option value="">Sin categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select name="status" className={input} defaultValue="draft">
          <option value="draft">Borrador</option>
          <option value="active">Activo</option>
          <option value="archived">Archivado</option>
        </select>
        <button className="rounded-full bg-brand-orange px-6 py-3 font-semibold text-white">
          Crear
        </button>
      </form>
    </div>
  );
}
