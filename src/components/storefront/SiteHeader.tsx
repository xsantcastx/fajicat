"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { useCart, cartCount } from "@/lib/cart";

export function SiteHeader() {
  const items = useCart((s) => s.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const count = mounted ? cartCount(items) : 0;

  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Link href="/" aria-label="Inicio">
          <Logo />
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/productos" className="transition hover:text-brand-orange">
            Productos
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
      </div>
    </header>
  );
}
