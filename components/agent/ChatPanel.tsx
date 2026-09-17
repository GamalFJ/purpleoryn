"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, CalendarBlank, X } from "@phosphor-icons/react";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { buttonClass } from "@/components/ui/button";
import type { AgentAction } from "@/lib/agent/tools";
import { track } from "@/lib/analytics";
import { formatRD, salesLabel } from "@/lib/format";
import { calUrl } from "@/lib/links";
import { CTA } from "@/lib/site";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  actions?: AgentAction[];
}

const STORAGE_KEY = "pcl_chat";
const GREETING: ChatMessage = {
  role: "assistant",
  content: "Hola, soy Oryn. Te ayudo a ver qué plan le conviene a tu negocio o a agendar una llamada gratis. ¿Qué tipo de negocio tienes?",
};
const STARTERS = ["¿Qué plan me conviene?", "¿Cuánto cuestan los planes?", "Quiero agendar una llamada"];

function loadState(): { sessionId: string; messages: ChatMessage[] } {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { sessionId: crypto.randomUUID(), messages: [GREETING] };
}

function ActionBlock({ action }: { action: AgentAction }) {
  if (action.type === "roi") {
    return (
      <dl className="grid grid-cols-2 gap-3 rounded-[var(--radius-field)] border border-warm-line bg-warm-soft p-3 text-sm">
        <div className="col-span-2">
          <dt className="font-semibold text-ink">Método Oryn ROI</dt>
          <dd className="text-muted">
            {action.planName}, venta promedio de {formatRD(action.averageSaleValue)}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Inversión primer año</dt>
          <dd className="tabular font-semibold text-warm-ink">{formatRD(action.yearOneInvestment)}</dd>
        </div>
        <div>
          <dt className="text-muted">Ventas para recuperarla</dt>
          <dd className="tabular font-semibold">{action.breakEvenSales}</dd>
        </div>
        <div>
          <dt className="text-muted">Meta 3x al año</dt>
          <dd className="tabular font-semibold">{salesLabel(action.targetSalesPerYear)}</dd>
        </div>
        <div>
          <dt className="text-muted">Meta 3x al mes</dt>
          <dd className="tabular font-semibold">{salesLabel(action.targetSalesPerMonth)}</dd>
        </div>
      </dl>
    );
  }
  if (action.type === "recommend_plan") {
    return (
      <Link
        href={`/servicios?plan=${action.plan}#elegir-plan`}
        onClick={() => track("tier_selected", { plan: action.plan, selection_source: "chat_agent" })}
        className={buttonClass("primary", "sm", "w-full")}
      >
        Elegir {action.planName}
      </Link>
    );
  }
  return (
    <TrackedLink
      href={calUrl(action.plan && action.planName ? { slug: action.plan, name: action.planName } : null, action.summary)}
      event="cal_click"
      location="chat_agent"
      plan={action.plan ?? undefined}
      className={buttonClass("primary", "sm", "w-full")}
    >
      <CalendarBlank size={16} weight="bold" />
      {CTA.call}
    </TrackedLink>
  );
}

export function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [state, setState] = useState(loadState);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [state]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function send(text: string) {
    const content = text.trim().slice(0, 1200);
    if (!content || sending) return;
    const history = [...state.messages, { role: "user" as const, content }];
    setState((s) => ({ ...s, messages: history }));
    setInput("");
    setSending(true);

    let reply: ChatMessage;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: state.sessionId,
          landingPage: window.location.pathname,
          // The static greeting isn't part of the model conversation.
          messages: history.slice(1).map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = (await res.json()) as { reply?: string; actions?: AgentAction[] };
      reply = { role: "assistant", content: data.reply || "No pude responder. Intenta de nuevo.", actions: data.actions };
    } catch {
      reply = { role: "assistant", content: "Se perdió la conexión. Intenta de nuevo en un momento." };
    }
    setState((s) => ({ ...s, messages: [...s.messages, reply] }));
    setSending(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-label="Asistente Oryn"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col bg-surface sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(640px,calc(100dvh-3rem))] sm:w-[400px] sm:rounded-[var(--radius-panel)] sm:border sm:border-line sm:shadow-[0_24px_60px_-20px_rgb(28_16_48/0.5)]"
        >
          <header className="flex items-center gap-3 border-b border-line px-4 py-3">
            <Image src="/media/oryn.webp" alt="" width={36} height={36} className="h-9 w-9 rounded-full" />
            <div className="min-w-0 flex-1">
              <p className="font-display font-semibold leading-tight">Oryn</p>
              <p className="text-xs text-muted">Asistente de IA de Purple Cove Labs. Puede equivocarse.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar asistente"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-accent-soft hover:text-ink"
            >
              <X size={20} weight="bold" />
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5" aria-live="polite">
            {state.messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "space-y-2.5"}>
                <p
                  className={
                    m.role === "user"
                      ? "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-linear-to-br from-accent to-fuchsia px-4 py-2.5 text-[15px] text-accent-ink"
                      : "max-w-[92%] whitespace-pre-wrap rounded-2xl rounded-bl-md bg-paper px-4 py-2.5 text-[15px] leading-relaxed"
                  }
                >
                  {m.content}
                </p>
                {m.actions?.map((a, j) => (
                  <div key={j} className="max-w-[92%]">
                    <ActionBlock action={a} />
                  </div>
                ))}
              </div>
            ))}
            {sending && <p className="w-fit rounded-2xl bg-paper px-4 py-2.5 text-[15px] text-muted">Escribiendo...</p>}
            {state.messages.length === 1 && !sending && (
              <div className="flex flex-wrap gap-2 pt-1">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="cursor-pointer rounded-full border border-line px-3.5 py-2 text-sm hover:border-accent hover:text-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="border-t border-line p-3"
          >
            <div className="flex items-end gap-2">
              <label htmlFor="chat-input" className="sr-only">
                Escribe tu mensaje
              </label>
              <textarea
                id="chat-input"
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={1200}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send(input);
                  }
                }}
                placeholder="Escribe aquí..."
                className="max-h-32 min-h-11 flex-1 resize-none rounded-[var(--radius-field)] border border-line bg-paper px-3.5 py-2.5 text-base outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                aria-label="Enviar"
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-linear-to-br from-accent to-fuchsia text-accent-ink disabled:opacity-50"
              >
                <ArrowUp size={20} weight="bold" />
              </button>
            </div>
            <p className="mt-2 px-1 text-[11px] text-muted">
              Guardamos esta conversación para mejorar el servicio.{" "}
              <Link href="/privacidad" className="underline">
                Privacidad
              </Link>
            </p>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
