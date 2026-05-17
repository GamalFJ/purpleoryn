import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import FinalCTA from "@/components/sections/FinalCTA";
import BookingButton from "@/components/BookingButton";

const niches = [
  {
    id: "contabilidad",
    label: "Contabilidad",
    emoji: "📊",
    desc: "Automatización de facturación, conciliación y reportes financieros para despachos contables.",
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
    icon: "border-blue-500/30 bg-blue-500/10",
    iconText: "text-blue-400",
  },
  {
    id: "dental",
    label: "Dental",
    emoji: "🦷",
    desc: "Gestión de citas, recordatorios automáticos y seguimiento de pacientes para clínicas dentales.",
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/30",
    icon: "border-emerald-500/30 bg-emerald-500/10",
    iconText: "text-emerald-400",
  },
  {
    id: "veterinaria",
    label: "Veterinaria",
    emoji: "🐾",
    desc: "Control de pacientes, vacunas y citas para clínicas veterinarias y pet shops.",
    color: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/30",
    icon: "border-amber-500/30 bg-amber-500/10",
    iconText: "text-amber-400",
  },
  {
    id: "construccion",
    label: "Construcción",
    emoji: "🏗️",
    desc: "Seguimiento de proyectos, presupuestos y coordinación de contratistas para constructoras.",
    color: "from-violet-500/20 to-purple-500/20",
    border: "border-violet-500/30",
    icon: "border-violet-500/30 bg-violet-500/10",
    iconText: "text-violet-400",
  },
];

const Demos = () => {
  const [activeNiche, setActiveNiche] = useState<string | null>(null);

  const selected = niches.find((n) => n.id === activeNiche);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background relative w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="relative z-10 pt-24 sm:pt-28">
        {/* Hero */}
        <section className="py-10 sm:py-16 px-4 sm:px-6 text-center">
          <div className="container mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-5">
              Biblioteca de Demos
            </div>
            <h1 className="font-extrabold mb-4">
              Ve el sistema en{" "}
              <span className="gradient-text">acción en tu industria</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Selecciona tu nicho y explora cómo funciona el sistema de
              automatización aplicado a tu tipo de negocio.
            </p>
          </div>
        </section>

        {/* Niche cards */}
        <section className="py-4 sm:py-6 px-4 sm:px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {niches.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setActiveNiche(activeNiche === n.id ? null : n.id)}
                  className={`glass-card p-5 sm:p-6 text-left transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
                    activeNiche === n.id
                      ? `${n.border} shadow-[0_0_40px_-10px_hsl(var(--primary)/0.4)]`
                      : "hover:border-primary/30"
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${n.color} border ${n.icon} flex items-center justify-center mb-4 text-2xl`}
                  >
                    {n.emoji}
                  </div>
                  <h3 className="font-bold text-foreground text-base mb-2">
                    {n.label}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    {n.desc}
                  </p>
                  <div
                    className={`flex items-center gap-1.5 text-xs font-semibold ${
                      activeNiche === n.id ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    {activeNiche === n.id ? "Cerrando demo" : "Ver demo"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Demo iframe */}
        {selected && (
          <section className="py-6 sm:py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-5xl">
              <div className="glass-card p-4 sm:p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{selected.emoji}</span>
                    <div>
                      <h2 className="font-bold text-foreground text-base">
                        Demo: {selected.label}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        demos.purpleoryn.com/{selected.id}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`https://demos.purpleoryn.com/${selected.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-accent transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Abrir en nueva pestaña
                  </a>
                </div>

                <div className="rounded-xl overflow-hidden border border-border/40 bg-glass-bg/20">
                  <iframe
                    src={`https://demos.purpleoryn.com/${selected.id}`}
                    title={`Demo ${selected.label}`}
                    className="w-full"
                    style={{ height: "600px" }}
                    loading="lazy"
                  />
                </div>

                <div className="mt-5 text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    ¿Quieres algo así para tu negocio?
                  </p>
                  <BookingButton
                    ariaLabel="Agendar llamada sobre automatización"
                    className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 min-h-[48px] text-sm font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent hover:scale-[1.02] shadow-[0_0_25px_-5px_hsl(var(--primary)/0.5)] transition-all duration-300 cursor-pointer"
                  >
                    Agendar llamada estratégica — Gratis
                  </BookingButton>
                </div>
              </div>
            </div>
          </section>
        )}

        <FinalCTA />
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default Demos;
