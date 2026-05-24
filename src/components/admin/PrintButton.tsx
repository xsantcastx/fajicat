"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full bg-brand-orange px-5 py-2 text-sm font-semibold text-white print:hidden"
    >
      Imprimir / Guardar PDF
    </button>
  );
}
