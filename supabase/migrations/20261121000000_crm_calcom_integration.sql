-- CRM, Cal.com & U.S. Lead Response Integration Schema
-- Extends market_leads with missing prospect metadata and creates market_bookings for Cal.com events.
-- Completely additive and non-breaking: preserves all existing data and tables.

-- 1. Extend market_leads with additional contact and activity fields
alter table public.market_leads
  add column if not exists website text,
  add column if not exists service_category text,
  add column if not exists notes text,
  add column if not exists last_activity_at timestamptz not null default now();

create index if not exists idx_market_leads_email on public.market_leads (lower(email));
create index if not exists idx_market_leads_last_activity on public.market_leads (last_activity_at desc);

-- 2. Create market_bookings table for Cal.com booking events
create table if not exists public.market_bookings (
  id uuid primary key default gen_random_uuid(),
  external_booking_id text not null unique,
  lead_id uuid references public.market_leads (id) on delete set null,
  market_id text references public.markets (id) default 'us',
  event_title text not null default 'Consultation Demo',
  event_type text,
  attendee_name text not null,
  attendee_email text not null,
  attendee_phone text,
  attendee_time_zone text,
  booking_start timestamptz not null,
  booking_end timestamptz not null,
  booking_status text not null check (booking_status in ('created', 'rescheduled', 'cancelled')),
  booking_source text not null default 'calcom',
  notes text,
  telegram_notified boolean not null default false,
  telegram_error text,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for idempotent lookups, attendee queries, and time filters
create index if not exists idx_market_bookings_lead_id on public.market_bookings (lead_id);
create index if not exists idx_market_bookings_attendee_email on public.market_bookings (lower(attendee_email));
create index if not exists idx_market_bookings_booking_start on public.market_bookings (booking_start desc);
create index if not exists idx_market_bookings_booking_status on public.market_bookings (booking_status);
create index if not exists idx_market_bookings_external_id on public.market_bookings (external_booking_id);

-- RLS setup
alter table public.market_bookings enable row level security;

-- Service role full access
drop policy if exists "Service role full access on market_bookings" on public.market_bookings;
create policy "Service role full access on market_bookings"
  on public.market_bookings
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Admin read and update policies
drop policy if exists "Admin read access on market_bookings" on public.market_bookings;
create policy "Admin read access on market_bookings"
  on public.market_bookings
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admin update access on market_bookings" on public.market_bookings;
create policy "Admin update access on market_bookings"
  on public.market_bookings
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
