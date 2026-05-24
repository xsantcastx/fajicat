import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isMercadoPagoConfigured } from "@/lib/payments";
import { CheckoutForm } from "@/components/storefront/CheckoutForm";

export const metadata = { title: "Finalizar compra — Fajicat" };

export default function CheckoutPage() {
  const ready = isSupabaseConfigured() && isMercadoPagoConfigured();

  if (!ready) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="text-2xl font-bold text-ink">
          Pago en línea próximamente
        </h1>
        <p className="mt-2 text-ink/60">
          Por ahora puedes finalizar tu pedido por WhatsApp desde el carrito.
        </p>
        <Link
          href="/carrito"
          className="mt-6 inline-block rounded-full bg-brand-green px-6 py-3 font-semibold text-white"
        >
          Ir al carrito
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="mb-8 text-3xl font-bold text-ink">Finalizar compra</h1>
      <CheckoutForm />
    </section>
  );
}
