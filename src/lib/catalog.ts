import { createClient } from "@supabase/supabase-js";
import { LOCAL_PRODUCTS } from "./catalog-data";
import { formatCOP } from "./format";
import type { Product, Variant } from "./types";

function isConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

const SELECT =
  "id, slug, name, description, base_price, featured, status, " +
  "category:categories(id, slug, name), " +
  "images:product_images(id, url, alt, position), " +
  "variants:product_variants(id, size, sku, price, stock_qty, position)";

type Row = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  base_price: number | string;
  featured: boolean;
  status: string;
  category: { id: string; slug: string; name: string } | null;
  images:
    | { id: string; url: string; alt: string | null; position: number }[]
    | null;
  variants:
    | {
        id: string;
        size: string;
        sku: string | null;
        price: number | string | null;
        stock_qty: number;
        position: number;
      }[]
    | null;
};

function toProduct(r: Row): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description,
    base_price: Number(r.base_price),
    featured: r.featured,
    status: r.status,
    category: r.category,
    images: (r.images ?? []).slice().sort((a, b) => a.position - b.position),
    variants: (r.variants ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((v) => ({ ...v, price: v.price == null ? null : Number(v.price) })),
  };
}

export async function getProducts(): Promise<Product[]> {
  if (!isConfigured()) return LOCAL_PRODUCTS;
  const { data, error } = await db()
    .from("products")
    .select(SELECT)
    .eq("status", "active")
    .order("featured", { ascending: false });
  if (error || !data) return LOCAL_PRODUCTS;
  return (data as unknown as Row[]).map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isConfigured()) {
    return LOCAL_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
  const { data, error } = await db()
    .from("products")
    .select(SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return toProduct(data as unknown as Row);
}

export function variantPrice(product: Product, variant: Variant): number {
  return variant.price ?? product.base_price;
}

export function priceRange(product: Product): string {
  const prices = product.variants.map((v) => v.price ?? product.base_price);
  if (prices.length === 0) return formatCOP(product.base_price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? formatCOP(min) : `${formatCOP(min)} – ${formatCOP(max)}`;
}
