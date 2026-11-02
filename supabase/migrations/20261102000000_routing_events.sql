-- Multi-market routing events log
-- Records edge routing outcomes to track neutral page fall-through rates.
-- Raw IPs are never stored; only a salted one-way hash (ip_hash) is recorded.

create table if not exists public.routing_events (
  id uuid primary key default gen_random_uuid(),
  timestamp timestamptz not null default now(),
  host text not null,
  resolved_market text,
  action text not null,
  reason text not null,
  country text,
  region text,
  proxy_flag text not null default 'unknown',
  ip_hash text
);

-- Indexes for performance querying and analytics dashboards
create index if not exists idx_routing_events_timestamp on public.routing_events (timestamp desc);
create index if not exists idx_routing_events_host on public.routing_events (host);
create index if not exists idx_routing_events_action on public.routing_events (action);
create index if not exists idx_routing_events_reason on public.routing_events (reason);
create index if not exists idx_routing_events_market on public.routing_events (resolved_market);

-- Row Level Security: table is written to by service role exclusively
alter table public.routing_events enable row level security;

create policy "Service role full access on routing_events"
  on public.routing_events
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
