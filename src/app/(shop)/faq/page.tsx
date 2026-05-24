import type { Metadata } from "next";

export const metadata: Metadata = { title: "Preguntas frecuentes — Fajicat" };

const FAQS = [
  {
    q: "¿Para qué sirve una faja postquirúrgica?",
    a: "Protege la herida después de una cirugía y evita que tu mascota lama o muerda los puntos, sin el incómodo cono isabelino.",
  },
  {
    q: "¿Cómo elijo la talla correcta?",
    a: "Mide el largo de la espalda y el contorno del pecho de tu mascota y compáralos con la guía de tallas en la página del producto. Si tienes dudas, escríbenos por WhatsApp.",
  },
  {
    q: "¿Hacen envíos a toda Colombia?",
    a: "Sí, despachamos desde Medellín a todo el país. El tiempo de entrega suele ser de 2 a 6 días hábiles según la ciudad.",
  },
  {
    q: "¿Cómo puedo pagar?",
    a: "Puedes pedir por WhatsApp (transferencia a Bancolombia) o pagar en línea con MercadoPago (tarjeta, PSE o efectivo).",
  },
  {
    q: "¿Cómo lavo la faja?",
    a: "Lávala a mano o en ciclo suave con agua fría y déjala secar a la sombra. La tela es suave y transpirable.",
  },
  {
    q: "¿Puedo cambiar la talla?",
    a: "Sí, dentro de los 5 días hábiles siguientes a la entrega, con el producto sin uso y en su empaque original. Revisa nuestra política de Envíos y devoluciones.",
  },
  {
    q: "¿Tienen fajas para gatos y perros?",
    a: "Sí. Manejamos tallas XS a XL para gatos y perros de diferentes tamaños.",
  },
];

export default function FaqPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold text-ink">Preguntas frecuentes</h1>
      <div className="mt-8 space-y-3">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="group rounded-2xl border border-ink/10 bg-white p-5"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-ink">
              {f.q}
              <span className="ml-4 text-xl text-brand-orange transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-ink/70">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
