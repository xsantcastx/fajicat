import { NextResponse } from "next/server";
import { Preference } from "mercadopago";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isMercadoPagoConfigured } from "@/lib/payments";
import { mpClient } from "@/lib/mercadopago";
import { shippingFor } from "@/lib/shipping";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

type ReqItem = { variantId: string; quantity: number };

type ProductRel = { name: string; base_price: number | string; status: string };
type VarRow = {
  id: string;
  size: string;
  price: number | string | null;
  stock_qty: number;
  product: ProductRel | ProductRel[] | null;
};

export async function POST(request: Request) {
  if (!isSupabaseConfigured() || !isMercadoPagoConfigured()) {
    return NextResponse.json(
      { error: "El pago en línea no está disponible." },
      { status: 503 },
    );
  }

  let payload: { items?: ReqItem[]; contact?: Record<string, string> };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const reqItems = Array.isArray(payload.items) ? payload.items : [];
  const contact = payload.contact ?? {};
  if (reqItems.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
  }

  const admin = createAdminClient();
  const ids = reqItems.map((i) => String(i.variantId));
  const { data, error } = await admin
    .from("product_variants")
    .select("id, size, price, stock_qty, product:products(name, base_price, status)")
    .in("id", ids);

  if (error || !data) {
    return NextResponse.json(
      { error: "No se pudieron validar los productos." },
      { status: 500 },
    );
  }
  const variants = data as unknown as VarRow[];

  const orderItems: {
    variant_id: string;
    product_name: string;
    size: string;
    unit_price: number;
    quantity: number;
    line_total: number;
  }[] = [];
  let subtotal = 0;

  for (const ri of reqItems) {
    const v = variants.find((x) => x.id === ri.variantId);
    const qty = Math.max(1, Number(ri.quantity) || 1);
    if (!v) {
      return NextResponse.json(
        { error: "Producto no encontrado." },
        { status: 400 },
      );
    }
    const product = Array.isArray(v.product) ? v.product[0] : v.product;
    if (!product || product.status !== "active") {
      return NextResponse.json(
        { error: "Producto no disponible." },
        { status: 400 },
      );
    }
    if (v.stock_qty < qty) {
      return NextResponse.json(
        { error: `Stock insuficiente para la talla ${v.size}.` },
        { status: 400 },
      );
    }
    const unit = v.price == null ? Number(product.base_price) : Number(v.price);
    subtotal += unit * qty;
    orderItems.push({
      variant_id: v.id,
      product_name: product.name,
      size: v.size,
      unit_price: unit,
      quantity: qty,
      line_total: unit * qty,
    });
  }

  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  // Associate the order with the logged-in user, if any.
  let userId: string | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    userId = null;
  }

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      user_id: userId,
      status: "pending",
      channel: "web",
      subtotal,
      shipping,
      total,
      currency: "COP",
      contact_name: contact.name ?? null,
      contact_phone: contact.phone ?? null,
      contact_email: contact.email ?? null,
      shipping_address: {
        city: contact.city ?? null,
        address: contact.address ?? null,
        notes: contact.notes ?? null,
      },
      payment_provider: "mercadopago",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: "No se pudo crear el pedido." },
      { status: 500 },
    );
  }

  await admin
    .from("order_items")
    .insert(orderItems.map((oi) => ({ ...oi, order_id: order.id })));

  try {
    const pref = await new Preference(mpClient()).create({
      body: {
        items: [
          ...orderItems.map((oi, idx) => ({
            id: String(idx),
            title: `${oi.product_name} talla ${oi.size}`,
            quantity: oi.quantity,
            unit_price: oi.unit_price,
            currency_id: "COP",
          })),
          ...(shipping > 0
            ? [
                {
                  id: "shipping",
                  title: "Envío",
                  quantity: 1,
                  unit_price: shipping,
                  currency_id: "COP",
                },
              ]
            : []),
        ],
        external_reference: order.id,
        back_urls: {
          success: `${SITE}/checkout/exito`,
          failure: `${SITE}/checkout/error`,
          pending: `${SITE}/checkout/pendiente`,
        },
        auto_return: "approved",
        notification_url: `${SITE}/api/webhooks/mercadopago`,
        payer: {
          name: contact.name || undefined,
          email: contact.email || undefined,
        },
      },
    });

    const url = pref.init_point ?? pref.sandbox_init_point;
    if (!url) {
      return NextResponse.json(
        { error: "No se pudo iniciar el pago." },
        { status: 500 },
      );
    }
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json(
      { error: "No se pudo iniciar el pago." },
      { status: 500 },
    );
  }
}
