import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contacto — Fajicat" };

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573145602688";

export default function ContactoPage() {
  const wa = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    "¡Hola Fajicat! 🐾",
  )}`;

  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold text-ink">Contáctanos</h1>
      <p className="mt-2 text-ink/70">
        ¿Tienes dudas sobre tallas, envíos o tu pedido? Escríbenos, te
        respondemos con gusto.
      </p>

      <div className="mt-8 space-y-4">
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl bg-brand-green px-6 py-4 text-center font-semibold text-white shadow-sm transition hover:bg-brand-green-dark"
        >
          💬 Escríbenos por WhatsApp · 314 560 2688
        </a>
        <a
          href="mailto:mariana.rtp@gmail.com"
          className="block rounded-2xl border border-ink/10 bg-white px-6 py-4 font-medium text-ink transition hover:border-brand-orange"
        >
          ✉️ mariana.rtp@gmail.com
        </a>
        <a
          href="https://instagram.com/faji_cat"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl border border-ink/10 bg-white px-6 py-4 font-medium text-ink transition hover:border-brand-orange"
        >
          📷 @faji_cat en Instagram
        </a>
      </div>

      <p className="mt-6 text-sm text-ink/50">Medellín, Antioquia · Colombia</p>
    </section>
  );
}
