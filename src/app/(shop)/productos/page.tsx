import type { Metadata } from "next";
import { getProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/storefront/ProductCard";

export const metadata: Metadata = {
  title: "Productos — Fajicat",
  description: "Fajas postquirúrgicas para la recuperación de tu mascota.",
};

export default async function ProductosPage() {
  const products = await getProducts();

  return (
    <section className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="text-3xl font-bold text-ink">Productos</h1>
      <p className="mt-2 text-ink/60">
        Fajas postquirúrgicas para la recuperación de tu mascota.
      </p>

      {products.length === 0 ? (
        <p className="mt-10 text-ink/50">No hay productos disponibles por ahora.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
