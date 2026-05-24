import { MercadoPagoConfig } from "mercadopago";

// Server-only. Builds a MercadoPago client from the access token.
export function mpClient() {
  return new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  });
}
