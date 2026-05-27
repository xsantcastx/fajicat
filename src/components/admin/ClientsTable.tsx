"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type ClientRow = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
};

export function ClientsTable({ clients }: { clients: ClientRow[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        (c.email ?? "").toLowerCase().includes(s) ||
        (c.phone ?? "").includes(s),
    );
  }, [clients, q]);

  return (
    <>
      <div className="mt-6">
        <input
          type="search"
          placeholder="Buscar por nombre, correo o teléfono…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-ink/60">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-cream">
                <td className="px-4 py-3 font-medium text-ink">
                  <Link
                    href={`/admin/clientes/${c.id}`}
                    className="hover:text-brand-orange"
                  >
                    {c.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink/70">{c.phone || "—"}</td>
                <td className="px-4 py-3 text-ink/70">{c.email || "—"}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/clientes/${c.id}`}
                    className="text-sm font-semibold text-brand-orange hover:underline"
                  >
                    Ver/Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-ink/50">
            {q
              ? "Sin resultados para esa búsqueda."
              : "Aún no hay clientes. Crea el primero."}
          </p>
        )}
      </div>

      <p className="mt-3 text-xs text-ink/50">
        {filtered.length} {filtered.length === 1 ? "cliente" : "clientes"}
        {q && ` (de ${clients.length})`}
      </p>
    </>
  );
}
