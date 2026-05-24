type OrderInfo = {
  id: string;
  total: number;
  contactName?: string | null;
  contactPhone?: string | null;
  items: {
    quantity: number;
    product_name: string;
    size: string | null;
    line_total: number | string;
  }[];
};

// Emails the store owner about an order. No-op unless RESEND_API_KEY + OWNER_EMAIL are set.
export async function notifyOwnerOrder(
  order: OrderInfo,
  event: "nuevo" | "pagado",
) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.OWNER_EMAIL;
  if (!apiKey || !to) return;

  const from = process.env.RESEND_FROM ?? "Fajicat <onboarding@resend.dev>";
  const cop = (n: number) =>
    "$" + Number(n).toLocaleString("es-CO", { maximumFractionDigits: 0 });
  const rows = order.items
    .map(
      (i) =>
        `<li>${i.quantity} × ${i.product_name} (${i.size ?? ""}) — ${cop(Number(i.line_total))}</li>`,
    )
    .join("");
  const html = `
    <h2>Pedido ${event} · #${order.id.slice(0, 8)}</h2>
    <p><b>Cliente:</b> ${order.contactName ?? "—"} · ${order.contactPhone ?? "—"}</p>
    <ul>${rows}</ul>
    <p><b>Total:</b> ${cop(order.total)} COP</p>`;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: `Fajicat — pedido ${event} (#${order.id.slice(0, 8)})`,
        html,
      }),
    });
  } catch {
    // best-effort; never block the order on a failed email
  }
}
