import Link from "next/link";

export const metadata = { title: "Pago pendiente — Fajicat" };

export default function PendientePage() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-24 text-center">
      <h1 className="text-3xl font-bold text-ink">Tu pago está pendiente</h1>
      <p className="mt-3 text-ink/70">
        Estamos esperando la confirmación del pago. Te avisaremos en cuanto se
        acredite.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-brand-orange px-6 py-3 font-semibold text-white"
      >
        Volver al inicio
      </Link>
    </section>
  );
}
