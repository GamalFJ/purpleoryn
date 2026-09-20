import {
  CheckCircle,
  CreditCard,
  Eye,
  FileText,
  Hammer,
  Microphone,
  MonitorPlay,
  RocketLaunch,
  type Icon,
} from "@phosphor-icons/react";
import type { Tone } from "@/lib/tone";

// The seven steps, the optional-modules branch and the road geometry they sit
// on. Source of truth for the copy is the client document "Cómo Trabajamos"
// (brand/docs/como-trabajamos): titles and step copy are kept word for word
// with that document, because it and the site have to describe the same
// process. The document is written in usted; here it is tú, like the rest of
// the site.

export interface Waypoint {
  id: string;
  /** "01".."07", or null for the optional branch, which is not a step. */
  number: string | null;
  title: string;
  /** Shown on the road at rest. */
  short: string;
  /** Revealed on hover (desktop) or tap (touch). */
  detail: string;
  icon: Icon;
  tone: Tone;
}

export const STEPS: Waypoint[] = [
  {
    id: "presentacion",
    number: "01",
    title: "Presentación",
    short: "Presentación",
    detail:
      "Te mostramos el sistema en vivo, te enviamos el documento de Oryn Presence, o coordinamos un diagnóstico gratis.",
    icon: MonitorPlay,
    tone: "teal",
  },
  {
    id: "eleccion-del-plan",
    number: "02",
    title: "Elección del Plan",
    short: "Tu plan",
    detail: "Eliges tu plan (y módulo adicional, si deseas) y envías el formulario en purpleoryn.com.",
    icon: FileText,
    tone: "teal",
  },
  {
    id: "confirmacion",
    number: "03",
    title: "Confirmación",
    short: "Confirmación",
    detail: "Confirmamos tu pedido y te enviamos el formulario de configuración de tu plan.",
    icon: CheckCircle,
    tone: "amber",
  },
  {
    id: "primer-pago",
    number: "04",
    title: "Primer Pago",
    short: "Primer pago",
    detail:
      "Pagas el 50% del plan (el módulo adicional se paga 100% aquí) y nos devuelves el formulario completo.",
    icon: CreditCard,
    tone: "amber",
  },
  {
    id: "inicio-y-construccion",
    number: "05",
    title: "Inicio y Construcción",
    short: "Construcción",
    detail: "Arrancamos oficialmente y construimos tu sistema.",
    icon: Hammer,
    tone: "violet",
  },
  {
    id: "revision",
    number: "06",
    title: "Revisión",
    short: "Revisión",
    detail: "Una ronda de ajustes estéticos, luego tu aprobación.",
    icon: Eye,
    tone: "violet",
  },
  {
    id: "entrega",
    number: "07",
    title: "Entrega",
    short: "Entrega",
    detail: "Pagas el final (50% del plan) y tu sistema sale en vivo.",
    icon: RocketLaunch,
    tone: "rose",
  },
];

// Written so a second module can join the offer without restructuring the road
// or this copy, the same way the client document is written.
export const BRANCH: Waypoint = {
  id: "modulos-opcionales",
  number: null,
  title: "Módulos opcionales",
  short: "Módulos opcionales",
  detail:
    "Se agregan a cualquier plan, cuando quieras. Se pagan 100% por adelantado, sin el 50/50 del plan base. Misma regla para cualquier módulo futuro.",
  icon: Microphone,
  tone: "amber",
};

export const WAYPOINTS: Waypoint[] = [...STEPS, BRANCH];

/**
 * A road drawn in its own coordinate space. `branch` is a second path drawn
 * with the same mask system; pass `""` when a figure has no side road (the
 * grid page's measured connector has no branch, since the branch card there
 * is a distinct, unconnected element, not a road you travel).
 */
export interface Road {
  width: number;
  height: number;
  path: string;
  branch: string;
  /** Node centres in road coordinates, in WAYPOINTS order. Unused by the
   *  measured grid, which positions its cards with normal layout instead. */
  nodes: { x: number; y: number; side: "left" | "right" }[];
}

// Homepage teaser: the same journey read left to right, small enough to sit
// between two sections without becoming a second copy of the page.
export const ROAD_TEASER: Road = {
  width: 1000,
  height: 360,
  path: [
    "M 60 210",
    "C 125 210, 125 130, 190 130",
    "C 255 130, 255 210, 320 210",
    "C 385 210, 385 130, 450 130",
    "C 515 130, 515 210, 580 210",
    "C 645 210, 645 130, 710 130",
    "C 775 130, 775 170, 830 170",
  ].join(" "),
  branch: "M 775 150 C 830 200, 890 250, 930 300",
  nodes: [
    { x: 60, y: 210, side: "right" },
    { x: 190, y: 130, side: "left" },
    { x: 320, y: 210, side: "right" },
    { x: 450, y: 130, side: "left" },
    { x: 580, y: 210, side: "right" },
    { x: 710, y: 130, side: "left" },
    { x: 830, y: 170, side: "right" },
    { x: 930, y: 300, side: "left" },
  ],
};
