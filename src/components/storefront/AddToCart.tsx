"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatCOP } from "@/lib/format";
import type { Product } from "@/lib/types";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573145602688";

export function AddToCart({ product }: { product: Product }) {
  const firstInStock =
    product.variants.find((v) => v.stock_qty > 0) ?? product.variants[0];
  const [variantId, setVariantId] = useState(firstInStock?.id ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);

  const variant = product.variants.find((v) => v.id === variantId);
  const unitPrice = variant?.price ?? product.base_price;

  function handleAdd() {
    if (!variant) return;
    add(
      {
        variantId: variant.id,
        productSlug: product.slug,
        productName: product.name,
        size: variant.size,
        unitPrice,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const waText = variant
    ? `¡Hola Fajicat! Quiero pedir: ${qty} × ${product.name} talla ${variant.size} (${formatCOP(unitPrice)} c/u) 🐾`
    : "";
  const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waText)}`;

  return (
    <div className="space-y-5">
      <div>
        <span className="mb-2 block text-sm font-medium text-ink/70">Talla</span>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((v) => {
            const out = v.stock_qty <= 0;
            const selected = v.id === variantId;
            return (
              <button
                key={v.id}
                type="button"
                disabled={out}
                onClick={() => setVariantId(v.id)}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                  selected
                    ? "border-brand-orange bg-brand-orange text-white"
                    : "border-ink/15 text-ink hover:border-brand-orange"
                } ${out ? "cursor-not-allowed opacity-40" : ""}`}
              >
                {v.size}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-ink/70">Cantidad</span>
        <div className="flex items-center rounded-xl border border-ink/15">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-1.5 text-lg"
            aria-label="Restar"
          >
            −
          </button>
          <span className="w-10 text-center font-semibold">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="px-3 py-1.5 text-lg"
            aria-label="Sumar"
          >
            +
          </button>
        </div>
      </div>

      <div className="text-2xl font-bold text-ink">
        {formatCOP(unitPrice * qty)}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAdd}
          disabled={!variant}
          className="rounded-full bg-brand-orange px-6 py-3 font-semibold text-white shadow transition hover:bg-brand-orange-dark disabled:opacity-50"
        >
          {added ? "¡Agregado! ✓" : "Agregar al carrito"}
        </button>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-brand-green px-6 py-3 text-center font-semibold text-brand-green-dark transition hover:bg-brand-green/10"
        >
          Pedir por WhatsApp
        </a>
      </div>
    </div>
  );
}
