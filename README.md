# Fajicat 🐾

Tienda en línea de **fajas postquirúrgicas para mascotas** (gatos y perros) — el e-commerce de [@faji_cat](https://www.instagram.com/faji_cat). Medellín, Colombia.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (brand tokens in `src/app/globals.css`)
- **Supabase** — Postgres + Auth + Storage (with Row-Level Security)
- **MercadoPago** — pagos (tarjetas / PSE / Efecty)
- **WhatsApp** — canal de pedidos alterno
- Hosting: **Vercel** + **Supabase**

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Environment
cp .env.local.example .env.local   # then fill in the values

# 3. Run the dev server
npm run dev                        # http://localhost:3000
```

### Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Copy the URL + anon key + service-role key into `.env.local`.
3. **Apply migrations** (one-time per environment) — either:
   - **Recommended — via the Supabase CLI** (already installed as a dev dep):
     ```bash
     npx supabase login                                # opens browser; one-time
     npx supabase link --project-ref <your-project-ref>
     npx supabase db push                              # applies migrations + seed
     ```
   - **Or paste manually:** open each file in [`supabase/migrations/`](supabase/migrations/) in numeric order in the Supabase SQL editor, then [`supabase/seed.sql`](supabase/seed.sql).
4. To make yourself an admin: sign up in the app (`/auth/registro`), then in SQL run
   `update public.profiles set role = 'admin' where id = '<your-user-id>';`
   You can then manage products and orders at `/admin`.

### Migration workflow (Supabase CLI)

```bash
# Create a new migration file
npx supabase migration new add_something
# ...edit supabase/migrations/<timestamp>_add_something.sql...

# Apply it to the linked Supabase project
npx supabase db push

# Status
npx supabase migration list
```

If migrations were applied manually before adopting the CLI, **baseline them** so push doesn't try to re-run them:

```bash
npx supabase migration repair --status applied 0001 0002 0003 0004
```

### MercadoPago (Colombia)

Create an app at [mercadopago.com.co/developers](https://www.mercadopago.com.co/developers), then put the access token + public key in `.env.local`. Set the webhook/notification URL to `https://<your-domain>/api/webhooks/mercadopago` and copy its secret into `MERCADOPAGO_WEBHOOK_SECRET`. Once these are set, an online-pay button appears in the cart and checkout works; without them the site falls back to WhatsApp ordering.

## Project structure

```
src/
  app/                 # routes (App Router) + icon.svg favicon
  components/brand/    # Logo and brand components
  lib/supabase/        # client.ts (browser) · server.ts (server)
supabase/
  migrations/          # 0001_init.sql — schema + RLS
  seed.sql             # categories, product, size variants (COP prices)
public/logo-mark.svg   # vector logo mark
```

## Data model notes

- **Catalog** (`products`, `product_variants`, `categories`, `product_images`) is publicly readable when `status = 'active'`; only admins can write.
- **Orders** are created **server-side** with the service-role key (prices/stock validated there), so there is no broad client INSERT policy. Customers can read only their own orders; admins read all.
- `order_items` store price/name/size **snapshots** so historical orders never change when products do.

## Roadmap

1. ✅ Scaffold + brand system + DB schema
2. ✅ Storefront (catalog + product detail) from Supabase (local fallback)
3. ✅ Cart + **WhatsApp order**
4. ✅ Auth + customer accounts (`/cuenta`)
5. ✅ MercadoPago checkout (preference + webhook + stock decrement)
6. ✅ Admin panel (product/variant/image CRUD + orders) at `/admin`
7. Polish: SEO/OpenGraph, transactional emails, PDF receipts, analytics

## Deploy

Push to GitHub → import on [Vercel](https://vercel.com/new), add the same env vars, and deploy. Point the Supabase project to production keys.
