// Flat shipping fee (COP). Override via env without code changes.
export const SHIPPING_FEE = Number(
  process.env.NEXT_PUBLIC_SHIPPING_FEE ?? "12000",
);
// If subtotal >= this, shipping is free. 0 disables the threshold.
export const FREE_SHIPPING_OVER = Number(
  process.env.NEXT_PUBLIC_FREE_SHIPPING_OVER ?? "0",
);

export function shippingFor(subtotal: number): number {
  if (FREE_SHIPPING_OVER > 0 && subtotal >= FREE_SHIPPING_OVER) return 0;
  return SHIPPING_FEE;
}
