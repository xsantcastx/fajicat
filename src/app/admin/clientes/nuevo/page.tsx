import { createClientAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const input =
  "w-full rounded-xl border border-ink/15 px-4 py-2.5 text-sm outline-none focus:border-brand-orange";

export default async function NuevoCliente({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-ink">Nuevo cliente</h1>
      {sp.error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {sp.error}
        </p>
      )}
      <form action={createClientAction} className="mt-6 space-y-4">
        <input
          name="name"
          required
          placeholder="Nombre (ej. Veterinaria Monkey)"
          className={input}
        />
        <div className="grid grid-cols-2 gap-3">
          <input name="phone" placeholder="Teléfono" className={input} />
          <input
            name="email"
            type="email"
            placeholder="Correo"
            className={input}
          />
        </div>
        <input name="address" placeholder="Dirección" className={input} />
        <textarea
          name="notes"
          rows={3}
          placeholder="Notas (opcional)"
          className={input}
        />
        <button className="rounded-full bg-brand-orange px-6 py-3 font-semibold text-white">
          Crear cliente
        </button>
      </form>
    </div>
  );
}
