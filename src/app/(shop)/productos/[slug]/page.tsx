import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/catalog";
import { ProductGallery } from "@/components/storefront/ProductGallery";
import { AddToCart } from "@/components/storefront/AddToCart";
import { SizeGuide } from "@/components/storefront/SizeGuide";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product ? `${product.name} — Fajicat` : "Producto — Fajicat",
    description: product?.description ?? undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <section className="mx-auto max-w-5xl px-5 py-12">
      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery product={product} />
        <div>
          {product.category && (
            <span className="text-sm font-medium text-brand-green-dark">
              {product.category.name}
            </span>
          )}
          <h1 className="mt-1 text-3xl font-bold text-ink">{product.name}</h1>
          {product.description && (
            <p className="mt-4 leading-relaxed text-ink/70">
              {product.description}
            </p>
          )}
          <div className="mt-8">
            <AddToCart product={product} />
          </div>
        </div>
      </div>
      <SizeGuide />
    </section>
  );
}
