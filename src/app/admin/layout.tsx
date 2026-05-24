import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { logout } from "@/app/auth/actions";
import { Logo } from "@/components/brand/Logo";

export const dynamic = "force-dynamic";

const NAV: [string, string][] = [
  ["/admin", "Dashboard"],
  ["/admin/productos", "Productos"],
  ["/admin/pedidos", "Pedidos"],
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) redirect("/");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") redirect("/");

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="hidden w-56 flex-col border-r border-ink/10 bg-white p-5 sm:flex print:hidden">
        <Link href="/admin">
          <Logo showTagline={false} />
        </Link>
        <nav className="mt-8 flex flex-col gap-1 text-sm">
          {NAV.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-2 font-medium text-ink/80 transition hover:bg-cream"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2 pt-6 text-sm">
          <Link href="/" className="px-3 text-ink/50 transition hover:text-ink">
            ← Ver tienda
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="px-3 text-ink/50 transition hover:text-ink"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-6 sm:p-10">{children}</main>
    </div>
  );
}
