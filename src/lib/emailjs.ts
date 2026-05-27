"use client";

import emailjs from "@emailjs/browser";

const SERVICE = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const TEMPLATE_CUSTOMER = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CUSTOMER_ID;
const TEMPLATE_INVOICE = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_INVOICE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const OWNER = process.env.NEXT_PUBLIC_OWNER_EMAIL ?? "mariana.rtp123@gmail.com";

export function emailjsReady() {
  return Boolean(SERVICE && TEMPLATE && PUBLIC_KEY);
}

export type OrderEmail = {
  customer: string;
  phone: string;
  channel: string;
  order: string; // multiline summary
};

// Sends the owner a notification from the browser. No-op if not configured.
// Sends BOTH legacy variables ({{customer}}, {{phone}}, {{channel}}, {{order}})
// AND unified variables ({{heading}}, {{intro}}, {{meta_label}}, {{meta_value}},
// {{body_label}}, {{body}}, {{footer}}) so the same template can be used for
// both order notifications and invoices.
export async function sendOrderEmail(data: OrderEmail) {
  if (!emailjsReady()) return;
  try {
    await emailjs.send(
      SERVICE!,
      TEMPLATE!,
      {
        to_email: OWNER,
        subject: "Nuevo pedido — Fajicat",
        // legacy variables
        customer: data.customer,
        phone: data.phone,
        channel: data.channel,
        order: data.order,
        // unified variables
        heading: "¡Nuevo pedido! 🐾",
        intro: `Recibiste un pedido por ${data.channel}.`,
        meta_label: "Cliente",
        meta_value: data.phone
          ? `${data.customer} · ${data.phone}`
          : data.customer,
        body_label: "Detalle del pedido",
        body: data.order,
        footer: "",
      },
      { publicKey: PUBLIC_KEY! },
    );
  } catch {
    // best-effort; never block the order flow on a failed email
  }
}

export type CustomerEmail = {
  to: string;
  customer: string;
  order: string;
};

export type InvoiceEmail = {
  to: string;
  customer: string;
  date: string;
  items: string;
  subtotal: string;
  total: string;
  total_label: string;
};

export function invoiceEmailReady() {
  return Boolean(SERVICE && TEMPLATE_INVOICE && PUBLIC_KEY);
}

// Sends an invoice to the client. Throws on failure so the UI can surface it.
// Uses the unified template variables (heading/intro/meta/body/footer) so a
// single EmailJS template can render both order notifications and invoices.
export async function sendInvoiceEmail(data: InvoiceEmail) {
  if (!SERVICE || !TEMPLATE_INVOICE || !PUBLIC_KEY) {
    throw new Error(
      "EmailJS no configurado para facturas — define NEXT_PUBLIC_EMAILJS_TEMPLATE_INVOICE_ID",
    );
  }
  if (!data.to) throw new Error("El cliente no tiene correo");

  const body = `${data.items}\n\nSubtotal: ${data.subtotal}\n${data.total_label}: ${data.total}`;

  await emailjs.send(
    SERVICE,
    TEMPLATE_INVOICE,
    {
      to_email: data.to,
      subject: `Factura Fajicat — ${data.customer}`,
      // unified variables
      customer: data.customer,
      heading: `Hola, ${data.customer} 🐾`,
      intro: "Te enviamos tu cuenta de cobro de Fajicat.",
      meta_label: "Fecha",
      meta_value: data.date,
      body_label: "Detalle",
      body,
      footer:
        "Métodos de pago\nBanco: Bancolombia\nCuenta ahorros # 33126948170",
      // legacy variables (for backward compatibility if the template still
      // uses {{order}} etc.)
      order: body,
      phone: "",
      channel: "Factura",
      date: data.date,
      items: data.items,
      subtotal: data.subtotal,
      total: data.total,
      total_label: data.total_label,
    },
    { publicKey: PUBLIC_KEY },
  );
}

// Sends the customer an order confirmation. No-op unless the customer template + email exist.
export async function sendCustomerEmail(data: CustomerEmail) {
  if (!SERVICE || !TEMPLATE_CUSTOMER || !PUBLIC_KEY || !data.to) return;
  try {
    await emailjs.send(
      SERVICE,
      TEMPLATE_CUSTOMER,
      {
        to_email: data.to,
        subject: "Tu pedido en Fajicat 🐾",
        customer: data.customer,
        order: data.order,
      },
      { publicKey: PUBLIC_KEY },
    );
  } catch {
    // best-effort
  }
}
