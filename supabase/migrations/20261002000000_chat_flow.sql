-- Oryn brain, phase 1: conversation-flow bookkeeping and the 'offered' handoff status.
--
--   * chat_sessions.flow (jsonb object): sales stage, pending offer, failed-turn counter and similar
--     bookkeeping that is not something the visitor said (that stays in `qualification`).
--   * handoff_status gains 'offered': the chat showed the WhatsApp handoff button. 'requested' stays
--     for a visitor who asked for a person; 'completed' stays reachable only through the trusted path.
--   * chat_apply_state / chat_apply_trusted_state take an optional p_flow and pass it through. The
--     privileged-value rules and the transition table are unchanged.
--
-- Deploy order: apply this migration BEFORE the code that sends p_flow. It is backward compatible:
-- the old code calls chat_apply_state with named parameters and no p_flow, which resolves to the new
-- function through the default. If the code ships first, state updates report stateUpdate = "failed";
-- chat itself keeps working.

alter table public.chat_sessions
  add column if not exists flow jsonb not null default '{}'::jsonb
    check (jsonb_typeof(flow) = 'object');

alter table public.chat_sessions drop constraint if exists chat_sessions_handoff_status_check;
alter table public.chat_sessions
  add constraint chat_sessions_handoff_status_check
    check (handoff_status in ('offered', 'requested', 'completed', 'failed'));

-- Replace the old signatures. Two overloads that differ only by a defaulted trailing parameter
-- would make a named-parameter call ambiguous, so the old ones are dropped first.
drop function if exists public.chat_apply_state(uuid, text, text, jsonb, text, text, text, text, text, text);
drop function if exists public.chat_apply_trusted_state(uuid, text, text, jsonb, text, text, text, text, text, text);
drop function if exists public.chat_apply_state_internal(boolean, uuid, text, text, jsonb, text, text, text, text, text, text);

create or replace function public.chat_apply_state_internal(
  p_trusted boolean,
  p_session_id uuid,
  p_state text,
  p_intent text,
  p_qualification jsonb,
  p_recommended_plan text,
  p_booking_status text,
  p_handoff_status text,
  p_handoff_summary text,
  p_outcome text,
  p_last_error_code text,
  p_flow jsonb
)
returns json
language plpgsql security definer set search_path = public
as $$
declare
  v_current_state text;
  v_current_intent text;
  v_code text;
  v_history jsonb;
begin
  if p_state is null or p_state not in (
    'new', 'inquiry', 'service_inquiry', 'sales_qualification',
    'plan_recommendation', 'booking_intent', 'booking_offered',
    'booking_confirmed', 'human_handoff_requested', 'completed',
    'unknown_request', 'external_failure'
  ) then
    return json_build_object('ok', false, 'code', 'invalid_state');
  end if;
  if p_intent is null or p_intent not in ('general_inquiry', 'services', 'pricing', 'sales', 'booking', 'human_handoff', 'unknown') then
    return json_build_object('ok', false, 'code', 'invalid_intent');
  end if;
  if p_booking_status is not null and p_booking_status not in ('offered', 'confirmed', 'failed') then
    return json_build_object('ok', false, 'code', 'invalid_booking_status');
  end if;
  if p_handoff_status is not null and p_handoff_status not in ('offered', 'requested', 'completed', 'failed') then
    return json_build_object('ok', false, 'code', 'invalid_handoff_status');
  end if;
  if p_qualification is not null and jsonb_typeof(p_qualification) <> 'object' then
    return json_build_object('ok', false, 'code', 'invalid_qualification');
  end if;
  if p_flow is not null and jsonb_typeof(p_flow) <> 'object' then
    return json_build_object('ok', false, 'code', 'invalid_flow');
  end if;

  -- Lock the row so the transition is judged against the state stored right now.
  select state, intent into v_current_state, v_current_intent
    from public.chat_sessions
   where id = p_session_id
   for update;
  if not found then
    return json_build_object('ok', false, 'code', 'session_not_found');
  end if;

  if not p_trusted and (
    p_state in ('booking_confirmed', 'completed')
    or p_booking_status = 'confirmed'
    or p_handoff_status = 'completed'
  ) then
    v_code := 'privileged_transition';
  elsif not public.chat_state_can_transition(v_current_state, p_state) then
    v_code := 'invalid_transition';
  end if;

  if v_code is not null then
    -- Keep the previous state; record that something was refused.
    update public.chat_sessions
       set last_error_code = coalesce(left(p_last_error_code, 100), v_code),
           updated_at = now()
     where id = p_session_id;
    return json_build_object('ok', false, 'code', v_code, 'state', v_current_state, 'intent', v_current_intent);
  end if;

  select intent_history into v_history from public.chat_sessions where id = p_session_id;
  v_history := coalesce(v_history, '[]'::jsonb)
    || jsonb_build_array(jsonb_build_object('intent', p_intent, 'state', p_state, 'at', now()));

  update public.chat_sessions
     set state = p_state,
         intent = p_intent,
         intent_history = v_history,
         qualification = coalesce(p_qualification, qualification),
         flow = coalesce(p_flow, flow),
         recommended_plan = coalesce(p_recommended_plan, recommended_plan),
         booking_status = coalesce(p_booking_status, booking_status),
         handoff_status = coalesce(p_handoff_status, handoff_status),
         handoff_summary = coalesce(left(p_handoff_summary, 500), handoff_summary),
         outcome = coalesce(left(p_outcome, 200), outcome),
         last_error_code = coalesce(left(p_last_error_code, 100), last_error_code),
         completed_at = case when p_state = 'completed' then coalesce(completed_at, now()) else completed_at end,
         updated_at = now()
   where id = p_session_id;

  return json_build_object('ok', true, 'state', p_state, 'intent', p_intent);
end $$;

-- Untrusted path, used by /api/chat (visitor-driven). Cannot reach privileged values.
create or replace function public.chat_apply_state(
  p_session_id uuid,
  p_state text,
  p_intent text default 'general_inquiry',
  p_qualification jsonb default null,
  p_recommended_plan text default null,
  p_booking_status text default null,
  p_handoff_status text default null,
  p_handoff_summary text default null,
  p_outcome text default null,
  p_last_error_code text default null,
  p_flow jsonb default null
)
returns json
language sql security definer set search_path = public
as $$
  select public.chat_apply_state_internal(
    false, p_session_id, p_state, p_intent, p_qualification, p_recommended_plan,
    p_booking_status, p_handoff_status, p_handoff_summary, p_outcome, p_last_error_code, p_flow
  );
$$;

-- Trusted path, for verified server-side events only. Not called by any code yet.
create or replace function public.chat_apply_trusted_state(
  p_session_id uuid,
  p_state text,
  p_intent text default 'general_inquiry',
  p_qualification jsonb default null,
  p_recommended_plan text default null,
  p_booking_status text default null,
  p_handoff_status text default null,
  p_handoff_summary text default null,
  p_outcome text default null,
  p_last_error_code text default null,
  p_flow jsonb default null
)
returns json
language sql security definer set search_path = public
as $$
  select public.chat_apply_state_internal(
    true, p_session_id, p_state, p_intent, p_qualification, p_recommended_plan,
    p_booking_status, p_handoff_status, p_handoff_summary, p_outcome, p_last_error_code, p_flow
  );
$$;

-- Same privilege model as 20260930010000_chat_state_hardening.sql: no API role except service_role.
revoke all on function public.chat_apply_state_internal(boolean, uuid, text, text, jsonb, text, text, text, text, text, text, jsonb) from public, anon, authenticated, service_role;
revoke all on function public.chat_apply_state(uuid, text, text, jsonb, text, text, text, text, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.chat_apply_trusted_state(uuid, text, text, jsonb, text, text, text, text, text, text, jsonb) from public, anon, authenticated;

grant execute on function public.chat_apply_state(uuid, text, text, jsonb, text, text, text, text, text, text, jsonb) to service_role;
grant execute on function public.chat_apply_trusted_state(uuid, text, text, jsonb, text, text, text, text, text, text, jsonb) to service_role;
