"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") redirect("/");
  return supabase;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createProduct(formData: FormData) {
  const supabase = await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim() || slugify(name);
  const description = String(formData.get("description") ?? "");
  const base_price = Number(formData.get("base_price") ?? 0);
  const category_id = String(formData.get("category_id") ?? "") || null;
  const status = String(formData.get("status") ?? "draft");

  const { data, error } = await supabase
    .from("products")
    .insert({ name, slug, description, base_price, category_id, status })
    .select("id")
    .single();
  if (error || !data) {
    redirect(
      `/admin/productos/nuevo?error=${encodeURIComponent(error?.message ?? "No se pudo crear")}`,
    );
  }
  revalidatePath("/admin/productos");
  redirect(`/admin/productos/${data.id}`);
}

export async function updateProduct(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "");
  const base_price = Number(formData.get("base_price") ?? 0);
  const category_id = String(formData.get("category_id") ?? "") || null;
  const status = String(formData.get("status") ?? "draft");
  const featured = formData.get("featured") === "on";

  await supabase
    .from("products")
    .update({ name, description, base_price, category_id, status, featured })
    .eq("id", id);
  revalidatePath(`/admin/productos/${id}`);
  revalidatePath("/admin/productos");
}

export async function deleteProduct(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/productos");
  redirect("/admin/productos");
}

export async function addVariant(formData: FormData) {
  const supabase = await requireAdmin();
  const product_id = String(formData.get("product_id") ?? "");
  const size = String(formData.get("size") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "");
  const price = priceRaw === "" ? null : Number(priceRaw);
  const stock_qty = Number(formData.get("stock_qty") ?? 0);
  await supabase
    .from("product_variants")
    .insert({ product_id, size, price, stock_qty });
  revalidatePath(`/admin/productos/${product_id}`);
}

export async function updateVariant(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const product_id = String(formData.get("product_id") ?? "");
  const priceRaw = String(formData.get("price") ?? "");
  const price = priceRaw === "" ? null : Number(priceRaw);
  const stock_qty = Number(formData.get("stock_qty") ?? 0);
  await supabase
    .from("product_variants")
    .update({ price, stock_qty })
    .eq("id", id);
  revalidatePath(`/admin/productos/${product_id}`);
}

export async function deleteVariant(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const product_id = String(formData.get("product_id") ?? "");
  await supabase.from("product_variants").delete().eq("id", id);
  revalidatePath(`/admin/productos/${product_id}`);
}

export async function updateOrderStatus(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  await supabase.from("orders").update({ status }).eq("id", id);
  revalidatePath(`/admin/pedidos/${id}`);
  revalidatePath("/admin/pedidos");
}

export async function addProductImage(productId: string, url: string) {
  const supabase = await requireAdmin();
  await supabase
    .from("product_images")
    .insert({ product_id: productId, url, position: 0 });
  revalidatePath(`/admin/productos/${productId}`);
}

export async function deleteProductImage(
  imageId: string,
  url: string,
  productId: string,
) {
  const supabase = await requireAdmin();
  const marker = "/products/";
  const idx = url.indexOf(marker);
  if (idx !== -1) {
    await supabase.storage.from("products").remove([url.slice(idx + marker.length)]);
  }
  await supabase.from("product_images").delete().eq("id", imageId);
  revalidatePath(`/admin/productos/${productId}`);
}

// ----- Clients (B2B/manual invoices) -----

export async function createClientAction(formData: FormData) {
  const supabase = await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    redirect(`/admin/clientes/nuevo?error=${encodeURIComponent("El nombre es obligatorio")}`);
  }
  const phone = String(formData.get("phone") ?? "") || null;
  const email = String(formData.get("email") ?? "") || null;
  const address = String(formData.get("address") ?? "") || null;
  const notes = String(formData.get("notes") ?? "") || null;

  const { error } = await supabase
    .from("clients")
    .insert({ name, phone, email, address, notes });
  if (error) {
    redirect(`/admin/clientes/nuevo?error=${encodeURIComponent(error.message)}`);
  }
  revalidatePath("/admin/clientes");
  redirect("/admin/clientes");
}

// ----- Invoices (admin-created orders for stored clients) -----

const INVOICE_SIZES = ["XS", "S", "M", "L", "XL"] as const;
const INVOICE_PRICES: Record<string, number> = {
  XS: 20000,
  S: 21000,
  M: 21000,
  L: 23000,
  XL: 27000,
};

type VariantRow = { id: string; size: string; price: number | string | null };

export async function createInvoice(formData: FormData) {
  const supabase = await requireAdmin();

  const client_id = String(formData.get("client_id") ?? "");
  if (!client_id) {
    redirect(`/admin/facturas/nueva?error=${encodeURIComponent("Selecciona un cliente")}`);
  }

  // Fetch the faja product + its variants for accurate variant_id linking.
  const { data: product } = await supabase
    .from("products")
    .select("id, name, variants:product_variants(id, size, price)")
    .eq("slug", "faja-postquirurgica")
    .maybeSingle();
  if (!product) {
    redirect(`/admin/facturas/nueva?error=${encodeURIComponent("Producto no encontrado")}`);
  }
  const variants = ((product.variants ?? []) as VariantRow[]) || [];

  type Item = {
    variant_id: string;
    product_name: string;
    size: string;
    unit_price: number;
    quantity: number;
    line_total: number;
  };
  const items: Item[] = [];
  let subtotal = 0;

  for (const size of INVOICE_SIZES) {
    const qty = Math.max(0, Number(formData.get(`qty_${size}`) ?? 0));
    if (qty <= 0) continue;
    const v = variants.find((x) => x.size === size);
    if (!v) continue;
    const unit_price =
      v.price != null ? Number(v.price) : INVOICE_PRICES[size];
    const line_total = unit_price * qty;
    subtotal += line_total;
    items.push({
      variant_id: v.id,
      product_name: product.name,
      size,
      unit_price,
      quantity: qty,
      line_total,
    });
  }

  if (items.length === 0) {
    redirect(`/admin/facturas/nueva?error=${encodeURIComponent("Agrega al menos una talla")}`);
  }

  const totalRaw = String(formData.get("total") ?? "").trim();
  const total = totalRaw === "" ? subtotal : Number(totalRaw);
  const promo_total = total !== subtotal ? total : null;

  // Copy client contact info to the order snapshot (so the invoice still
  // renders correctly even if the client record is edited/deleted later).
  const { data: client } = await supabase
    .from("clients")
    .select("name, phone, email")
    .eq("id", client_id)
    .maybeSingle();

  const dateStr = String(formData.get("date") ?? "");
  const notes = String(formData.get("notes") ?? "") || null;

  const orderPayload: Record<string, unknown> = {
    client_id,
    status: "paid",
    channel: "web",
    subtotal,
    shipping: 0,
    total,
    promo_total,
    currency: "COP",
    contact_name: client?.name ?? null,
    contact_phone: client?.phone ?? null,
    contact_email: client?.email ?? null,
    notes,
  };
  if (dateStr) {
    orderPayload.created_at = new Date(`${dateStr}T12:00:00`).toISOString();
  }

  const { data: order, error: oErr } = await supabase
    .from("orders")
    .insert(orderPayload)
    .select("id")
    .single();
  if (oErr || !order) {
    redirect(`/admin/facturas/nueva?error=${encodeURIComponent(oErr?.message ?? "No se pudo crear la factura")}`);
  }

  await supabase
    .from("order_items")
    .insert(items.map((it) => ({ ...it, order_id: order.id })));

  revalidatePath("/admin/pedidos");
  redirect(`/admin/pedidos/${order.id}/factura`);
}
