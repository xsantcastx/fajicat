import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 px-6 py-10 text-center text-sm text-ink/50">
      <Logo showTagline={false} className="mx-auto" />
      <nav className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        <Link href="/productos" className="transition hover:text-brand-orange">
          Productos
        </Link>
        <Link href="/nosotros" className="transition hover:text-brand-orange">
          Nosotros
        </Link>
        <Link href="/legal/terminos" className="transition hover:text-brand-orange">
          Términos
        </Link>
        <Link
          href="/legal/privacidad"
          className="transition hover:text-brand-orange"
        >
          Privacidad
        </Link>
        <Link
          href="/legal/envios-devoluciones"
          className="transition hover:text-brand-orange"
        >
          Envíos y devoluciones
        </Link>
      </nav>
      <p className="mt-5">
        © {new Date().getFullYear()} Fajicat · Medellín, Colombia
      </p>
      <p className="mt-1">Cel 314 560 2688 · mariana.rtp@gmail.com</p>
    </footer>
  );
}
