import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { cn } from "@/lib/cn";
import { getTiers } from "@/lib/content";
import { formatDate } from "../../prospectos/shared";
import { OutcomeBadges, bookingStatusLabel, handoffStatusLabel, intentLabel, outcomeLabels, qualificationRows, stateLabel } from "../shared";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function ConversacionPage({ params }: { params: Params }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase } = await requireAdmin();

  const [{ data: session }, { data: messages }, tiers] = await Promise.all([
    supabase.from("chat_sessions").select("*").eq("id", id).maybeSingle(),
    supabase.from("chat_messages").select("id, created_at, role, content").eq("session_id", id).order("id"),
    getTiers(),
  ]);
  if (!session) notFound();
  const qualification = qualificationRows(session.qualification);

  return (
    <div>
      <Link href="/admin/conversaciones" className="text-sm text-muted hover:text-ink">
        Back to conversations
      </Link>
      <h1 className="mt-3 text-3xl font-semibold">Conversation from {formatDate(session.created_at)}</h1>
      <div className="mt-3">
        <OutcomeBadges labels={outcomeLabels(session, tiers)} />
      </div>

      <dl className="mt-6 grid gap-4 rounded-[var(--radius-panel)] border border-line bg-surface p-6 text-[15px] sm:grid-cols-3">
        <div>
          <dt className="text-sm text-muted">Messages</dt>
          <dd className="tabular mt-1">{session.message_count}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Landing page</dt>
          <dd className="mt-1 break-all">{session.landing_page || "Not given"}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Last activity</dt>
          <dd className="tabular mt-1">{formatDate(session.updated_at)}</dd>
        </div>
      </dl>

      <dl className="mt-4 grid gap-4 rounded-[var(--radius-panel)] border border-line bg-surface p-6 text-[15px] sm:grid-cols-4">
        <div>
          <dt className="text-sm text-muted">State</dt>
          <dd className="mt-1">{stateLabel(session.state)}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Intent</dt>
          <dd className="mt-1">{intentLabel(session.intent)}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Booking status</dt>
          <dd className="mt-1">{bookingStatusLabel(session.booking_status)}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Handoff status</dt>
          <dd className="mt-1">{handoffStatusLabel(session.handoff_status)}</dd>
        </div>
        {session.last_error_code ? (
          <div className="sm:col-span-4">
            <dt className="text-sm text-muted">Last error</dt>
            <dd className="mt-1">{session.last_error_code}</dd>
          </div>
        ) : null}
      </dl>

      {qualification.length ? (
        <dl className="mt-4 grid gap-4 rounded-[var(--radius-panel)] border border-line bg-surface p-6 text-[15px] sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium">What the visitor told Oryn</dt>
          </div>
          {qualification.map((row) => (
            <div key={row.label}>
              <dt className="text-sm text-muted">{row.label}</dt>
              <dd className="mt-1 break-words">{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <ol className="mt-8 space-y-4">
        {(messages ?? []).map((m) => (
          <li key={m.id} className={cn("flex flex-col gap-1", m.role === "user" ? "items-end" : "items-start")}>
            <span className="px-1 text-xs text-muted">
              {m.role === "user" ? "Visitor" : "Oryn"} · {formatDate(m.created_at)}
            </span>
            <p
              className={cn(
                "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed",
                m.role === "user" ? "rounded-br-md bg-accent text-accent-ink" : "rounded-bl-md border border-line bg-surface",
              )}
            >
              {m.content}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
