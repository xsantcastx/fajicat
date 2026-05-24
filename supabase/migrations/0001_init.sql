-- Fajicat initial schema + Row-Level Security
-- Run once in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------ enums
create type product_status as enum ('draft', 'active', 'archived');
create type order_status as enum ('pending', 'paid', 'shipped', 'delivered', 'cancelled');
create type order_channel as enum ('web', 'whatsapp');
create type user_role as enum ('customer', 'admin');

-- --------------------------------------------------------------- profiles
-- 1:1 with auth.users; holds role + contact info.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  role user_role not null default 'customer',
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------- categories
-- Animal type: Gatos, Perros, etc.
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------------- products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  category_id uuid references public.categories (id) on delete set null,
  base_price numeric(12, 2) not null default 0, -- COP
  status product_status not null default 'draft',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  url text not null,
  alt text,
  position int not null default 0
);

-- Size variants (XS..XL). price null => fall back to product.base_price.
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  size text not null,
  sku text unique,
  price numeric(12, 2),
  stock_qty int not null default 0,
  position int not null default 0,
  created_at timestamptz not null default now(),
  unique (product_id, size)
);

-- ----------------------------------------------------------------- orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  status order_status not null default 'pending',
  channel order_channel not null default 'web',
  subtotal numeric(12, 2) not null default 0,
  shipping numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  currency text not null default 'COP',
  contact_name text,
  contact_phone text,
  contact_email text,
  shipping_address jsonb,
  payment_provider text,
  payment_id text,
  payment_status text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Line items store snapshots so past orders never change when products do.
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  variant_id uuid references public.product_variants (id) on delete set null,
  product_name text not null,
  size text,
  unit_price numeric(12, 2) not null,
  quantity int not null check (quantity > 0),
  line_total numeric(12, 2) not null
);

-- --------------------------------------------------------------- triggers
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_products_updated before update on public.products
  for each row execute function public.set_updated_at();
create trigger trg_orders_updated before update on public.orders
  for each row execute function public.set_updated_at();

-- Auto-create a profile row when a user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Admin check (security definer avoids RLS recursion on profiles).
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ------------------------------------------------------------------- RLS
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- profiles
create policy "profiles self or admin read" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "profiles self update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles admin write" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- catalog: anyone can read active products; only admins write
create policy "categories public read" on public.categories
  for select using (true);
create policy "categories admin write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

create policy "products public read active" on public.products
  for select using (status = 'active' or public.is_admin());
create policy "products admin write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

create policy "product_images public read" on public.product_images
  for select using (
    exists (
      select 1 from public.products p
      where p.id = product_id and (p.status = 'active' or public.is_admin())
    )
  );
create policy "product_images admin write" on public.product_images
  for all using (public.is_admin()) with check (public.is_admin());

create policy "variants public read" on public.product_variants
  for select using (
    exists (
      select 1 from public.products p
      where p.id = product_id and (p.status = 'active' or public.is_admin())
    )
  );
create policy "variants admin write" on public.product_variants
  for all using (public.is_admin()) with check (public.is_admin());

-- orders: customers read their own; admins read all. Orders are CREATED
-- server-side with the service-role key (price/stock validated there), so we
-- intentionally do not expose a broad client INSERT policy.
create policy "orders own read" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());
create policy "orders admin write" on public.orders
  for all using (public.is_admin()) with check (public.is_admin());

create policy "order_items own read" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
    )
  );
create policy "order_items admin write" on public.order_items
  for all using (public.is_admin()) with check (public.is_admin());
