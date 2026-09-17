-- Final pricing, per-plan conversation cap + overage, recommended flag, and
-- the add-ons table (Agente de Voz IA).
--
-- Additive only: safe to apply before or right after deploying the matching
-- code. The legacy free-text `conversation_cap` column is kept (and updated)
-- so the currently deployed code keeps showing correct values; it is dropped
-- by 20260916000100_drop_conversation_cap_text.sql AFTER the deploy.

-- ─── tiers: new columns ─────────────────────────────────────────────────────
alter table public.tiers
  add column conversations_included int not null default 0 check (conversations_included >= 0),
  add column conversation_overage numeric(12, 2) not null default 0 check (conversation_overage >= 0),
  add column recommended boolean not null default false;

-- At most one recommended plan.
create unique index tiers_one_recommended on public.tiers (recommended) where recommended;

update public.tiers set
  one_time_price = 15499.99, monthly_price = 1499.99,
  conversations_included = 75, conversation_overage = 18.00,
  conversation_cap = '75 al mes', recommended = false
where slug = 'presencia';

update public.tiers set
  one_time_price = 21999.99, monthly_price = 2199.99,
  conversations_included = 150, conversation_overage = 16.00,
  conversation_cap = '150 al mes', recommended = true
where slug = 'conversion';

update public.tiers set
  one_time_price = 28999.99, monthly_price = 3499.99,
  conversations_included = 300, conversation_overage = 14.00,
  conversation_cap = '300 al mes', recommended = false
where slug = 'autoridad';

-- ─── add-ons ────────────────────────────────────────────────────────────────
-- Sold on top of a plan; never rendered as a fourth plan card.
create table public.addons (
  slug text primary key check (slug ~ '^[a-z0-9-]+$'),
  name text not null,
  description text not null default '',
  sort_order int not null default 0,
  one_time_price numeric(12, 2) not null check (one_time_price >= 0),
  monthly_price numeric(12, 2) not null check (monthly_price >= 0),
  included_units int not null default 0 check (included_units >= 0),
  -- Plural unit name shown to visitors, e.g. 'minutos'.
  unit_label text not null default '',
  overage_rate numeric(12, 2) not null default 0 check (overage_rate >= 0),
  published boolean not null default true,
  updated_at timestamptz not null default now()
);
create trigger addons_updated_at before update on public.addons
  for each row execute function public.set_updated_at();
alter table public.addons enable row level security;
create policy "addons public read published" on public.addons
  for select using (published or public.is_admin());
create policy "addons admin write" on public.addons for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Matches lib/addons.ts DEFAULT_ADDONS.
insert into public.addons
  (slug, name, description, sort_order, one_time_price, monthly_price, included_units, unit_label, overage_rate)
values
  ('agente-de-voz', 'Agente de Voz IA', 'Un agente de IA que contesta las llamadas de tu negocio.', 1,
   20000.00, 2199.99, 150, 'minutos', 16.00);
