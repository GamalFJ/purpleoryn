import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import FinalCTA from "@/components/sections/FinalCTA";
import { Sparkles, ArrowRight, BarChart2, Search, Users, TrendingUp } from "lucide-react";
import BookingButton from "@/components/BookingButton";

const features = [
  {
    icon: Search,
    title: "Búsqueda inteligente de prospectos",
    desc: "Identifica prospectos de alto valor en tu mercado usando datos en tiempo real.",
  },
  {
    icon: Users,
    title: "Enriquecimiento de contactos",
    desc: "Completa automáticamente información de contacto, empresa y cargo para cada prospecto.",
  },
  {
    icon: TrendingUp,
    title: "Scoring y priorización",
    desc: "Clasifica automáticamente los mejores prospectos para que tu equipo enfoque su energía.",
  },
  {
    icon: BarChart2,
    title: "Dashboard de métricas",
    desc: "Visualiza el pipeline, tasas de conversión y rendimiento del equipo en un solo lugar.",
  },
];

const Apps = () => {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-background relative w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="relative z-10 pt-24 sm:pt-28">
        <section className="py-10 sm:py-16 px-4 sm:px-6 text-center">
          <div className="container mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-5">
              Productos & Apps
            </div>
            <h1 className="font-extrabold mb-4">
              Herramientas que <span className="gradient-text">construimos</span>{" "}
              para escalar negocios.
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Productos propios diseñados para implementarse en días, no meses —
              y generar resultados desde la primera semana.
            </p>
          </div>
        </section>

        {/* Prospect Intelligence Dashboard */}
        <section className="py-8 sm:py-12 px-4 sm:px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="glass-card p-4 sm:p-8 lg:p-12 relative overflow-hidden hover:border-primary/40 transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />

              <div className="flex flex-col lg:flex-row lg:items-start gap-8 min-w-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 sm:gap-4 mb-6 min-w-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center">
                      <BarChart2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className="font-extrabold text-lg sm:text-xl text-foreground break-words">
                          Prospect Intelligence Dashboard
                        </h2>
                        <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full bg-success-green/15 text-success-green border border-success-green/30 whitespace-nowrap">
                          Disponible
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
                        <Sparkles className="w-3 h-3 text-primary shrink-0" />
                        <span className="break-words">por Purple Cove Labs · Oryn AI</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-foreground/90 leading-relaxed mb-6">
                    Sistema completo de inteligencia de prospectos que identifica,
                    enriquece y prioriza tus leads de alto valor — automatizando el
                    trabajo de investigación para que tu equipo de ventas enfoque su
                    tiempo donde importa.
                  </p>

                  {/* Demo video placeholder */}
                  <div className="rounded-xl bg-glass-bg/40 border border-border/40 aspect-video flex items-center justify-center mb-6">
                    <p className="text-xs text-muted-foreground">
                      Video demo próximamente
                    </p>
                  </div>
                </div>

                <div className="lg:w-80 shrink-0 min-w-0">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-primary mb-3">
                    Funcionalidades clave
                  </div>
                  <ul className="space-y-4 mb-8">
                    {features.map((f) => (
                      <li key={f.title} className="flex items-start gap-3 min-w-0">
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <f.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-foreground mb-0.5">
                            {f.title}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {f.desc}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <BookingButton
                    ariaLabel="Solicitar demo de Prospect Intelligence Dashboard"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 min-h-[48px] text-sm font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent hover:scale-[1.02] shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)] transition-all duration-300 cursor-pointer"
                  >
                    Solicitar demo
                    <ArrowRight className="w-4 h-4" />
                  </BookingButton>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default Apps;
