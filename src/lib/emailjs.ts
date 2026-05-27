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
// The EmailJS template (template_v5ipic2) must use these variables:
//   {{to_email}} (set as the template "To Email"), {{subject}},
//   {{customer}}, {{phone}}, {{channel}}, {{order}}
export async function sendOrderEmail(data: OrderEmail) {
  if (!emailjsReady()) return;
  try {
    await emailjs.send(
      SERVICE!,
      TEMPLATE!,
      {
        to_email: OWNER,
        subject: "Nuevo pedido — Fajicat",
        customer: data.customer,
        phone: data.phone,
        channel: data.channel,
        order: data.order,
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
export async function sendInvoiceEmail(data: InvoiceEmail) {
  if (!SERVICE || !TEMPLATE_INVOICE || !PUBLIC_KEY) {
    throw new Error(
      "EmailJS no configurado para facturas — define NEXT_PUBLIC_EMAILJS_TEMPLATE_INVOICE_ID",
    );
  }
  if (!data.to) throw new Error("El cliente no tiene correo");
  await emailjs.send(
    SERVICE,
    TEMPLATE_INVOICE,
    {
      to_email: data.to,
      subject: `Factura Fajicat — ${data.customer}`,
      customer: data.customer,
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
