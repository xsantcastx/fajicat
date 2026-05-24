import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/catalog";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const productUrls = products.map((p) => ({
    url: `${BASE}/productos/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/productos`, changeFrequency: "weekly", priority: 0.9 },
    ...productUrls,
  ];
}
