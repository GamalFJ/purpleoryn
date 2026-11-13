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
// process. The document and the site are both written in usted.

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
      "Le mostramos el sistema en vivo, le enviamos el documento de Oryn Presence, o coordinamos una asesoría para evaluar si su negocio califica.",
    icon: MonitorPlay,
    tone: "teal",
  },
  {
    id: "eleccion-del-plan",
    number: "02",
    title: "Evaluación y Plan",
    short: "Su plan",
    detail: "Revisamos sus necesidades, definimos el alcance ideal y evaluamos si su negocio califica para el sistema.",
    icon: FileText,
    tone: "teal",
  },
  {
    id: "confirmacion",
    number: "03",
    title: "Confirmación",
    short: "Confirmación",
    detail: "Confirmamos su asesoría y le enviamos el formulario de configuración de su plan.",
    icon: CheckCircle,
    tone: "amber",
  },
  {
    id: "primer-pago",
    number: "04",
    title: "Inicio y Configuración",
    short: "Inicio",
    detail:
      "Aprobación formal del proyecto y entrega del formulario de configuración completado.",
    icon: CreditCard,
    tone: "amber",
  },
  {
    id: "inicio-y-construccion",
    number: "05",
    title: "Inicio y Construcción",
    short: "Construcción",
    detail: "Arrancamos oficialmente y construimos su sistema.",
    icon: Hammer,
    tone: "violet",
  },
  {
    id: "revision",
    number: "06",
    title: "Revisión",
    short: "Revisión",
    detail: "Una ronda de ajustes estéticos, luego su aprobación.",
    icon: Eye,
    tone: "violet",
  },
  {
    id: "entrega",
    number: "07",
    title: "Entrega",
    short: "Entrega",
    detail: "Su sistema sale en vivo y comienza a captar y calificar clientes.",
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
    "Se agregan a cualquier plan para expandir las capacidades de su presencia y automatización según lo requiera su negocio.",
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
