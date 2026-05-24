import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/storefront/ProductCard";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573145602688";

const BENEFITS = [
  { icon: "🚚", title: "Envío a toda Colombia", text: "Despachamos desde Medellín" },
  { icon: "🔒", title: "Pago seguro", text: "MercadoPago o WhatsApp" },
  { icon: "📏", title: "Tallas XS a XL", text: "Para gatos y perros" },
  { icon: "🐾", title: "Hecho con amor", text: "Pensado para su recuperación" },
];

export default async function Home() {
  const products = await getProducts();
  const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    "¡Hola Fajicat! Quiero información sobre las fajas postquirúrgicas 🐾",
  )}`;

  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2">
        <div className="text-center md:text-left">
          <span className="inline-block rounded-full bg-brand-blue/20 px-4 py-1 text-sm font-medium text-ink/80">
            Animal Health · Medellín, Colombia
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight text-ink sm:text-5xl">
            Fajas postquirúrgicas para{" "}
            <span className="bg-gradient-to-r from-brand-orange to-brand-green bg-clip-text text-transparent">
              tu mascota
            </span>
          </h1>
          <p className="mt-5 text-lg text-ink/70">
            Comodidad y protección durante la recuperación de tu gato o perro.
            Hechas con cariño en Colombia.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <Link
              href="/productos"
              className="rounded-full bg-brand-orange px-6 py-3 font-semibold text-white shadow transition hover:bg-brand-orange-dark"
            >
              Comprar ahora
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-ink/15 px-6 py-3 font-semibold text-ink transition hover:bg-ink/5"
            >
              Pedir por WhatsApp
            </a>
          </div>
          <p className="mt-4 text-sm text-ink/50">
            Desde $20.000 COP · Tallas XS a XL
          </p>
        </div>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl shadow-lg">
          <Image
            src="/hero.jpg"
            alt="Mascota con su faja postquirúrgica Fajicat"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-8 md:grid-cols-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="text-center">
              <div className="text-3xl">{b.icon}</div>
              <div className="mt-2 font-semibold text-ink">{b.title}</div>
              <div className="text-sm text-ink/55">{b.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-ink">Nuestros productos</h2>
            <p className="mt-1 text-ink/60">
              Fajas para la recuperación de tu mascota.
            </p>
          </div>
          <Link
            href="/productos"
            className="hidden text-sm font-semibold text-brand-orange hover:underline sm:block"
          >
            Ver todos →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Why Fajicat */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-3xl shadow-lg">
            <Image
              src="/about-2.jpg"
              alt="Mascota en recuperación con Fajicat"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink">
              ¿Por qué una faja Fajicat?
            </h2>
            <ul className="mt-5 space-y-3 text-ink/70">
              <li>✓ <b>Protege la herida</b> sin el incómodo cono isabelino.</li>
              <li>✓ <b>Tela suave y transpirable</b> para que descanse mejor.</li>
              <li>✓ <b>Fácil de poner y lavar</b>, pensada para el día a día.</li>
            </ul>
            <Link
              href="/nosotros"
              className="mt-7 inline-block rounded-full border border-brand-green px-6 py-3 font-semibold text-brand-green-dark transition hover:bg-brand-green/10"
            >
              Conoce más
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-brand-orange to-brand-green px-8 py-12 text-center text-white shadow-lg">
          <h2 className="text-3xl font-bold">
            Cuida la recuperación de tu mascota
          </h2>
          <p className="mt-3 text-white/90">
            Encuentra la talla perfecta para tu gato o perro.
          </p>
          <Link
            href="/productos"
            className="mt-7 inline-block rounded-full bg-white px-7 py-3 font-semibold text-brand-orange shadow transition hover:bg-white/90"
          >
            Ver productos
          </Link>
        </div>
      </section>
    </main>
  );
}
