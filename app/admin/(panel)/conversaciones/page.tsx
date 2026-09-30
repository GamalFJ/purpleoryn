import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { getTiers } from "@/lib/content";
import { formatDate } from "../prospectos/shared";
import { OutcomeBadges, intentLabel, outcomeLabels, stateLabel } from "./shared";

export const dynamic = "force-dynamic";

export default async function ConversacionesPage() {
  const { supabase } = await requireAdmin();
  const [{ data: sessions }, tiers] = await Promise.all([
    supabase
      .from("chat_sessions")
      .select("id, created_at, updated_at, message_count, recommended_plan, handoff, landing_page, state, intent")
      .order("updated_at", { ascending: false })
      .limit(200),
    getTiers(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-semibold">Conversations</h1>
      <p className="mt-2 text-muted">Chats with Oryn, newest first. Read-only.</p>

      {!sessions?.length ? (
        <div className="mt-8 rounded-[var(--radius-panel)] border border-line bg-surface p-8">
          <h2 className="text-xl font-semibold">No conversations yet</h2>
          <p className="mt-2 text-[15px] text-muted">When someone chats with Oryn on the site, it shows up here.</p>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-line rounded-[var(--radius-panel)] border border-line bg-surface">
          {sessions.map((s) => (
            <li key={s.id}>
              <Link
                href={`/admin/conversaciones/${s.id}`}
                className="grid gap-2 p-4 hover:bg-accent-soft/50 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6 sm:p-5"
              >
                <div className="min-w-0">
                  <p className="tabular font-medium">{formatDate(s.updated_at)}</p>
                  <p className="truncate text-sm text-muted">
                    {s.message_count} {s.message_count === 1 ? "message" : "messages"}
                    {s.landing_page ? ` · from ${s.landing_page}` : ""}
                  </p>
                  <p className="truncate text-sm text-muted">
                    {stateLabel(s.state)} · {intentLabel(s.intent)}
                  </p>
                </div>
                <OutcomeBadges labels={outcomeLabels(s, tiers)} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
