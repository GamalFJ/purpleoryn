import Image from "next/image";
import { CalendarCheck, ChatCircleText, Robot } from "@phosphor-icons/react/dist/ssr";
import { IconTile } from "@/components/ui/IconTile";
import { cn } from "@/lib/cn";
import type { Tone } from "@/lib/tone";
import { WhatsAppMock } from "./WhatsAppMock";

const STEPS: { title: string; text: string; icon: typeof Robot; tone: Tone }[] = [
  { title: "Un cliente escribe", text: "Pregunta desde tu sitio web, a cualquier hora.", icon: ChatCircleText, tone: "teal" },
  {
    title: "El Agente de IA responde al instante",
    text: "Contesta sus dudas, le hace las preguntas clave y te lo pasa por WhatsApp con todo organizado.",
    icon: Robot,
    tone: "violet",
  },
  { title: "Se agenda o se convierte en venta", text: "Tú confirmas la cita o cierras la venta con la información en la mano.", icon: CalendarCheck, tone: "amber" },
];

// Official logos from svgl (github.com/pheralb/svgl). "Trabajamos con" covers
// both what the plans connect to and what the studio builds with (Claude).
// Logos: svgl (WhatsApp, Maps, Calendar, Analytics, Claude) and
// gilbarbara/logos (Tag Manager, Search Console).
const TOOLS = [
  { name: "WhatsApp", src: "/media/logos/whatsapp.svg" },
  { name: "Google Maps", src: "/media/logos/google-maps.svg" },
  { name: "Google Calendar", src: "/media/logos/google-calendar.svg" },
  { name: "Google Analytics", src: "/media/logos/google-analytics.svg" },
  { name: "Google Tag Manager", src: "/media/logos/google-tag-manager.svg" },
  { name: "Google Search Console", src: "/media/logos/google-search-console.svg" },
  { name: "Claude", src: "/media/logos/claude.svg" },
];

// Solución: one system (site + agent), shown as a three-step flow and the
// handoff as it lands on the business's WhatsApp.
export function Solution() {
  return (
    <section aria-labelledby="solucion-titulo" className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
      <div className="max-w-2xl">
        <h2 id="solucion-titulo" className="text-3xl font-semibold leading-tight sm:text-4xl">
          Oryn Presence: un solo sistema que no deja enfriar a ningún cliente
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-body">
          Un sitio que aparece cuando te buscan y un Agente de IA que atiende a cada cliente en el momento.
        </p>
      </div>

      <ol className="mt-12 grid gap-0 md:grid-cols-3 md:gap-6">
        {STEPS.map((step, i) => {
          const last = i === STEPS.length - 1;
          return (
            <li
              key={step.title}
              className={cn(
                "group relative flex gap-4 pb-8 md:flex-col md:pb-0",
                // Gradient connector: vertical on mobile, horizontal on desktop.
                !last &&
                  "before:absolute before:bottom-1 before:left-6 before:top-15 before:w-0.5 before:rounded-full before:bg-linear-to-b before:from-accent/50 before:to-fuchsia/10 md:before:hidden md:after:absolute md:after:left-17 md:after:right-2 md:after:top-6 md:after:h-0.5 md:after:rounded-full md:after:bg-linear-to-r md:after:from-accent/50 md:after:to-fuchsia/10",
              )}
            >
              <span className="relative z-10 shrink-0 self-start">
                <IconTile icon={step.icon} tone={step.tone} />
                <span className="tabular absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br from-accent to-fuchsia text-[11px] font-semibold text-accent-ink ring-2 ring-paper">
                  {i + 1}
                </span>
              </span>
              <div className="md:pr-6">
                <h3 className="text-lg font-semibold leading-snug">{step.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-body">{step.text}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-14 grid items-center gap-12 md:grid-cols-[1fr_1fr] md:gap-16">
        <WhatsAppMock />
        <div>
          <h3 className="text-2xl font-semibold leading-tight sm:text-[1.75rem]">Así te llega cada cliente</h3>
          <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-body">
            Aunque te escriban de noche, el asistente los atiende en tu sitio y te los pasa por WhatsApp con el servicio, la fecha que prefieren y
            la zona. Tú solo confirmas.
          </p>
          <p className="mt-8 text-sm font-semibold text-ink">Trabajamos con</p>
          <ul className="mt-3 flex flex-wrap gap-3">
            {TOOLS.map((tool) => (
              <li
                key={tool.name}
                className="flex items-center gap-2.5 rounded-full border border-line bg-surface py-1.5 pl-1.5 pr-4 text-sm font-medium text-ink shadow-[0_6px_16px_-12px_rgb(28_16_48/0.5)] transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-accent/40 motion-reduce:transition-none"
              >
                {/* White tile keeps single-color logos visible in dark mode. */}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white ring-1 ring-black/5">
                  <Image src={tool.src} alt="" width={20} height={20} className="h-5 w-5 object-contain" />
                </span>
                {tool.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
