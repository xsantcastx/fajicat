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
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-blue/15 to-brand-green/15">
      <Image
        src="/logo-mark.svg"
        alt={product.name}
        width={130}
        height={104}
        className="opacity-80"
      />
    </div>
  );
}
