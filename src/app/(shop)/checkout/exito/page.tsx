import Link from "next/link";
import { ClearCartOnMount } from "@/components/storefront/ClearCartOnMount";

export const metadata = { title: "¡Gracias por tu compra! — Fajicat" };

export default function ExitoPage() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-24 text-center">
      <ClearCartOnMount />
      <h1 className="text-3xl font-bold text-ink">¡Gracias por tu compra! 🐾</h1>
      <p className="mt-3 text-ink/70">
        Recibimos tu pago. Te contactaremos para coordinar el envío de la faja de
        tu mascota.
      </p>
      <Link
        href="/productos"
        className="mt-8 inline-block rounded-full bg-brand-orange px-6 py-3 font-semibold text-white"
      >
        Seguir comprando
      </Link>
    </section>
  );
}
