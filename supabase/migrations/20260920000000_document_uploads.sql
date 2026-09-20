-- Lets the admin panel replace the two downloadable PDFs (Oryn Presence,
-- Cómo Trabajamos) without a code deploy. An empty column means "use the
-- bundled default file" — see app/docs/*.pdf/route.ts.
alter table public.site_settings
  add column oryn_presence_doc_url text not null default '',
  add column como_trabajamos_doc_url text not null default '';

-- ─── storage: public PDFs, admin-only writes ───────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-docs', 'site-docs', true, 20971520, array['application/pdf'])
on conflict (id) do nothing;

create policy "site-docs public read" on storage.objects for select
  using (bucket_id = 'site-docs');
create policy "site-docs admin insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'site-docs' and public.is_admin());
create policy "site-docs admin update" on storage.objects for update to authenticated
  using (bucket_id = 'site-docs' and public.is_admin());
create policy "site-docs admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'site-docs' and public.is_admin());
