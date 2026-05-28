import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/storefront/ProductCard";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573145602688";

const BENEFITS = [
  {
    icon: "🚚",
    title: "Envío nacional",
    text: "Desde Medellín a todo Colombia",
  },
  { icon: "🔒", title: "Pago seguro", text: "MercadoPago o WhatsApp" },
  { icon: "📏", title: "Tallas XS a XL", text: "Para gatos y perros" },
  {
    icon: "🐾",
    title: "Hecho con amor",
    text: "Pensado para su recuperación",
  },
];

const STEPS = [
  {
    n: "1",
    icon: "📏",
    title: "Elige la talla",
    text: "Mide a tu mascota con nuestra guía de tallas.",
  },
  {
    n: "2",
    icon: "🛒",
    title: "Haz tu pedido",
    text: "Compra en línea o coordínalo por WhatsApp.",
  },
  {
    n: "3",
    icon: "📦",
    title: "Recibe en casa",
    text: "Despachamos a toda Colombia en 2 a 6 días.",
  },
];

export default async function Home() {
  const products = await getProducts();
  const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    "¡Hola Fajicat! Quiero información sobre las fajas postquirúrgicas 🐾",
  )}`;

  return (
    <main className="flex flex-col overflow-hidden">
      {/* HERO */}
      <section className="relative">
        {/* Decorative blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-orange/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-40 h-96 w-96 rounded-full bg-brand-green/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-brand-blue/15 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-14 sm:py-20 md:grid-cols-2">
          <div className="text-center md:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-4 py-1.5 text-xs font-medium text-ink/80 sm:text-sm">
              🐾 Animal Health · Medellín, Colombia
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Fajas postquirúrgicas
              <br className="hidden sm:block" />{" "}
              <span className="bg-gradient-to-r from-brand-orange via-brand-orange-dark to-brand-green bg-clip-text text-transparent">
                para tu mascota
              </span>
            </h1>
            <p className="mt-6 text-base text-ink/70 sm:text-lg">
              Comodidad y protección durante la recuperación de tu gato o perro.
              Hechas con cariño en Colombia.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <Link
                href="/productos"
                className="group inline-flex items-center gap-2 rounded-full bg-brand-orange px-7 py-3.5 font-semibold text-white shadow-lg shadow-brand-orange/30 transition hover:scale-[1.02] hover:bg-brand-orange-dark"
              >
                Comprar ahora
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 bg-white px-7 py-3.5 font-semibold text-ink transition hover:border-brand-green hover:text-brand-green-dark"
              >
                💬 Pedir por WhatsApp
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-ink/55 md:justify-start">
              <span>✓ Desde $20.000 COP</span>
              <span>✓ Tallas XS a XL</span>
              <span>✓ Envío nacional</span>
            </div>
          </div>

          {/* Hero photo with frame + floating price badge */}
          <div className="relative mx-auto w-full max-w-md">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-4 -top-6 hidden rotate-12 text-4xl opacity-30 sm:block"
            >
              🐾
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-3 right-2 hidden -rotate-12 text-4xl opacity-30 sm:block"
            >
              🐾
            </div>

            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-2xl ring-8 ring-white">
              <Image
                src="/hero.jpg"
                alt="Mascota con su faja postquirúrgica Fajicat"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 40vw"
              />
              <div className="absolute bottom-4 left-4 rounded-2xl bg-white/95 px-4 py-2 shadow-lg backdrop-blur">
                <p className="text-xs font-medium text-ink/60">Desde</p>
                <p className="text-xl font-bold text-brand-orange">$20.000</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust band */}
      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="text-center">
              <div className="text-3xl">{b.icon}</div>
              <div className="mt-3 font-semibold text-ink">{b.title}</div>
              <div className="text-sm text-ink/55">{b.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto w-full max-w-6xl px-6 py-14 sm:py-20">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-sm font-semibold text-brand-orange">
              Catálogo
            </span>
            <h2 className="mt-1 text-3xl font-bold text-ink sm:text-4xl">
              Nuestros productos
            </h2>
            <p className="mt-2 text-ink/60">
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
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="bg-gradient-to-b from-cream to-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold text-brand-green-dark">
              Cómo funciona
            </span>
            <h2 className="mt-1 text-3xl font-bold text-ink sm:text-4xl">
              Comprar es fácil
            </h2>
            <p className="mt-3 text-ink/60">
              En tres pasos tu mascota tiene su faja.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="relative rounded-3xl border border-ink/10 bg-white p-7 shadow-sm transition hover:shadow-md"
              >
                <div className="absolute -top-5 left-7 flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange text-lg font-bold text-white shadow-lg shadow-brand-orange/30">
                  {s.n}
                </div>
                <div className="mt-2 text-4xl">{s.icon}</div>
                <h3 className="mt-3 text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm text-ink/60">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Fajicat */}
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-md">
            <div
              aria-hidden
              className="absolute -left-5 -top-5 h-full w-full rounded-3xl bg-brand-green/25"
            />
            <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-xl">
              <Image
                src="/about-2.jpg"
                alt="Mascota en recuperación con Fajicat"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>
          <div>
            <span className="text-sm font-semibold text-brand-orange">
              ¿Por qué Fajicat?
            </span>
            <h2 className="mt-1 text-3xl font-bold leading-tight text-ink sm:text-4xl">
              Pensadas para que sane{" "}
              <span className="font-script text-brand-orange">tranquilo</span>
            </h2>
            <ul className="mt-6 space-y-4">
              {[
                {
                  t: "Sin el cono isabelino",
                  d: "Protege la herida sin el incómodo cono.",
                },
                {
                  t: "Tela suave y transpirable",
                  d: "Para que descanse mejor durante la recuperación.",
                },
                {
                  t: "Fácil de poner y lavar",
                  d: "Pensada para el día a día.",
                },
              ].map((i) => (
                <li key={i.t} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-orange/15 text-sm font-bold text-brand-orange">
                    ✓
                  </span>
                  <div>
                    <strong className="text-ink">{i.t}</strong>
                    <p className="text-sm text-ink/60">{i.d}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              href="/nosotros"
              className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-brand-green px-6 py-3 font-semibold text-brand-green-dark transition hover:bg-brand-green/10"
            >
              Conoce nuestra historia →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-orange via-brand-orange-dark to-brand-green px-6 py-14 text-center text-white shadow-2xl sm:px-16 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-white/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-white/15 blur-3xl"
          />
          <div className="relative">
            <div className="text-5xl">🐾</div>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Cuida la recuperación de tu mascota
            </h2>
            <p className="mt-3 text-white/90">
              Encuentra la talla perfecta para tu gato o perro hoy.
            </p>
            <Link
              href="/productos"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-brand-orange shadow-xl transition hover:scale-[1.02] hover:bg-white/95"
            >
              Ver productos
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
