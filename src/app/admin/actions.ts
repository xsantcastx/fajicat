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
