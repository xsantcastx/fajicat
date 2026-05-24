-- Product image storage. Run after 0001_init.sql. Requires is_admin().

insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

create policy "product images public read"
  on storage.objects for select
  using (bucket_id = 'products');

create policy "product images admin insert"
  on storage.objects for insert
  with check (bucket_id = 'products' and public.is_admin());

create policy "product images admin update"
  on storage.objects for update
  using (bucket_id = 'products' and public.is_admin());

create policy "product images admin delete"
  on storage.objects for delete
  using (bucket_id = 'products' and public.is_admin());
