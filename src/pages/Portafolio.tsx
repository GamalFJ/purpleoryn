import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FinalCTA from "@/components/sections/FinalCTA";
import {
  ArrowRight,
  Target,
  Wrench,
  TrendingUp,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";

// Vielma Group screenshots
import vielmaHero from "@/assets/vielma/vielma-group-hero-2026-05.png";
import vielmaServices from "@/assets/vielma/vielma-group-services-2026-05.png";
import vielmaBooking from "@/assets/vielma/vielma-group-booking-page-2026-05.png";
import vielmaContact from "@/assets/vielma/vielma-group-contact-2026-05.png";
import vielmaFooter from "@/assets/vielma/vielma-group-footer-2026-05.png";
import vielmaTestimonials from "@/assets/vielma/vielma-group-testimonials-2026-05.png";
import vielmaDashboardLogin from "@/assets/vielma/vielma-group-dashboard-login-2026-05.png";
import vielmaDashboardLeads from "@/assets/vielma/vielma-group-dashboard-lead-generation-2026-05.png";
import vielmaDashboardLeads2 from "@/assets/vielma/vielma-group-dashboard-lead-generation2-2026-05.png";
import vielmaDashboardResults from "@/assets/vielma/vielma-group-dashboard-lead-results1-2026-05.png";
import vielmaDashboardSearch from "@/assets/vielma/vielma-group-dashboard-search-2026-05.png";
import vielmaAirtable from "@/assets/vielma/vielma-group-airtable-database-2026-05.png";
import vielmaN8n from "@/assets/vielma/vielma-group-n8n-flow-2026-05.png";
import vielmaWhatsapp from "@/assets/vielma/vielma-group-whatsapp-notification-2026-05.png";

interface Screenshot {
  src: string;
  alt: string;
  caption: string;
}

type SolutionItem = string | { title: string; description: string };

interface Case {
  name: string;
  sector: string;
  problem: string;
  solution: SolutionItem[];
  result: {
    headline: string;
    metrics: Array<{ v: string; l: string }>;
  };
  screenshots: Screenshot[];
  videoPlaceholder?: boolean;
}

const vielmaScreenshots: Screenshot[] = [
  { src: vielmaHero,             alt: "Página principal del sitio web de Vielma Group",               caption: "Página Principal" },
  { src: vielmaServices,         alt: "Sección de servicios contables de Vielma Group",               caption: "Servicios" },
  { src: vielmaBooking,          alt: "Sistema de reservas online de Vielma Group",                   caption: "Sistema de Citas" },
  { src: vielmaContact,          alt: "Página de contacto de Vielma Group",                           caption: "Contacto" },
  { src: vielmaTestimonials,     alt: "Sección de testimonios de clientes de Vielma Group",           caption: "Testimonios" },
  { src: vielmaFooter,           alt: "Footer del sitio web de Vielma Group",                         caption: "Footer" },
  { src: vielmaDashboardLogin,   alt: "Pantalla de acceso al dashboard de prospección",               caption: "Acceso al Dashboard" },
  { src: vielmaDashboardLeads,   alt: "Dashboard de generación de prospectos — vista principal",      caption: "Generación de Prospectos" },
  { src: vielmaDashboardLeads2,  alt: "Dashboard de generación de prospectos — búsqueda avanzada",   caption: "Búsqueda de Prospectos" },
  { src: vielmaDashboardSearch,  alt: "Filtros de búsqueda del dashboard de prospección",             caption: "Filtros de Búsqueda" },
  { src: vielmaDashboardResults, alt: "Resultados del dashboard de prospección con datos de leads",   caption: "Resultados" },
  { src: vielmaAirtable,         alt: "Base de datos de clientes en Airtable",                        caption: "Base de Datos — Airtable" },
  { src: vielmaN8n,              alt: "Flujo de automatización en n8n para el sistema de citas",     caption: "Flujo de Automatización" },
  { src: vielmaWhatsapp,         alt: "Notificación de confirmación de cita por WhatsApp",           caption: "Notificación WhatsApp" },
];

const cases: Case[] = [
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
    screenshots: [],
  },
  {
    name: "Vielma Group",
    sector: "Contabilidad & Servicios Financieros",
    problem:
      "Sin presencia digital profesional, sin sistema de citas y sin visibilidad sobre qué prospectos priorizar — todo el seguimiento era manual y en hojas de cálculo.",
    solution: [
      {
        title: "Presencia web profesional",
        description:
          "Sitio web a medida que refleja la credibilidad y el nivel de la firma, diseñado para convertir visitantes en consultas.",
      },
      {
        title: "Visibilidad en Google",
        description:
          "Configuración completa de visibilidad local: perfil de Google Business, etiquetas estructuradas y metadatos optimizados para que clientes potenciales los encuentren primero.",
      },
      {
        title: "Sistema de citas inteligente",
        description:
          "Página de reservas online conectada a una base de datos que captura automáticamente la información de cada cliente — sin formularios manuales, sin seguimiento en hojas de cálculo.",
      },
      {
        title: "Dashboard de prospección",
        description:
          "Aplicación interna a medida que identifica y prioriza prospectos de alto valor, para que el equipo sepa siempre a quién llamar primero.",
      },
    ],
    result: {
      headline: "Presencia y prospección automatizadas",
      metrics: [
        { v: "100%", l: "Citas capturadas online" },
        { v: "1er", l: "Resultado local en Google" },
        { v: "+3x", l: "Prospectos identificados" },
      ],
    },
    screenshots: vielmaScreenshots,
    videoPlaceholder: true,
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
    screenshots: [],
  },
];

const Portafolio = () => {
  const [lightboxImages, setLightboxImages] = useState<Screenshot[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (images: Screenshot[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
  };

  const closeLightbox = () => setLightboxIndex(null);

  const goToPrevious = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        lightboxIndex === 0 ? lightboxImages.length - 1 : lightboxIndex - 1
      );
    }
  };

  const goToNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        lightboxIndex === lightboxImages.length - 1 ? 0 : lightboxIndex + 1
      );
    }
  };

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
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6 pb-5 border-b border-border/30">
                  <div>
                    <div className="text-[10px] font-bold tracking-widest uppercase text-primary mb-1">
                      {c.sector}
                    </div>
                    <h2 className="font-extrabold">{c.name}</h2>
                  </div>
                </div>

                {/* Problem / Solution / Result */}
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
                      {c.solution.map((s, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-foreground/85 leading-snug"
                        >
                          <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0 mt-1" />
                          {typeof s === "string" ? (
                            <span>{s}</span>
                          ) : (
                            <span>
                              <strong className="text-foreground">{s.title}</strong>
                              {" — "}
                              <span className="text-foreground/70">{s.description}</span>
                            </span>
                          )}
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
                        <div
                          key={m.l}
                          className="rounded-lg bg-glass-bg/40 border border-border/40 p-2 text-center"
                        >
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

                {/* Screenshot Gallery */}
                {c.screenshots.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-border/30">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-4">
                      Capturas del Proyecto
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {c.screenshots.map((shot, idx) => (
                        <div
                          key={idx}
                          className="relative group cursor-pointer rounded-xl overflow-hidden aspect-video shadow-md border border-border/30"
                          onClick={() => openLightbox(c.screenshots, idx)}
                        >
                          <img
                            src={shot.src}
                            alt={shot.alt}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <ZoomIn className="w-5 h-5 text-foreground" />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm px-3 py-1.5 text-xs text-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {shot.caption}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video Placeholder */}
                {c.videoPlaceholder && (
                  <div className="mt-6 pt-6 border-t border-border/30">
                    {/* <!-- REPLACE href="#" WITH LOOM URL WHEN READY --> */}
                    {/*
                      iframe-ready: to go live, replace the placeholder block below with:
                      <iframe
                        src="https://www.loom.com/embed/YOUR_VIDEO_ID"
                        title="Demo en video — Vielma Group"
                        className="w-full aspect-video rounded-xl border border-primary/20"
                        allowFullScreen
                        allow="autoplay"
                      />
                    */}
                    <div className="relative w-full max-w-2xl mx-auto aspect-video rounded-xl overflow-hidden border border-primary/25 shadow-lg bg-[#0c0c14] flex flex-col items-center justify-center gap-3">
                      {/* Purple radial glow */}
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)/0.15)_0%,_transparent_70%)] pointer-events-none" />
                      {/* Play button */}
                      <div className="relative w-16 h-16 rounded-full border-2 border-primary bg-primary/20 flex items-center justify-center">
                        <Play className="w-7 h-7 text-primary fill-primary ml-1" />
                      </div>
                      <p className="relative text-sm font-semibold text-foreground">
                        Demo en video — Vielma Group
                      </p>
                      {/* REPLACE href="#" WITH LOOM URL WHEN READY */}
                      <a
                        href="#"
                        className="relative text-xs font-medium text-primary hover:underline underline-offset-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver demo en Loom →
                      </a>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />

      {/* Lightbox */}
      <Dialog open={lightboxIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-background/95 backdrop-blur-xl border-glass-border">
          <DialogClose className="absolute right-2 sm:right-4 top-2 sm:top-4 z-50 rounded-full p-2 bg-background/80 hover:bg-background border border-glass-border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
            <X className="h-5 w-5" />
            <span className="sr-only">Cerrar</span>
          </DialogClose>

          {lightboxIndex !== null && (
            <div className="relative flex items-center justify-center p-2 sm:p-4">
              {/* Prev */}
              <button
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                className="absolute left-2 sm:left-4 z-50 p-2 rounded-full bg-background/80 hover:bg-background border border-glass-border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Next */}
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-10 sm:right-14 z-50 p-2 rounded-full bg-background/80 hover:bg-background border border-glass-border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Image */}
              <div className="flex flex-col items-center max-w-4xl px-10 sm:px-16">
                <img
                  src={lightboxImages[lightboxIndex].src}
                  alt={lightboxImages[lightboxIndex].alt}
                  className="max-w-full max-h-[70vh] sm:max-h-[75vh] object-contain rounded-lg"
                />
                {lightboxImages[lightboxIndex].caption && (
                  <p className="text-foreground font-medium mt-3 sm:mt-4 text-center text-sm sm:text-base">
                    {lightboxImages[lightboxIndex].caption}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  {lightboxIndex + 1} / {lightboxImages.length}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Portafolio;
