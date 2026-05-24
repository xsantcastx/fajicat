"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem("fajicat-cookies")) setShow(true);
    } catch {}
  }, []);

  if (!show) return null;

  function accept() {
    try {
      localStorage.setItem("fajicat-cookies", "1");
    } catch {}
    setShow(false);
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm rounded-2xl border border-ink/10 bg-white p-4 shadow-lg">
      <p className="text-sm text-ink/70">
        Usamos cookies para mejorar tu experiencia y analizar el tráfico. Al
        continuar, aceptas nuestra{" "}
        <Link
          href="/legal/privacidad"
          className="font-semibold text-brand-orange"
        >
          política de privacidad
        </Link>
        .
      </p>
      <button
        type="button"
        onClick={accept}
        className="mt-3 w-full rounded-full bg-brand-orange px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-orange-dark"
      >
        Aceptar
      </button>
    </div>
  );
}
