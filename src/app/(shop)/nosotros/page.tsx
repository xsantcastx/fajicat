import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros — Fajicat",
  description:
    "Conoce a Fajicat: fajas postquirúrgicas hechas con cariño para la recuperación de tu mascota, en Medellín, Colombia.",
};

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573145602688";

export default function NosotrosPage() {
  const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    "¡Hola Fajicat! Quiero saber más 🐾",
  )}`;

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2">
        <div>
          <span className="inline-block rounded-full bg-brand-blue/20 px-4 py-1 text-sm font-medium text-ink/80">
            Nosotros
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight text-ink">
            Cuidamos la recuperación de quienes más quieres
          </h1>
          <p className="mt-5 text-lg text-ink/70">
            Fajicat nace en Medellín del amor por los animales. Diseñamos fajas
            postquirúrgicas cómodas y seguras que ayudan a tu gato o perro a
            recuperarse sin estrés, evitando que lama o muerda sus heridas
            después de una cirugía.
          </p>
          <p className="mt-4 text-ink/70">
            Cada faja está pensada para dar protección y tranquilidad —para tu
            mascota y para ti—. Hechas con cariño, talla a talla.
          </p>
          <Link
            href="/productos"
            className="mt-7 inline-block rounded-full bg-brand-orange px-6 py-3 font-semibold text-white transition hover:bg-brand-orange-dark"
          >
            Ver productos
          </Link>
        </div>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl shadow-lg">
          <Image
            src="/about-1.jpg"
            alt="Fajicat — cuidado de mascotas"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
      </section>

      <section className="bg-white px-6 py-14">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div className="relative order-2 mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-3xl shadow-lg md:order-1">
            <Image
              src="/about-2.jpg"
              alt="Mascota en recuperación con Fajicat"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-2xl font-bold text-ink">
              Por qué una faja postquirúrgica
            </h2>
            <ul className="mt-5 space-y-3 text-ink/70">
              <li>
                ✓ <b>Protege la herida</b> sin el incómodo cono isabelino.
              </li>
              <li>
                ✓ <b>Tela suave y transpirable</b> para que descanse mejor.
              </li>
              <li>
                ✓ <b>Varias tallas</b> (XS a XL) para gatos y perros.
              </li>
              <li>
                ✓ <b>Fácil de poner y lavar</b>, pensada para el día a día.
              </li>
            </ul>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-block rounded-full border border-brand-green px-6 py-3 font-semibold text-brand-green-dark transition hover:bg-brand-green/10"
            >
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
