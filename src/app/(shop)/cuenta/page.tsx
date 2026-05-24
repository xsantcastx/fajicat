import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { logout } from "@/app/auth/actions";
import { formatCOP } from "@/lib/format";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export default async function CuentaPage() {
  if (!isSupabaseConfigured()) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="text-2xl font-bold text-ink">Cuentas próximamente</h1>
        <p className="mt-2 text-ink/60">
          El acceso a cuentas estará disponible muy pronto. Por ahora puedes
          pedir por WhatsApp.
        </p>
        <Link
          href="/productos"
          className="mt-6 inline-block rounded-full bg-brand-orange px-6 py-3 font-semibold text-white"
        >
          Ver productos
        </Link>
      </section>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, role")
    .eq("id", user.id)
    .maybeSingle();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, created_at, status, total, channel")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <section className="mx-auto max-w-3xl px-5 py-12">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">Mi cuenta</h1>
          <p className="mt-1 text-ink/60">
            {profile?.full_name || user.email}
          </p>
          <p className="text-sm text-ink/50">{user.email}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {profile?.role === "admin" && (
            <Link
              href="/admin"
              className="rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white"
            >
              Panel admin
            </Link>
          )}
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-ink/50 transition hover:text-ink"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>

      <h2 className="mt-10 text-xl font-bold text-ink">Mis pedidos</h2>
      {!orders || orders.length === 0 ? (
        <p className="mt-4 text-ink/50">Todavía no tienes pedidos.</p>
      ) : (
        <ul className="mt-4 divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white">
          {orders.map((o) => (
            <li
              key={o.id}
              className="flex items-center justify-between px-5 py-4"
            >
              <div>
                <p className="font-semibold text-ink">
                  Pedido #{o.id.slice(0, 8)}
                </p>
                <p className="text-sm text-ink/50">
                  {new Date(o.created_at).toLocaleDateString("es-CO")} ·{" "}
                  {o.channel === "whatsapp" ? "WhatsApp" : "En línea"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-ink">
                  {formatCOP(Number(o.total))}
                </p>
                <p className="text-sm text-brand-green-dark">
                  {STATUS_LABEL[o.status] ?? o.status}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
