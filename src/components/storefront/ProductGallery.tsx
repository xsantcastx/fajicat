"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";

export function ProductGallery({ product }: { product: Product }) {
  const images = product.images ?? [];
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-ink/10 bg-gradient-to-br from-brand-blue/10 to-brand-green/10 p-6">
        <Image
          src="/logo.jpg"
          alt={product.name}
          width={470}
          height={215}
          className="h-auto w-4/5 mix-blend-multiply opacity-95"
        />
      </div>
    );
  }

  const current = images[active] ?? images[0];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-ink/10 bg-white">
        <Image
          src={current.url}
          alt={current.alt ?? product.name}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
              className={`relative h-16 w-16 overflow-hidden rounded-xl border-2 transition ${
                i === active ? "border-brand-orange" : "border-ink/10 hover:border-ink/30"
              }`}
            >
              <Image
                src={img.url}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
