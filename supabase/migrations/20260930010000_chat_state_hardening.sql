-- Hardens conversation-state writes introduced in 20260930000000_chat_state.sql.
--
-- Problems in the first version:
--   1. chat_update_state was executable by anon/authenticated, so anyone holding
--      the public anon key could set any state, or booking_status = 'confirmed',
--      handoff_status = 'completed' or state = 'completed' directly.
--   2. Rejected transitions raised an exception that the API only logged, and the
--      transition table omitted moves the chat legitimately makes in one turn
--      (for example new -> booking_offered, service_inquiry -> plan_recommendation).
--
-- After this migration:
--   * State is written only through service-role-only functions; anon and
--     authenticated have no execute rights on any of them.
--   * chat_apply_state is the untrusted-path RPC used by /api/chat. It refuses the
--     privileged values (booking_confirmed, completed, booking_status 'confirmed',
--     handoff_status 'completed').
--   * chat_apply_trusted_state is the only path that accepts them. Nothing calls it
--     yet; it exists for a future verified booking/handoff callback.
--   * The transition decision is made here, from the state actually stored on the
--     row. Rejections are returned as {ok:false, code, state} (previous state kept,
--     failure recorded in last_error_code) instead of raising.
--
-- Deploy order: apply this migration BEFORE (or together with) the code that calls
-- chat_apply_state. If the code ships first, state updates report
-- stateUpdate = "failed" in the /api/chat response; chat itself keeps working.

drop function if exists public.chat_update_state(uuid, text, text, jsonb, text, text, text, text, text, text);

-- Single source of truth for allowed state transitions.
create or replace function public.chat_state_can_transition(p_from text, p_to text)
returns boolean
language sql immutable set search_path = public
as $$
  select case
    when p_to = 'new' then false
    -- Only a confirmed booking (trusted path) can follow a booking offer or intent.
    when p_to = 'booking_confirmed' then p_from in ('booking_intent', 'booking_offered', 'booking_confirmed')
    -- A finished conversation can wrap up or reopen on a new topic, but never
    -- regress to an offer/recommendation or to an external failure.
    when p_from in ('booking_confirmed', 'completed') then p_to in (
      'completed', 'inquiry', 'service_inquiry', 'sales_qualification',
      'booking_intent', 'human_handoff_requested', 'unknown_request'
    )
    else p_to in (
      'inquiry', 'service_inquiry', 'sales_qualification', 'plan_recommendation',
      'booking_intent', 'booking_offered', 'human_handoff_requested', 'completed',
      'unknown_request', 'external_failure'
    )
  end
$$;

-- Internal implementation. Not callable by any API role; only the two
-- SECURITY DEFINER wrappers below reach it.
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
  p_last_error_code text
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
  if p_handoff_status is not null and p_handoff_status not in ('requested', 'completed', 'failed') then
    return json_build_object('ok', false, 'code', 'invalid_handoff_status');
  end if;
  if p_qualification is not null and jsonb_typeof(p_qualification) <> 'object' then
    return json_build_object('ok', false, 'code', 'invalid_qualification');
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
  p_last_error_code text default null
)
returns json
language sql security definer set search_path = public
as $$
  select public.chat_apply_state_internal(
    false, p_session_id, p_state, p_intent, p_qualification, p_recommended_plan,
    p_booking_status, p_handoff_status, p_handoff_summary, p_outcome, p_last_error_code
  );
$$;

-- Trusted path, for verified server-side events only (for example a validated
-- Cal.com webhook or a completed human handoff). Not called by any code yet.
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
  p_last_error_code text default null
)
returns json
language sql security definer set search_path = public
as $$
  select public.chat_apply_state_internal(
    true, p_session_id, p_state, p_intent, p_qualification, p_recommended_plan,
    p_booking_status, p_handoff_status, p_handoff_summary, p_outcome, p_last_error_code
  );
$$;

-- Supabase's default privileges grant EXECUTE on new public functions to anon and
-- authenticated, so revoke from them explicitly rather than only from PUBLIC.
revoke all on function public.chat_state_can_transition(text, text) from public, anon, authenticated;
revoke all on function public.chat_apply_state_internal(boolean, uuid, text, text, jsonb, text, text, text, text, text, text) from public, anon, authenticated, service_role;
revoke all on function public.chat_apply_state(uuid, text, text, jsonb, text, text, text, text, text, text) from public, anon, authenticated;
revoke all on function public.chat_apply_trusted_state(uuid, text, text, jsonb, text, text, text, text, text, text) from public, anon, authenticated;

grant execute on function public.chat_apply_state(uuid, text, text, jsonb, text, text, text, text, text, text) to service_role;
grant execute on function public.chat_apply_trusted_state(uuid, text, text, jsonb, text, text, text, text, text, text) to service_role;
