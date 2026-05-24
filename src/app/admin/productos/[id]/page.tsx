import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  updateProduct,
  deleteProduct,
  addVariant,
  updateVariant,
  deleteVariant,
} from "@/app/admin/actions";
import { ImageManager } from "@/components/admin/ImageManager";

export const dynamic = "force-dynamic";

const input =
  "w-full rounded-xl border border-ink/15 px-4 py-2.5 text-sm outline-none focus:border-brand-orange";

type Variant = {
  id: string;
  size: string;
  price: number | string | null;
  stock_qty: number;
  position: number;
};
type Img = { id: string; url: string };
type Cat = { id: string; name: string };

export default async function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*, variants:product_variants(*), images:product_images(id, url)")
    .eq("id", id)
    .maybeSingle();
  if (!product) notFound();

  const { data: catData } = await supabase
    .from("categories")
    .select("id, name")
    .order("position");
  const categories = (catData ?? []) as Cat[];
  const variants = ((product.variants ?? []) as Variant[])
    .slice()
    .sort((a, b) => a.position - b.position);
  const images = (product.images ?? []) as Img[];

  return (
    <div className="max-w-2xl space-y-10">
      <h1 className="text-2xl font-bold text-ink">Editar producto</h1>

      <form
        action={updateProduct}
        className="space-y-4 rounded-2xl border border-ink/10 bg-white p-6"
      >
        <input type="hidden" name="id" value={product.id} />
        <label className="block text-sm font-medium text-ink/70">
          Nombre
          <input name="name" defaultValue={product.name} className={input} />
        </label>
        <label className="block text-sm font-medium text-ink/70">
          Descripción
          <textarea
            name="description"
            rows={4}
            defaultValue={product.description ?? ""}
            className={input}
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-medium text-ink/70">
            Precio base (COP)
            <input
              name="base_price"
              type="number"
              min="0"
              defaultValue={Number(product.base_price)}
              className={input}
            />
          </label>
          <label className="block text-sm font-medium text-ink/70">
            Categoría
            <select
              name="category_id"
              defaultValue={product.category_id ?? ""}
              className={input}
            >
              <option value="">Sin categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-medium text-ink/70">
            Estado
            <select name="status" defaultValue={product.status} className={input}>
              <option value="draft">Borrador</option>
              <option value="active">Activo</option>
              <option value="archived">Archivado</option>
            </select>
          </label>
          <label className="flex items-center gap-2 pt-7 text-sm text-ink/70">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={product.featured}
            />
            Destacado
          </label>
        </div>
        <button className="rounded-full bg-brand-orange px-6 py-2.5 font-semibold text-white">
          Guardar
        </button>
      </form>

      <div className="rounded-2xl border border-ink/10 bg-white p-6">
        <h2 className="text-lg font-bold text-ink">Imágenes</h2>
        <div className="mt-4">
          <ImageManager productId={product.id} images={images} />
        </div>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-6">
        <h2 className="text-lg font-bold text-ink">Tallas / variantes</h2>
        <div className="mt-4 space-y-3">
          {variants.map((v) => (
            <form key={v.id} action={updateVariant} className="flex flex-wrap items-end gap-2">
              <input type="hidden" name="id" value={v.id} />
              <input type="hidden" name="product_id" value={product.id} />
              <div className="text-sm">
                <span className="block text-ink/60">Talla</span>
                <span className="font-semibold">{v.size}</span>
              </div>
              <label className="text-sm">
                Precio
                <input
                  name="price"
                  type="number"
                  min="0"
                  defaultValue={v.price == null ? "" : Number(v.price)}
                  className={`${input} w-32`}
                />
              </label>
              <label className="text-sm">
                Stock
                <input
                  name="stock_qty"
                  type="number"
                  min="0"
                  defaultValue={v.stock_qty}
                  className={`${input} w-24`}
                />
              </label>
              <button className="rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white">
                Guardar
              </button>
              <button
                formAction={deleteVariant}
                className="rounded-full border border-ink/15 px-3 py-2 text-sm text-ink/60"
              >
                Eliminar
              </button>
            </form>
          ))}
        </div>
        <form
          action={addVariant}
          className="mt-5 flex flex-wrap items-end gap-2 border-t border-ink/10 pt-5"
        >
          <input type="hidden" name="product_id" value={product.id} />
          <label className="text-sm">
            Talla
            <input name="size" required placeholder="XS" className={`${input} w-24`} />
          </label>
          <label className="text-sm">
            Precio
            <input
              name="price"
              type="number"
              min="0"
              placeholder="(base)"
              className={`${input} w-32`}
            />
          </label>
          <label className="text-sm">
            Stock
            <input
              name="stock_qty"
              type="number"
              min="0"
              defaultValue={0}
              className={`${input} w-24`}
            />
          </label>
          <button className="rounded-full bg-brand-orange px-4 py-2 text-sm font-semibold text-white">
            Agregar talla
          </button>
        </form>
      </div>

      <form action={deleteProduct}>
        <input type="hidden" name="id" value={product.id} />
        <button className="text-sm text-red-500 hover:underline">
          Eliminar producto
        </button>
      </form>
    </div>
  );
}
