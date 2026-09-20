-- Multi-market schema: markets, pricing_tiers, market_content, market_leads,
-- orders. Everything market-specific (pricing, copy, leads, orders) lives
-- here; nothing about a market is hardcoded in a component.
--
-- Named market_leads (not `leads`) to avoid colliding with the existing
-- DR-only public.leads table, which the live /servicios order form still
-- writes to. That table, public.tiers, and everything else from
-- 20260914000000_init.sql onward is untouched by this migration.
--
-- All five tables are RLS-enabled with NO policies: service-role-only
-- access. The anon/public key gets nothing. Never put the service role key
-- in client-side code.

create table public.markets (
  id text primary key,                    -- 'do', 'us', 'ca', 'ht'
  name text not null,
  domain text not null unique,            -- 'purpleoryn.com', 'us.purpleoryn.com', ...
  language text not null,                 -- 'es', 'en', 'fr', 'fr'
  currency text not null,                 -- 'DOP', 'USD', 'CAD', 'USD'
  primary_channel text not null default 'whatsapp', -- 'whatsapp' | 'sms_webchat'
  whatsapp_number text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.pricing_tiers (
  id uuid primary key default gen_random_uuid(),
  market_id text not null references public.markets (id) on delete cascade,
  tier_key text not null,                 -- stable key: 'presencia' | 'conversion' | 'autoridad'
  tier_name text not null,                -- localized display name
  one_time_price numeric,
  monthly_price numeric,
  conversation_cap int,
  overage_rate numeric,
  recommended boolean not null default false,
  sort_order int not null default 0,
  unique (market_id, tier_key)
);

create table public.market_content (
  id uuid primary key default gen_random_uuid(),
  market_id text not null references public.markets (id) on delete cascade,
  section_key text not null,              -- 'hero_headline', 'hero_subheadline', 'pain_point', 'cta_label', ...
  content text not null,
  unique (market_id, section_key)
);

create table public.market_leads (
  id uuid primary key default gen_random_uuid(),
  market_id text references public.markets (id),
  name text,
  business_name text,
  email text,
  phone text,
  channel text,                           -- 'whatsapp' | 'sms' | 'webchat' | 'form'
  tier_interest text,
  message text,
  source text,                            -- referrer / utm
  status text not null default 'new',     -- new, contacted, quoted, won, lost
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.market_leads (id),
  market_id text references public.markets (id),
  tier_key text not null,
  addon text,
  one_time_price numeric,
  monthly_price numeric,
  currency text,
  payment_status text not null default 'pending_first_payment',
  created_at timestamptz not null default now()
);

alter table public.markets enable row level security;
alter table public.pricing_tiers enable row level security;
alter table public.market_content enable row level security;
alter table public.market_leads enable row level security;
alter table public.orders enable row level security;
-- No policies added on purpose: these tables are only ever read or written
-- server-side with the service role key.
