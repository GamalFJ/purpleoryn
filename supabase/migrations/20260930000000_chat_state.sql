-- Server-controlled conversation lifecycle for the existing Oryn chat.
-- No new conversation store is introduced. booking_confirmed is reserved for
-- a future externally verified booking callback, not the public chat RPC.

alter table public.chat_sessions
  add column state text not null default 'new'
    check (state in (
      'new', 'inquiry', 'service_inquiry', 'sales_qualification',
      'plan_recommendation', 'booking_intent', 'booking_offered',
      'booking_confirmed', 'human_handoff_requested', 'completed',
      'unknown_request', 'external_failure'
    )),
  add column intent text not null default 'general_inquiry'
    check (intent in ('general_inquiry', 'services', 'pricing', 'sales', 'booking', 'human_handoff', 'unknown')),
  add column intent_history jsonb not null default '[]'::jsonb
    check (jsonb_typeof(intent_history) = 'array'),
  add column qualification jsonb not null default '{}'::jsonb
    check (jsonb_typeof(qualification) = 'object'),
  add column booking_status text
    check (booking_status in ('offered', 'confirmed', 'failed')),
  add column handoff_status text
    check (handoff_status in ('requested', 'completed', 'failed')),
  add column handoff_summary text,
  add column outcome text,
  add column last_error_code text,
  add column completed_at timestamptz;

create index chat_sessions_state_idx on public.chat_sessions (state, updated_at desc);
create index chat_sessions_intent_idx on public.chat_sessions (intent, updated_at desc);

-- The API can request a state update, but the database validates the target,
-- transition, and booking-confirmation rule. This function never accepts
-- booking_confirmed; that state requires a future external provider callback.
create or replace function public.chat_update_state(
  p_session_id uuid,
  p_state text,
  p_intent text default 'general_inquiry',
  p_qualification jsonb default null,
  p_recommended_plan text default null,
  p_booking_status text default null,
  p_handoff_status text default null,
  p_handoff_summary text default null,
  p_outcome text default null,
  p_last_error_code text default null
)
returns json
language plpgsql security definer set search_path = public
as $$
declare
  v_current_state text;
  v_history jsonb;
  v_allowed boolean := false;
begin
  if p_state not in (
    'new', 'inquiry', 'service_inquiry', 'sales_qualification',
    'plan_recommendation', 'booking_intent', 'booking_offered',
    'booking_confirmed', 'human_handoff_requested', 'completed',
    'unknown_request', 'external_failure'
  ) then
    raise exception 'invalid conversation state';
  end if;
  if p_intent not in ('general_inquiry', 'services', 'pricing', 'sales', 'booking', 'human_handoff', 'unknown') then
    raise exception 'invalid conversation intent';
  end if;
  if p_state = 'booking_confirmed' then
    raise exception 'booking confirmation requires external verification';
  end if;
  if p_booking_status is not null and p_booking_status not in ('offered', 'confirmed', 'failed') then
    raise exception 'invalid booking status';
  end if;
  if p_handoff_status is not null and p_handoff_status not in ('requested', 'completed', 'failed') then
    raise exception 'invalid handoff status';
  end if;
  if p_qualification is not null and jsonb_typeof(p_qualification) <> 'object' then
    raise exception 'invalid qualification';
  end if;

  select state into v_current_state
    from public.chat_sessions
   where id = p_session_id
   for update;
  if not found then
    raise exception 'conversation not found';
  end if;

  -- Natural intent changes are allowed, but state changes must follow the
  -- lifecycle. The public RPC intentionally excludes booking_confirmed.
  v_allowed := case v_current_state
    when 'new' then p_state in ('inquiry', 'service_inquiry', 'sales_qualification', 'booking_intent', 'human_handoff_requested', 'unknown_request', 'external_failure')
    when 'inquiry' then p_state in ('inquiry', 'service_inquiry', 'sales_qualification', 'booking_intent', 'human_handoff_requested', 'unknown_request', 'completed', 'external_failure')
    when 'service_inquiry' then p_state in ('inquiry', 'service_inquiry', 'sales_qualification', 'booking_intent', 'human_handoff_requested', 'unknown_request', 'completed', 'external_failure')
    when 'sales_qualification' then p_state in ('inquiry', 'service_inquiry', 'sales_qualification', 'plan_recommendation', 'booking_intent', 'human_handoff_requested', 'unknown_request', 'completed', 'external_failure')
    when 'plan_recommendation' then p_state in ('inquiry', 'service_inquiry', 'sales_qualification', 'plan_recommendation', 'booking_intent', 'booking_offered', 'human_handoff_requested', 'completed', 'external_failure')
    when 'booking_intent' then p_state in ('inquiry', 'service_inquiry', 'sales_qualification', 'booking_intent', 'booking_offered', 'human_handoff_requested', 'unknown_request', 'completed', 'external_failure')
    when 'booking_offered' then p_state in ('inquiry', 'service_inquiry', 'sales_qualification', 'booking_intent', 'booking_offered', 'human_handoff_requested', 'unknown_request', 'completed', 'external_failure')
    when 'booking_confirmed' then p_state in ('completed', 'inquiry', 'service_inquiry', 'sales_qualification', 'booking_intent', 'human_handoff_requested', 'unknown_request')
    when 'human_handoff_requested' then p_state in ('inquiry', 'service_inquiry', 'sales_qualification', 'booking_intent', 'human_handoff_requested', 'completed', 'external_failure', 'unknown_request')
    when 'completed' then p_state in ('inquiry', 'service_inquiry', 'sales_qualification', 'booking_intent', 'human_handoff_requested', 'unknown_request', 'completed')
    when 'unknown_request' then p_state in ('inquiry', 'service_inquiry', 'sales_qualification', 'booking_intent', 'human_handoff_requested', 'unknown_request', 'external_failure')
    when 'external_failure' then p_state in ('inquiry', 'service_inquiry', 'sales_qualification', 'booking_intent', 'human_handoff_requested', 'unknown_request', 'external_failure')
    else false
  end;
  if not v_allowed then
    raise exception 'invalid conversation state transition';
  end if;

  v_history := coalesce((select intent_history from public.chat_sessions where id = p_session_id), '[]'::jsonb)
    || jsonb_build_array(jsonb_build_object('intent', p_intent, 'state', p_state, 'at', now()));

  update public.chat_sessions
     set state = p_state,
         intent = p_intent,
         intent_history = v_history,
         qualification = coalesce(p_qualification, qualification),
         recommended_plan = coalesce(p_recommended_plan, recommended_plan),
         booking_status = coalesce(p_booking_status, booking_status),
         handoff_status = coalesce(p_handoff_status, handoff_status),
         handoff_summary = coalesce(left(p_handoff_summary, 500), handoff_summary),
         outcome = coalesce(left(p_outcome, 200), outcome),
         last_error_code = coalesce(left(p_last_error_code, 100), last_error_code),
         completed_at = case when p_state = 'completed' then coalesce(completed_at, now()) else completed_at end,
         updated_at = now()
   where id = p_session_id;

  return json_build_object('state', p_state, 'intent', p_intent);
end $$;

revoke all on function public.chat_update_state(uuid, text, text, jsonb, text, text, text, text, text, text) from public;
grant execute on function public.chat_update_state(uuid, text, text, jsonb, text, text, text, text, text, text) to anon, authenticated;
