"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { logout } from "@/app/auth/actions";

export function MobileNav({ items }: { items: [string, string][] }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-white sm:hidden print:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Link
          href="/admin"
          onClick={() => setOpen(false)}
          aria-label="Admin Fajicat"
        >
          <Logo />
        </Link>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink/15 text-lg text-ink/70"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>
      {open && (
        <nav className="border-t border-ink/10 bg-white">
          {items.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block border-b border-ink/5 px-4 py-3 text-sm font-medium text-ink/80 hover:bg-cream"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="block border-b border-ink/5 px-4 py-3 text-sm text-ink/60 hover:bg-cream"
          >
            ← Ver tienda
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="block w-full px-4 py-3 text-left text-sm text-ink/60 hover:bg-cream"
            >
              Cerrar sesión
            </button>
          </form>
        </nav>
      )}
    </header>
  );
}
