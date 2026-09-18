import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Server-side guard for every admin page and action. Row-level security is the
// real enforcement; this gives a clean redirect instead of empty data.
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/admin/login?error=no-access");

  return { supabase, user };
}
