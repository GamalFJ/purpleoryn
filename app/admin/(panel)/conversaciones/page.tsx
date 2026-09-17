import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { getTiers } from "@/lib/content";
import { formatDate } from "../prospectos/shared";
import { OutcomeBadges, outcomeLabels } from "./shared";

export const dynamic = "force-dynamic";

export default async function ConversacionesPage() {
  const { supabase } = await requireAdmin();
  const [{ data: sessions }, tiers] = await Promise.all([
    supabase
      .from("chat_sessions")
      .select("id, created_at, updated_at, message_count, recommended_plan, handoff, landing_page")
      .order("updated_at", { ascending: false })
      .limit(200),
    getTiers(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-semibold">Conversaciones</h1>
      <p className="mt-2 text-muted">Chats con Oryn, del más reciente al más antiguo. Solo lectura.</p>

      {!sessions?.length ? (
        <div className="mt-8 rounded-[var(--radius-panel)] border border-line bg-surface p-8">
          <h2 className="text-xl font-semibold">Todavía no hay conversaciones</h2>
          <p className="mt-2 text-[15px] text-muted">Cuando alguien le escriba a Oryn en el sitio, la conversación aparecerá aquí.</p>
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
                    {s.message_count} {s.message_count === 1 ? "mensaje" : "mensajes"}
                    {s.landing_page ? ` · desde ${s.landing_page}` : ""}
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
