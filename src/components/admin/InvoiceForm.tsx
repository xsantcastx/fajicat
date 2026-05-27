"use client";

import { useState } from "react";
import { createInvoice } from "@/app/admin/actions";

const SIZES = ["XS", "S", "M", "L", "XL"] as const;
const PRICES: Record<string, number> = {
  XS: 20000,
  S: 21000,
  M: 21000,
  L: 23000,
  XL: 27000,
};

const input =
  "w-full rounded-xl border border-ink/15 px-4 py-2.5 text-sm outline-none focus:border-brand-orange";
const inputSmall =
  "w-24 rounded-xl border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brand-orange";

function cop(n: number) {
  return "$" + Math.round(n).toLocaleString("es-CO");
}

type Client = { id: string; name: string };

export function InvoiceForm({ clients }: { clients: Client[] }) {
  const [qty, setQty] = useState<Record<string, number>>({
    XS: 0,
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
  });
  const subtotal = SIZES.reduce((s, k) => s + qty[k] * PRICES[k], 0);

  const [totalOverride, setTotalOverride] = useState<string>("");
  const totalNum =
    totalOverride === "" ? subtotal : Number(totalOverride) || 0;
  const hasPromo = totalOverride !== "" && totalNum !== subtotal;

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={createInvoice} className="mt-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-ink/70">Cliente</label>
        <select name="client_id" required className={`${input} mt-1`} defaultValue="">
          <option value="" disabled>
            Selecciona un cliente…
          </option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-ink/50">
          ¿No está en la lista?{" "}
          <a
            href="/admin/clientes/nuevo"
            className="font-semibold text-brand-orange"
          >
            Crear nuevo cliente
          </a>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink/70">Fecha</label>
        <input
          name="date"
          type="date"
          defaultValue={today}
          className={`${input} mt-1`}
        />
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-5">
        <h2 className="text-lg font-bold text-ink">Cantidades por talla</h2>
        <div className="mt-4 space-y-2">
          {SIZES.map((s) => (
            <div key={s} className="flex items-center gap-4">
              <span className="w-10 text-lg font-semibold text-brand-orange">
                {s}
              </span>
              <span className="w-24 text-sm text-ink/60">{cop(PRICES[s])}</span>
              <input
                name={`qty_${s}`}
                type="number"
                min="0"
                value={qty[s]}
                onChange={(e) =>
                  setQty({ ...qty, [s]: Math.max(0, Number(e.target.value) || 0) })
                }
                className={inputSmall}
              />
              <span className="ml-auto text-sm font-semibold text-ink">
                {cop(qty[s] * PRICES[s])}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-ink/10 pt-3 font-bold text-ink">
          <span>Subtotal</span>
          <span>{cop(subtotal)}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink/70">
          Total (editable para aplicar promoción)
        </label>
        <input
          name="total"
          type="number"
          min="0"
          value={totalOverride}
          placeholder={String(subtotal)}
          onChange={(e) => setTotalOverride(e.target.value)}
          className={`${input} mt-1`}
        />
        <p className="mt-1 text-xs text-ink/50">
          Déjalo en blanco para usar el subtotal. Si pones un valor distinto,
          aparecerá como <b>"Total con promo"</b> en la factura.
        </p>
        {hasPromo && (
          <p className="mt-1 text-xs font-semibold text-brand-green-dark">
            Ahorro: {cop(Math.max(0, subtotal - totalNum))}
          </p>
        )}
      </div>

      <textarea
        name="notes"
        rows={3}
        placeholder="Notas (opcional)"
        className={input}
      />

      <button
        type="submit"
        disabled={subtotal === 0}
        className="rounded-full bg-brand-orange px-6 py-3 font-semibold text-white shadow disabled:opacity-50"
      >
        Crear factura
      </button>
    </form>
  );
}
