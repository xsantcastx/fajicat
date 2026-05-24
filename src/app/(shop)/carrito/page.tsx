"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart, cartTotal } from "@/lib/cart";
import { formatCOP } from "@/lib/format";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573145602688";

export default function CarritoPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <div className="mx-auto max-w-3xl px-5 py-12" />;
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="text-2xl font-bold text-ink">Tu carrito está vacío</h1>
        <p className="mt-2 text-ink/60">Agrega una faja para tu mascota.</p>
        <Link
          href="/productos"
          className="mt-6 inline-block rounded-full bg-brand-orange px-6 py-3 font-semibold text-white"
        >
          Ver productos
        </Link>
      </section>
    );
  }

  const total = cartTotal(items);
  const lines = items
    .map(
      (i) =>
        `• ${i.quantity} × ${i.productName} talla ${i.size} — ${formatCOP(
          i.unitPrice * i.quantity,
        )}`,
    )
    .join("\n");
  const waText = `¡Hola Fajicat! Quiero hacer este pedido 🐾\n\n${lines}\n\nTotal: ${formatCOP(
    total,
  )}`;
  const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waText)}`;

  return (
    <section className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-3xl font-bold text-ink">Tu carrito</h1>

      <ul className="mt-6 divide-y divide-ink/10">
        {items.map((i) => (
          <li key={i.variantId} className="flex items-center gap-4 py-4">
            <div className="flex-1">
              <p className="font-semibold text-ink">{i.productName}</p>
              <p className="text-sm text-ink/60">
                Talla {i.size} · {formatCOP(i.unitPrice)}
              </p>
            </div>
            <div className="flex items-center rounded-lg border border-ink/15">
              <button
                type="button"
                onClick={() => setQty(i.variantId, i.quantity - 1)}
                className="px-2.5 py-1"
                aria-label="Restar"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-semibold">
                {i.quantity}
              </span>
              <button
                type="button"
                onClick={() => setQty(i.variantId, i.quantity + 1)}
                className="px-2.5 py-1"
                aria-label="Sumar"
              >
                +
              </button>
            </div>
            <div className="w-24 text-right font-semibold text-ink">
              {formatCOP(i.unitPrice * i.quantity)}
            </div>
            <button
              type="button"
              onClick={() => remove(i.variantId)}
              className="text-ink/40 transition hover:text-red-500"
              aria-label="Quitar"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-6">
        <button
          type="button"
          onClick={clear}
          className="text-sm text-ink/50 transition hover:text-ink"
        >
          Vaciar carrito
        </button>
        <div className="text-right">
          <p className="text-sm text-ink/60">Total</p>
          <p className="text-2xl font-bold text-ink">{formatCOP(total)}</p>
        </div>
      </div>

      {process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY && (
        <Link
          href="/checkout"
          className="mt-6 block rounded-full bg-brand-orange px-6 py-4 text-center text-lg font-semibold text-white shadow transition hover:bg-brand-orange-dark"
        >
          Pagar en línea (tarjeta / PSE)
        </Link>
      )}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 block rounded-full bg-brand-green px-6 py-4 text-center text-lg font-semibold text-white shadow transition hover:bg-brand-green-dark"
      >
        Finalizar pedido por WhatsApp
      </a>
      {!process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY && (
        <p className="mt-3 text-center text-xs text-ink/40">
          El pago en línea (MercadoPago) estará disponible pronto.
        </p>
      )}
    </section>
  );
}
