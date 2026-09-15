-- AI agent conversation log + rate-limit counters.
-- Tables are closed to anon/authenticated (admin read only). The API route
-- writes through SECURITY DEFINER functions, which enforce length limits and
-- return the counters the route uses for rate limiting.

create table public.chat_sessions (
  id uuid primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  ip_hash text not null,
  landing_page text,
  user_agent text,
  message_count int not null default 0,
  recommended_plan text check (recommended_plan in ('presencia', 'conversion', 'autoridad')),
  handoff text check (handoff in ('servicios_form', 'cal_com'))
);
create index chat_sessions_ip_idx on public.chat_sessions (ip_hash, updated_at desc);
alter table public.chat_sessions enable row level security;
create policy "chat sessions admin read" on public.chat_sessions
  for select to authenticated using (public.is_admin());

create table public.chat_messages (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.chat_sessions (id) on delete cascade,
  created_at timestamptz not null default now(),
  role text not null check (role in ('user', 'assistant')),
  content text not null check (char_length(content) between 1 and 4000),
  ip_hash text not null
);
create index chat_messages_session_idx on public.chat_messages (session_id, created_at);
create index chat_messages_ip_idx on public.chat_messages (ip_hash, created_at desc);
alter table public.chat_messages enable row level security;
create policy "chat messages admin read" on public.chat_messages
  for select to authenticated using (public.is_admin());

-- Logs one message (creating the session on first use) and returns counters.
create or replace function public.chat_log_message(
  p_session_id uuid,
  p_ip_hash text,
  p_role text,
  p_content text,
  p_landing_page text default null,
  p_user_agent text default null
)
returns json
language plpgsql security definer set search_path = public
as $$
declare
  v_session_count int;
  v_ip_count int;
begin
  if p_role not in ('user', 'assistant') then
    raise exception 'invalid role';
  end if;
  if char_length(coalesce(p_ip_hash, '')) <> 64 then
    raise exception 'invalid ip hash';
  end if;

  insert into public.chat_sessions (id, ip_hash, landing_page, user_agent)
  values (p_session_id, p_ip_hash, left(p_landing_page, 300), left(p_user_agent, 300))
  on conflict (id) do nothing;

  insert into public.chat_messages (session_id, role, content, ip_hash)
  values (p_session_id, p_role, left(p_content, 4000), p_ip_hash);

  update public.chat_sessions
     set message_count = message_count + 1, updated_at = now()
   where id = p_session_id
  returning message_count into v_session_count;

  select count(*) into v_ip_count
    from public.chat_messages
   where ip_hash = p_ip_hash and role = 'user' and created_at > now() - interval '1 hour';

  return json_build_object('session_messages', v_session_count, 'ip_user_messages_last_hour', v_ip_count);
end $$;

create or replace function public.chat_record_outcome(
  p_session_id uuid,
  p_recommended_plan text default null,
  p_handoff text default null
)
returns void
language sql security definer set search_path = public
as $$
  update public.chat_sessions
     set recommended_plan = coalesce(p_recommended_plan, recommended_plan),
         handoff = coalesce(p_handoff, handoff),
         updated_at = now()
   where id = p_session_id;
$$;

revoke all on function public.chat_log_message(uuid, text, text, text, text, text) from public;
revoke all on function public.chat_record_outcome(uuid, text, text) from public;
grant execute on function public.chat_log_message(uuid, text, text, text, text, text) to anon, authenticated;
grant execute on function public.chat_record_outcome(uuid, text, text) to anon, authenticated;
