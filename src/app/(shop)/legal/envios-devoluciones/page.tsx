import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Envíos y devoluciones — Fajicat",
};

export default function EnviosPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-4 px-6 py-12 text-ink/80">
      <h1 className="text-3xl font-bold text-ink">Envíos y devoluciones</h1>
      <p className="text-sm text-ink/50">Última actualización: mayo de 2026</p>

      <h2 className="pt-4 text-xl font-semibold text-ink">Envíos</h2>
      <p>
        Realizamos envíos a toda Colombia desde Medellín. El costo de envío se
        muestra al finalizar la compra. Los tiempos de entrega suelen ser de 2 a
        6 días hábiles según la ciudad. Te compartimos el número de guía cuando
        tu pedido sale.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-ink">Cambios de talla</h2>
      <p>
        Si la talla no es la adecuada, escríbenos dentro de los 5 días hábiles
        siguientes a la entrega para coordinar un cambio. El producto debe estar
        sin uso, limpio y en su empaque original.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-ink">Derecho de retracto</h2>
      <p>
        Conforme al Estatuto del Consumidor (Ley 1480 de 2011), cuentas con 5
        días hábiles para ejercer el derecho de retracto. Por tratarse de un
        producto de contacto directo con la piel/heridas, por salubridad solo se
        aceptan devoluciones de productos sin usar y en su empaque original.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-ink">Cómo solicitarlo</h2>
      <p>
        Escríbenos por WhatsApp al 314 560 2688 o a Fajicat@gmail.com con tu
        número de pedido y te guiamos en el proceso.
      </p>

      <p className="pt-6 text-sm text-ink/50">
        Documento de referencia; ajusta tiempos, costos y condiciones a tu
        operación antes de publicarlo definitivamente.
      </p>
    </article>
  );
}
