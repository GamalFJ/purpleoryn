import { createClient } from "@supabase/supabase-js";
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from "./env";

// Service-role client: bypasses RLS entirely. Used for the market_* tables
// (RLS enabled with no policies, service-role-only by design) and for
// conversation state (chat_apply_state / chat_sessions.state and intent).
// Server-only — never import this into a client component.
export function serviceClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}
