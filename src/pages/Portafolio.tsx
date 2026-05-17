import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import FinalCTA from "@/components/sections/FinalCTA";
import { ArrowRight, Target, Wrench, TrendingUp } from "lucide-react";

const cases = [
  {
    name: "ArKyTeK",
    sector: "Estudio de Arquitectura",
    problem:
      "Onboarding manual de clientes: formularios dispersos, citas perdidas y carpetas desorganizadas.",
    solution: [
      "Flujos de automatización n8n para procesar formularios",
      "Airtable como CRM central de proyectos",
      "Integración con Cal.com para agendar consultas",
      "Notificaciones automáticas y confirmaciones",
    ],
    result: {
      headline: "Onboarding 100% automatizado",
      metrics: [
        { v: "0h", l: "Tiempo manual / cliente nuevo" },
        { v: "100%", l: "Tasa de respuesta < 5 min" },
        { v: "+3x", l: "Capacidad de proyectos" },
      ],
    },
    screenshots: [] as string[],
  },
  {
    name: "Vielma Group",
    sector: "Constructora & Bienes Raíces",
    problem:
      "Seguimiento manual de prospectos, pérdida de leads por tiempos de respuesta lentos y falta de visibilidad en el pipeline de ventas.",
    solution: [
      "CRM en Airtable con pipeline de ventas visual",
      "Agente IA en WhatsApp para calificación inicial de prospectos",
      "Automatización de seguimientos y recordatorios",
      "Dashboard de métricas de ventas en tiempo real",
    ],
    result: {
      headline: "Pipeline de ventas automatizado",
      metrics: [
        { v: "+55%", l: "Tasa de conversión" },
        { v: "< 2 min", l: "Tiempo de respuesta inicial" },
        { v: "100%", l: "Visibilidad del pipeline" },
      ],
    },
    screenshots: [
      // Populate when ready: "/cases/vielma-group/screenshot-1.png"
    ] as string[],
  },
  {
    name: "Servicio Profesional",
    sector: "Consultoría",
    problem:
      "Pérdida de leads por respuestas tardías fuera de horario y falta de calificación previa.",
    solution: [
      "Agente IA conversacional en WhatsApp",
      "Calificación automática y enrutamiento",
      "Sincronización directa con CRM",
      "Reportes semanales de performance",
    ],
    result: {
      headline: "Leads calificados 24/7",
      metrics: [
        { v: "+40%", l: "Leads calificados / mes" },
        { v: "24/7", l: "Disponibilidad" },
        { v: "< 30s", l: "Tiempo de respuesta" },
      ],
    },
    screenshots: [] as string[],
  },
];

const Portafolio = () => {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-background relative w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="relative z-10 pt-24 sm:pt-28">
        <section className="py-10 sm:py-16 px-4 sm:px-6 text-center">
          <div className="container mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-5">
              Casos de Éxito
            </div>
            <h1 className="font-extrabold mb-4">
              Sistemas que <span className="gradient-text">funcionan</span> en negocios reales.
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Cada caso comienza con un problema real. Aquí está el sistema que
              construimos y los resultados medibles que obtuvimos.
            </p>
          </div>
        </section>

        <section className="py-8 sm:py-12 px-4 sm:px-6">
          <div className="container mx-auto max-w-5xl space-y-6 sm:space-y-8">
            {cases.map((c) => (
              <article
                key={c.name}
                className="glass-card p-6 sm:p-8 lg:p-10 hover:border-primary/40 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6 pb-5 border-b border-border/30">
                  <div>
                    <div className="text-[10px] font-bold tracking-widest uppercase text-primary mb-1">
                      {c.sector}
                    </div>
                    <h2 className="font-extrabold">{c.name}</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
                  {/* Problem */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-destructive/15 border border-destructive/30 flex items-center justify-center">
                        <Target className="w-4 h-4 text-destructive" />
                      </div>
                      <h3 className="font-bold text-foreground text-base">Problema</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {c.problem}
                    </p>
                  </div>

                  {/* Solution */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                        <Wrench className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="font-bold text-foreground text-base">Solución</h3>
                    </div>
                    <ul className="space-y-2">
                      {c.solution.map((s) => (
                        <li key={s} className="flex items-start gap-2 text-sm text-foreground/85 leading-snug">
                          <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0 mt-1" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Result */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-success-green/15 border border-success-green/30 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-success-green" />
                      </div>
                      <h3 className="font-bold text-foreground text-base">Resultado</h3>
                    </div>
                    <p className="text-sm font-semibold text-foreground mb-3">
                      {c.result.headline}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {c.result.metrics.map((m) => (
                        <div key={m.l} className="rounded-lg bg-glass-bg/40 border border-border/40 p-2 text-center">
                          <div className="text-base font-extrabold gradient-text">
                            {m.v}
                          </div>
                          <div className="text-[9px] text-muted-foreground leading-tight mt-0.5">
                            {m.l}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default Portafolio;
