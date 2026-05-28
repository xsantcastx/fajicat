"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { useCart, cartCount } from "@/lib/cart";

const MOBILE_NAV: [string, string][] = [
  ["/productos", "Productos"],
  ["/nosotros", "Nosotros"],
  ["/cuenta", "Cuenta"],
  ["/faq", "Preguntas frecuentes"],
  ["/contacto", "Contacto"],
];

export function SiteHeader() {
  const items = useCart((s) => s.items);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setMounted(true), []);
  const count = mounted ? cartCount(items) : 0;

  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Link href="/" aria-label="Inicio" onClick={() => setMenuOpen(false)}>
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
          <Link
            href="/productos"
            className="transition hover:text-brand-orange"
          >
            Productos
          </Link>
          <Link href="/nosotros" className="transition hover:text-brand-orange">
            Nosotros
          </Link>
          <Link href="/cuenta" className="transition hover:text-brand-orange">
            Cuenta
          </Link>
          <Link
            href="/carrito"
            className="relative transition hover:text-brand-orange"
          >
            Carrito
            {count > 0 && (
              <span className="absolute -right-4 -top-2 rounded-full bg-brand-orange px-1.5 text-[0.65rem] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile: cart shortcut + hamburger */}
        <div className="flex items-center gap-2 sm:hidden">
          <Link
            href="/carrito"
            aria-label={`Carrito${count > 0 ? ` (${count})` : ""}`}
            className="relative flex h-10 items-center rounded-lg border border-ink/15 px-3 text-sm font-medium text-ink/80"
            onClick={() => setMenuOpen(false)}
          >
            Carrito
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 rounded-full bg-brand-orange px-1.5 text-[0.65rem] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink/15 text-lg text-ink/70"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <nav className="border-t border-ink/10 bg-white sm:hidden">
          {MOBILE_NAV.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block border-b border-ink/5 px-5 py-3 text-sm font-medium text-ink/80 hover:bg-cream"
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
