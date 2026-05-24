import Link from "next/link";

export const metadata = { title: "Pago no completado — Fajicat" };

export default function ErrorPage() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-24 text-center">
      <h1 className="text-3xl font-bold text-ink">El pago no se completó</h1>
      <p className="mt-3 text-ink/70">
        No te preocupes, no se realizó ningún cobro. Puedes intentarlo de nuevo o
        pedir por WhatsApp.
      </p>
      <Link
        href="/carrito"
        className="mt-8 inline-block rounded-full bg-brand-orange px-6 py-3 font-semibold text-white"
      >
        Volver al carrito
      </Link>
    </section>
  );
}
