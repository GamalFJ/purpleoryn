import { whatsappUrl } from "@/lib/links";
import { SITE } from "@/lib/site";
import type { Qualification } from "@/lib/agent/qualification";

// Why the chat is sending the visitor to a person on WhatsApp.
export const HANDOFF_REASONS = ["asked_for_person", "unknown_fact", "released", "declined_call"] as const;
export type HandoffReason = (typeof HANDOFF_REASONS)[number];

export function isHandoffReason(value: unknown): value is HandoffReason {
  return typeof value === "string" && (HANDOFF_REASONS as readonly string[]).includes(value);
}

const OPENING: Record<HandoffReason, string> = {
  asked_for_person: "Hola Purple Cove Labs, vengo del chat de Oryn y prefiero hablar con una persona.",
  unknown_fact: "Hola Purple Cove Labs, vengo del chat de Oryn y tengo una pregunta que el asistente no pudo responder.",
  released: "Hola Purple Cove Labs, vengo del chat de Oryn y quiero seguir la conversación con una persona.",
  declined_call: "Hola Purple Cove Labs, vengo del chat de Oryn y prefiero conversar por WhatsApp en vez de una llamada.",
};

const MAX_LENGTH = 450;

// The message the visitor sends from WhatsApp, written in code from what is saved about them so
// the model can never put a link, number or invented detail into it. Only whitelisted business
// facts (the sanitizer already removed contact-like text); never contact details.
export function buildHandoffMessage(reason: HandoffReason, known: Qualification, planName: string | null): string {
  const lines = [OPENING[reason]];
  if (known.business_type) lines.push(`Negocio: ${known.business_type}.`);
  if (known.pain) lines.push(`Lo que no les funciona hoy: ${known.pain}.`);
  if (known.goal) lines.push(`Lo que busco: ${known.goal}.`);
  if (known.timing) lines.push(`Cuándo: ${known.timing}.`);
  if (planName) lines.push(`Plan que vimos: ${planName}.`);
  return lines.join(" ").slice(0, MAX_LENGTH);
}

export function buildHandoffUrl(reason: HandoffReason, known: Qualification, planName: string | null): { url: string; summary: string } {
  const summary = buildHandoffMessage(reason, known, planName);
  return { url: whatsappUrl(summary), summary };
}

// Pages and documents the agent may point to. The model passes only the key; the link comes from here.
export const AGENT_PAGES = {
  servicios: { label: "Ver planes y precios", href: "/servicios", newTab: false },
  como_trabajamos: { label: "Cómo trabajamos", href: "/como-trabajamos", newTab: false },
  pdf_oryn_presence: { label: "Documento: Oryn Presence (PDF)", href: "/docs/oryn-presence.pdf", newTab: true },
  pdf_como_trabajamos: { label: "Documento: Cómo trabajamos (PDF)", href: "/docs/como-trabajamos.pdf", newTab: true },
} as const;

export type AgentPageKey = keyof typeof AGENT_PAGES;
export const AGENT_PAGE_KEYS = Object.keys(AGENT_PAGES) as AgentPageKey[];

export function isAgentPage(value: unknown): value is AgentPageKey {
  return typeof value === "string" && (AGENT_PAGE_KEYS as readonly string[]).includes(value);
}

// Admin-facing alert text (English, like the rest of the admin). Plain text; sent through Telegram.
export function chatAlertText(kind: "handoff" | "call", sessionId: string, known: Qualification, planName: string | null, reason?: string): string {
  const lines = [
    kind === "handoff" ? "Oryn chat: a visitor was sent to WhatsApp" : "Oryn chat: a visitor was shown the call button",
    reason ? `Reason: ${reason}` : null,
    planName ? `Plan discussed: ${planName}` : null,
    known.business_type ? `Business: ${known.business_type}` : null,
    known.pain ? `Not working today: ${known.pain}` : null,
    known.goal ? `Goal: ${known.goal}` : null,
    known.timing ? `Timing: ${known.timing}` : null,
    "The visitor has not necessarily written or booked yet; check WhatsApp and Cal.com.",
    `${SITE.url}/admin/conversaciones/${sessionId}`,
  ];
  return lines.filter((l): l is string => l !== null).join("\n");
}
