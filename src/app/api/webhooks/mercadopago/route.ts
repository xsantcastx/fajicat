import { NextResponse } from "next/server";
import crypto from "crypto";
import { Payment } from "mercadopago";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isMercadoPagoConfigured } from "@/lib/payments";
import { mpClient } from "@/lib/mercadopago";
import { notifyOwnerOrder } from "@/lib/notify";

// Verifies the x-signature header per MercadoPago's spec.
function verifySignature(request: Request, dataId: string): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) return true; // not enforced if no secret configured

  const signature = request.headers.get("x-signature");
  const requestId = request.headers.get("x-request-id");
  if (!signature) return false;

  const parts = Object.fromEntries(
    signature.split(",").map((p) => {
      const [k, v] = p.split("=");
      return [k?.trim(), v?.trim()];
    }),
  );
  const ts = parts["ts"];
  const v1 = parts["v1"];
  if (!ts || !v1) return false;

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(v1));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured() || !isMercadoPagoConfigured()) {
    return NextResponse.json({ ok: true });
  }

  const url = new URL(request.url);
  let body: { type?: string; action?: string; data?: { id?: string } } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const type = url.searchParams.get("type") ?? body.type ?? body.action;
  if (type && !String(type).includes("payment")) {
    return NextResponse.json({ ok: true }); // ignore non-payment events
  }

  const dataId =
    url.searchParams.get("data.id") ??
    url.searchParams.get("id") ??
    body.data?.id ??
    "";
  if (!dataId) return NextResponse.json({ ok: true });

  if (!verifySignature(request, String(dataId))) {
    return new NextResponse("invalid signature", { status: 401 });
  }

  let paymentStatus: string | undefined;
  let orderId: string | null | undefined;
  let paymentId: string | number | undefined;
  try {
    const payment = await new Payment(mpClient()).get({ id: String(dataId) });
    paymentStatus = payment.status;
    orderId = payment.external_reference;
    paymentId = payment.id;
  } catch {
    return NextResponse.json({ ok: true });
  }

  if (!orderId) return NextResponse.json({ ok: true });

  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("id, status, total, contact_name, contact_phone")
    .eq("id", orderId)
    .maybeSingle();
  if (!order) return NextResponse.json({ ok: true });

  // Idempotent: never downgrade an already-paid order.
  if (order.status === "paid") return NextResponse.json({ ok: true });

  const newStatus =
    paymentStatus === "approved"
      ? "paid"
      : paymentStatus === "rejected" || paymentStatus === "cancelled"
        ? "cancelled"
        : "pending";

  await admin
    .from("orders")
    .update({
      status: newStatus,
      payment_id: paymentId ? String(paymentId) : null,
      payment_status: paymentStatus ?? null,
    })
    .eq("id", orderId);

  if (newStatus === "paid") {
    const { data: items } = await admin
      .from("order_items")
      .select("variant_id, quantity, product_name, size, line_total")
      .eq("order_id", orderId);
    for (const it of items ?? []) {
      if (it.variant_id) {
        await admin.rpc("decrement_variant_stock", {
          p_variant_id: it.variant_id,
          p_qty: it.quantity,
        });
      }
    }
    await notifyOwnerOrder(
      {
        id: orderId,
        total: Number(order.total),
        contactName: order.contact_name,
        contactPhone: order.contact_phone,
        items: items ?? [],
      },
      "pagado",
    );
  }

  return NextResponse.json({ ok: true });
}
