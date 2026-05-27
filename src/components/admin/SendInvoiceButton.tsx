"use client";

import { useState } from "react";
import {
  sendInvoiceEmail,
  invoiceEmailReady,
  type InvoiceEmail,
} from "@/lib/emailjs";

export function SendInvoiceButton(props: InvoiceEmail) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  if (!invoiceEmailReady()) {
    return (
      <div className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 print:hidden">
        ⚠️ Email de factura no configurado. Crea una plantilla EmailJS y
        define <code>NEXT_PUBLIC_EMAILJS_TEMPLATE_INVOICE_ID</code>.
      </div>
    );
  }

  if (!props.to) {
    return (
      <div className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 print:hidden">
        El cliente no tiene correo registrado. Edítalo en{" "}
        <a href="/admin/clientes" className="font-semibold underline">
          Clientes
        </a>{" "}
        para poder enviar la factura.
      </div>
    );
  }

  async function send() {
    setStatus("sending");
    setError("");
    try {
      await sendInvoiceEmail(props);
      setStatus("sent");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div className="flex items-center gap-3 print:hidden">
      <button
        type="button"
        onClick={send}
        disabled={status === "sending" || status === "sent"}
        className="inline-flex items-center gap-2 rounded-full bg-brand-green px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-brand-green-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" && <Spinner />}
        {status === "sending" && "Enviando…"}
        {status === "sent" && `✓ Enviado a ${props.to}`}
        {(status === "idle" || status === "error") &&
          `📧 Enviar al cliente (${props.to})`}
      </button>
      {status === "error" && (
        <span className="text-xs text-red-600">Error: {error}</span>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeOpacity="0.25"
      />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
