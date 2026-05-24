import type { Metadata } from "next";

export const metadata: Metadata = { title: "Términos y condiciones — Fajicat" };

export default function TerminosPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-4 px-6 py-12 text-ink/80">
      <h1 className="text-3xl font-bold text-ink">Términos y condiciones</h1>
      <p className="text-sm text-ink/50">Última actualización: mayo de 2026</p>

      <p>
        Estos términos regulan el uso de la tienda en línea de <b>Fajicat</b>{" "}
        (Animal Health), con domicilio en Medellín, Antioquia, Colombia. Al
        realizar un pedido aceptas estas condiciones.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-ink">Productos y precios</h2>
      <p>
        Vendemos fajas postquirúrgicas para mascotas. Los precios están en pesos
        colombianos (COP) e incluyen los impuestos aplicables, salvo que se
        indique lo contrario. Podemos actualizar precios y disponibilidad en
        cualquier momento.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-ink">Pedidos y pagos</h2>
      <p>
        Puedes pagar en línea mediante MercadoPago (tarjetas, PSE, efectivo) o
        coordinar tu pedido por WhatsApp. El pedido se confirma una vez recibido
        el pago.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-ink">Envíos y devoluciones</h2>
      <p>
        Los envíos y devoluciones se rigen por nuestra Política de envíos y
        devoluciones.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-ink">Ley aplicable</h2>
      <p>
        Estos términos se rigen por las leyes de la República de Colombia,
        incluido el Estatuto del Consumidor (Ley 1480 de 2011).
      </p>

      <h2 className="pt-4 text-xl font-semibold text-ink">Contacto</h2>
      <p>
        Cel 314 560 2688 · Fajicat@gmail.com · Medellín, Colombia.
      </p>

      <p className="pt-6 text-sm text-ink/50">
        Documento de referencia; revísalo y ajústalo a tu operación (y, si es
        posible, con asesoría legal) antes de publicarlo definitivamente.
      </p>
    </article>
  );
}
