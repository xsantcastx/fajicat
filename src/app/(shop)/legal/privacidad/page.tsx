import type { Metadata } from "next";

export const metadata: Metadata = { title: "Política de privacidad — Fajicat" };

export default function PrivacidadPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-4 px-6 py-12 text-ink/80">
      <h1 className="text-3xl font-bold text-ink">Política de privacidad</h1>
      <p className="text-sm text-ink/50">Última actualización: mayo de 2026</p>

      <p>
        En <b>Fajicat</b> protegemos tus datos personales conforme a la Ley 1581
        de 2012 (Habeas Data) y demás normas colombianas aplicables.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-ink">Datos que recolectamos</h2>
      <p>
        Nombre, teléfono, correo y dirección de envío que nos proporcionas al
        hacer un pedido. Los pagos se procesan a través de MercadoPago; no
        almacenamos los datos de tu tarjeta.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-ink">Uso de los datos</h2>
      <p>
        Usamos tus datos únicamente para procesar y entregar tus pedidos,
        contactarte sobre ellos y cumplir obligaciones legales.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-ink">Con quién los compartimos</h2>
      <p>
        Solo con proveedores necesarios para tu pedido (pasarela de pago
        MercadoPago y empresas de envío). No vendemos tus datos.
      </p>

      <h2 className="pt-4 text-xl font-semibold text-ink">Tus derechos</h2>
      <p>
        Puedes conocer, actualizar, rectificar o solicitar la supresión de tus
        datos escribiéndonos a Fajicat@gmail.com o al 314 560 2688.
      </p>

      <p className="pt-6 text-sm text-ink/50">
        Documento de referencia; ajústalo a tu operación antes de publicarlo
        definitivamente.
      </p>
    </article>
  );
}
