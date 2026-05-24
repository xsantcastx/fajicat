import type { Product } from "./types";

// Local fallback catalog — used until Supabase env vars are configured.
// Mirrors supabase/seed.sql.
export const LOCAL_PRODUCTS: Product[] = [
  {
    id: "local-faja-postquirurgica",
    slug: "faja-postquirurgica",
    name: "Faja postquirúrgica",
    description:
      "Faja postquirúrgica para mascotas. Comodidad y protección durante la recuperación de tu gato o perro. Tela suave y transpirable que ayuda a evitar que tu mascota lama o muerda la herida.",
    base_price: 21000,
    featured: true,
    status: "active",
    category: { id: "local-gatos", slug: "gatos", name: "Gatos" },
    images: [],
    variants: [
      { id: "local-xs", size: "XS", sku: "FAJA-XS", price: 20000, stock_qty: 10, position: 1 },
      { id: "local-s", size: "S", sku: "FAJA-S", price: 21000, stock_qty: 10, position: 2 },
      { id: "local-m", size: "M", sku: "FAJA-M", price: 21000, stock_qty: 10, position: 3 },
      { id: "local-l", size: "L", sku: "FAJA-L", price: 23000, stock_qty: 10, position: 4 },
      { id: "local-xl", size: "XL", sku: "FAJA-XL", price: 27000, stock_qty: 10, position: 5 },
    ],
  },
];
