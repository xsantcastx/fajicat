export type Category = {
  id: string;
  slug: string;
  name: string;
};

export type ProductImage = {
  id: string;
  url: string;
  alt: string | null;
  position: number;
};

export type Variant = {
  id: string;
  size: string;
  sku: string | null;
  price: number | null; // null => fall back to product.base_price
  stock_qty: number;
  position: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  base_price: number;
  featured: boolean;
  status: string;
  category: Category | null;
  images: ProductImage[];
  variants: Variant[];
};
