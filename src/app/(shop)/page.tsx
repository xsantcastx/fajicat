import Link from "next/link";
import Image from "next/image";

const sizes = [
  { size: "XS", price: "20.000" },
  { size: "S", price: "21.000" },
  { size: "M", price: "21.000" },
  { size: "L", price: "23.000" },
  { size: "XL", price: "27.000" },
];

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573145602688";

export default function Home() {
  const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    "¡Hola Fajicat! Quiero información sobre las fajas postquirúrgicas 🐾",
  )}`;

  return (
    <main className="flex flex-col">
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
              Ver productos
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

      <section id="tallas" className="border-t border-ink/10 bg-white px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-center text-2xl font-bold text-ink">
            Tallas y precios
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {sizes.map((s) => (
              <Link
                key={s.size}
                href="/productos/faja-postquirurgica"
                className="rounded-2xl border border-ink/10 bg-cream p-5 text-center shadow-sm transition hover:border-brand-orange hover:shadow-md"
              >
                <div className="text-3xl font-bold text-brand-orange">
                  {s.size}
                </div>
                <div className="mt-1 text-sm text-ink/60">Talla</div>
                <div className="mt-3 text-lg font-semibold text-ink">
                  ${s.price}
                </div>
                <div className="text-xs text-ink/50">COP</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
