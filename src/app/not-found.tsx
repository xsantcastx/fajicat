import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center">
      <Link href="/">
        <Logo />
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-ink">Página no encontrada</h1>
      <p className="text-ink/60">La página que buscas no existe o fue movida.</p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-brand-orange px-6 py-3 font-semibold text-white"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
