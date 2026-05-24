"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart, cartTotal } from "@/lib/cart";
import { formatCOP } from "@/lib/format";
import { shippingFor } from "@/lib/shipping";

const input =
  "w-full rounded-xl border border-ink/15 px-4 py-2.5 text-sm outline-none transition focus:border-brand-orange";

export function CheckoutForm() {
  const items = useCart((s) => s.items);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="py-12" />;

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-ink/60">Tu carrito está vacío.</p>
        <Link
          href="/productos"
          className="mt-4 inline-block rounded-full bg-brand-orange px-6 py-3 font-semibold text-white"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  const subtotal = cartTotal(items);
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const contact = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      city: String(fd.get("city") ?? ""),
      address: String(fd.get("address") ?? ""),
      notes: String(fd.get("notes") ?? ""),
    };
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          contact,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "No se pudo iniciar el pago.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("No se pudo conectar. Inténtalo de nuevo.");
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_320px]">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-bold text-ink">Datos de envío</h2>
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <input name="name" required placeholder="Nombre completo" className={input} />
        <div className="grid grid-cols-2 gap-3">
          <input name="phone" required placeholder="Celular" className={input} />
          <input name="email" type="email" placeholder="Correo" className={input} />
        </div>
        <input name="city" required placeholder="Ciudad" className={input} />
        <input name="address" required placeholder="Dirección" className={input} />
        <textarea
          name="notes"
          placeholder="Notas (opcional)"
          rows={3}
          className={input}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brand-orange py-3 font-semibold text-white shadow transition hover:bg-brand-orange-dark disabled:opacity-50"
        >
          {loading ? "Redirigiendo…" : "Pagar con MercadoPago"}
        </button>
        <p className="text-center text-xs text-ink/40">
          Serás redirigido a MercadoPago para completar el pago de forma segura.
        </p>
      </form>

      <aside className="h-fit rounded-2xl border border-ink/10 bg-white p-5">
        <h2 className="text-lg font-bold text-ink">Tu pedido</h2>
        <ul className="mt-4 space-y-3">
          {items.map((i) => (
            <li key={i.variantId} className="flex justify-between text-sm">
              <span className="text-ink/70">
                {i.quantity} × {i.productName} ({i.size})
              </span>
              <span className="font-medium text-ink">
                {formatCOP(i.unitPrice * i.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-ink/10 pt-4 text-sm">
          <div className="flex justify-between text-ink/70">
            <span>Subtotal</span>
            <span>{formatCOP(subtotal)}</span>
          </div>
          <div className="flex justify-between text-ink/70">
            <span>Envío</span>
            <span>{shipping === 0 ? "Gratis" : formatCOP(shipping)}</span>
          </div>
          <div className="flex justify-between pt-1 text-lg font-bold text-ink">
            <span>Total</span>
            <span>{formatCOP(total)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
