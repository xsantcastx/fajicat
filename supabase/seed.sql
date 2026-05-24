-- Seed data for Fajicat. Run after 0001_init.sql.
-- Prices in COP. Stock values are placeholders — set real stock in the admin.

insert into public.categories (slug, name, position) values
  ('gatos', 'Gatos', 1),
  ('perros', 'Perros', 2)
on conflict (slug) do nothing;

insert into public.products (slug, name, description, category_id, base_price, status, featured)
select
  'faja-postquirurgica',
  'Faja postquirúrgica',
  'Faja postquirúrgica para mascotas. Comodidad y protección durante la recuperación de tu gato o perro.',
  c.id,
  21000,
  'active',
  true
from public.categories c
where c.slug = 'gatos'
on conflict (slug) do nothing;

insert into public.product_variants (product_id, size, sku, price, stock_qty, position)
select p.id, v.size, v.sku, v.price, v.stock, v.pos
from public.products p
cross join (values
  ('XS', 'FAJA-XS', 20000, 10, 1),
  ('S',  'FAJA-S',  21000, 10, 2),
  ('M',  'FAJA-M',  21000, 10, 3),
  ('L',  'FAJA-L',  23000, 10, 4),
  ('XL', 'FAJA-XL', 27000, 10, 5)
) as v (size, sku, price, stock, pos)
where p.slug = 'faja-postquirurgica'
on conflict (product_id, size) do nothing;
