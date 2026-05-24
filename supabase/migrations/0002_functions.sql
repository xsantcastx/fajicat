-- Helper functions. Run after 0001_init.sql.

-- Atomically decrement variant stock (never below zero).
create or replace function public.decrement_variant_stock(
  p_variant_id uuid,
  p_qty int
)
returns void
language sql
security definer
set search_path = public
as $$
  update public.product_variants
  set stock_qty = greatest(stock_qty - p_qty, 0)
  where id = p_variant_id;
$$;
