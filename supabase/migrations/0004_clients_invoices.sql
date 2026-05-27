-- Adds reusable B2B clients + editable promo total on orders.
-- Run once in the Supabase SQL editor.

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  address text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_clients_updated on public.clients;
create trigger trg_clients_updated before update on public.clients
  for each row execute function public.set_updated_at();

alter table public.clients enable row level security;
drop policy if exists "clients admin all" on public.clients;
create policy "clients admin all" on public.clients
  for all using (public.is_admin()) with check (public.is_admin());

-- Link an order to a saved client (nullable: storefront orders won't have one).
alter table public.orders
  add column if not exists client_id uuid references public.clients (id) on delete set null;

-- Editable promotional total. If set and differs from subtotal, the invoice
-- shows "Total con promo: $X" instead of "Total: $subtotal".
alter table public.orders
  add column if not exists promo_total numeric(12, 2);
