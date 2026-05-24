import Link from "next/link";
import { ProductThumb } from "./ProductThumb";
import { priceRange } from "@/lib/catalog";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden">
        <div className="h-full w-full transition duration-300 group-hover:scale-105">
          <ProductThumb product={product} />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-ink">{product.name}</h3>
        {product.category && (
          <p className="mt-0.5 text-sm text-ink/60">{product.category.name}</p>
        )}
        <p className="mt-2 font-bold text-brand-orange">
          {priceRange(product)}
        </p>
      </div>
    </Link>
  );
}
