import Image from "next/image";
import type { Product } from "@/lib/types";

export function ProductThumb({ product }: { product: Product }) {
  const img = product.images?.[0];
  if (img) {
    return (
      <Image
        src={img.url}
        alt={img.alt ?? product.name}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, 33vw"
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-blue/10 to-brand-green/10 p-6">
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
