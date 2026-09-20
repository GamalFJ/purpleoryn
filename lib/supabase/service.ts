import { createClient } from "@supabase/supabase-js";
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from "./env";

// Service-role client: bypasses RLS entirely. Only for the market_* tables,
// which have RLS enabled with no policies (service-role-only by design).
// Server-only — never import this into a client component.
export function serviceClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}
