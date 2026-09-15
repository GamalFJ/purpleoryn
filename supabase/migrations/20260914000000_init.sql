-- purpleoryn.com — initial schema.
-- Public site reads tiers / site_settings / published portfolio with the anon
-- key; leads are insert-only for anon; everything else requires an admin.

create extension if not exists pgcrypto;

-- ─── helpers ────────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Single-admin model: a user is an admin if their auth id is in this table.
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create policy "admins read self" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- ─── tiers ──────────────────────────────────────────────────────────────────
create table public.tiers (
  slug text primary key check (slug in ('presencia', 'conversion', 'autoridad')),
  name text not null,
  sort_order int not null default 0,
  one_time_price numeric(12, 2) not null check (one_time_price >= 0),
  monthly_price numeric(12, 2) not null check (monthly_price >= 0),
  website text not null default '',
  seo text not null default '',
  gbp text not null default '',
  analytics text not null default '',
  ai_agent text not null default '',
  conversation_cap text not null default '',
  support text not null default '',
  tagline text not null default '',
  highlights text[] not null default '{}',
  updated_at timestamptz not null default now()
);
create trigger tiers_updated_at before update on public.tiers
  for each row execute function public.set_updated_at();
alter table public.tiers enable row level security;
create policy "tiers public read" on public.tiers for select using (true);
create policy "tiers admin write" on public.tiers for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ─── site settings (single row) ─────────────────────────────────────────────
create table public.site_settings (
  id int primary key default 1 check (id = 1),
  hero_headline text not null default '',
  hero_subheadline text not null default '',
  hero_image_url text not null default '',
  about_image_url text not null default '',
  about_bio text not null default '',
  updated_at timestamptz not null default now()
);
create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();
alter table public.site_settings enable row level security;
create policy "settings public read" on public.site_settings for select using (true);
create policy "settings admin write" on public.site_settings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ─── portfolio ──────────────────────────────────────────────────────────────
create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  description text not null default '',
  results text not null default '',
  results_source text not null default '',
  link text,
  cover_image_url text,
  cover_image_path text,
  image_urls text[] not null default '{}',
  image_paths text[] not null default '{}',
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- A published case with results must say where the numbers come from.
  constraint results_need_source check (not published or results = '' or results_source <> '')
);
create trigger portfolio_items_updated_at before update on public.portfolio_items
  for each row execute function public.set_updated_at();
alter table public.portfolio_items enable row level security;
create policy "portfolio public read published" on public.portfolio_items
  for select using (published or public.is_admin());
create policy "portfolio admin write" on public.portfolio_items for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ─── leads ──────────────────────────────────────────────────────────────────
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  plan text check (plan in ('presencia', 'conversion', 'autoridad')),
  name text not null check (char_length(name) between 2 and 120),
  whatsapp text not null check (whatsapp ~ '^\+1(809|829|849)[0-9]{7}$'),
  email text check (email is null or char_length(email) <= 160),
  business text not null check (char_length(business) between 2 and 160),
  message text check (message is null or char_length(message) <= 1500),
  average_sale_value numeric(14, 2),
  roi_snapshot jsonb,
  source text not null default 'servicios_form',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  landing_page text,
  referrer text,
  user_agent text,
  status text not null default 'nuevo' check (status in ('nuevo', 'contactado', 'propuesta', 'ganado', 'perdido'))
);
create index leads_created_at_idx on public.leads (created_at desc);
alter table public.leads enable row level security;
-- Anonymous visitors can create a lead but never read one back.
create policy "leads anon insert" on public.leads for insert to anon, authenticated
  with check (status = 'nuevo');
create policy "leads admin read" on public.leads for select to authenticated using (public.is_admin());
create policy "leads admin update" on public.leads for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "leads admin delete" on public.leads for delete to authenticated using (public.is_admin());

-- ─── storage: public images, admin-only writes ─────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 5242880, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

create policy "site-media public read" on storage.objects for select
  using (bucket_id = 'site-media');
create policy "site-media admin insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'site-media' and public.is_admin());
create policy "site-media admin update" on storage.objects for update to authenticated
  using (bucket_id = 'site-media' and public.is_admin());
create policy "site-media admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'site-media' and public.is_admin());

-- ─── seed: launch tier content (matches lib/tiers.ts DEFAULT_TIERS) ─────────
insert into public.tiers
  (slug, name, sort_order, one_time_price, monthly_price, website, seo, gbp, analytics, ai_agent, conversation_cap, support, tagline, highlights)
values
  ('presencia', 'Presencia', 1, 15499.99, 1499.99,
   'Sitio de una página enfocado en conversión: portada, servicios, sellos de confianza, testimonios y botón de WhatsApp',
   'SEO on-page básico: meta etiquetas, datos estructurados (schema), sitemap y velocidad',
   'Configuración completa: categorías, horario, fotos y publicaciones iniciales',
   'GA4 y Search Console con seguimiento básico de conversiones',
   'Smart Qualifier: responde preguntas frecuentes, hace de 3 a 5 preguntas de calificación y pasa el cliente a WhatsApp con la información organizada',
   '300 al mes',
   'Correo y WhatsApp, atención estándar',
   'Para aparecer en Google y empezar a recibir clientes por WhatsApp.',
   array['Sitio de una página', 'Google Business Profile configurado', 'GA4 y Search Console', 'Agente que califica y pasa a WhatsApp']),
  ('conversion', 'Conversión', 2, 21999.99, 1999.99,
   'Sitio de varias páginas: agrega páginas por servicio y una página de reservas o catálogo',
   'Todo lo de Presencia, más citaciones locales, datos estructurados para resultados enriquecidos y 1 artículo de blog al mes',
   'Todo lo de Presencia, más publicaciones mensuales en Google y respuestas a reseñas asistidas por IA',
   'Todo lo de Presencia, más reporte mensual de rendimiento',
   'Todo lo de Presencia, más puntuación de prospectos, seguimiento automático a las 24 horas y vista simple del pipeline',
   '800 al mes',
   'Todo lo de Presencia, más reunión de seguimiento mensual',
   'Para convertir más visitas con páginas por servicio y seguimiento automático.',
   array['Sitio de varias páginas con reservas o catálogo', '1 artículo de blog al mes', 'Reporte mensual de rendimiento', 'Seguimiento automático a las 24 horas']),
  ('autoridad', 'Autoridad', 3, 28999.99, 2999.99,
   'Todo lo de Conversión, más optimización continua de conversión con pruebas A/B',
   'Todo lo de Conversión, más monitoreo de competidores, calendario de contenido completo e indexación prioritaria',
   'Todo lo de Conversión, más campaña para generar reseñas y publicaciones semanales',
   'Todo lo de Conversión, más recomendaciones en el reporte mensual y llamada trimestral',
   'Agente de IA completo: agenda citas en Google Calendar, toma pedidos y panel real de prospectos (CRM ligero)',
   '2,000 al mes (límite flexible)',
   'Llamada trimestral y canal prioritario',
   'Para crecer con contenido constante y un agente que agenda y toma pedidos.',
   array['Pruebas A/B continuas', 'Campaña de reseñas y publicaciones semanales', 'Agente que agenda en Google Calendar', 'Panel de prospectos (CRM ligero)']);

-- Empty settings row: the site falls back to its placeholder copy until edited.
insert into public.site_settings (id) values (1);
