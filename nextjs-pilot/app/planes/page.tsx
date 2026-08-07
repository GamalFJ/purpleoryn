import type { Metadata } from "next";
import { Check, Star, ArrowRight, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FinalCTA from "@/components/sections/FinalCTA";
import BookingButton from "@/components/BookingButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
  title: "Planes de Soporte Mensual — Purple Cove Labs",
  description: "Planes de soporte y mantenimiento continuo para tu sistema: Básico (RD$ 10,675), Estándar (RD$ 18,000) y AI Partner (RD$ 35,000). Cancelables en cualquier momento.",
  alternates: { canonical: "/planes" },
  openGraph: {
    title: "Planes de Soporte Mensual — Purple Cove Labs",
    description: "Planes de soporte y mantenimiento continuo para tu sistema digital. Básico, Estándar y AI Partner — cancelables en cualquier momento.",
    url: "https://purpleoryn.com/planes",
  },
};

const plans = [
  {
    name: "Plan Básico",
    price: "RD$ 10,675",
    period: "/mes",
    ideal: "Ideal para negocios que ya tienen su sistema en marcha y necesitan respaldo activo.",
    features: ["Monitoreo del sistema", "Corrección de errores menores", "Soporte directo por WhatsApp en horario laboral", "Reporte mensual de uptime"],
    deliverables: ["Acceso a soporte por WhatsApp", "Reporte mensual de estado", "Tiempo de respuesta < 24h laborales"],
    highlight: false,
  },
  {
    name: "Plan Estándar",
    price: "RD$ 18,000",
    period: "/mes",
    ideal: "Ideal para negocios con automatizaciones, APIs y herramientas conectadas que requieren mantenimiento continuo.",
    features: [
      "Gestión de automatizaciones",
      "Depuración y mantenimiento de APIs",
      "Garantía de operación continua",
      "Mejora progresiva del sistema existente",
      "Soporte prioritario por WhatsApp",
    ],
    deliverables: ["Mantenimiento mensual del ecosistema", "Reporte detallado de mejoras", "Tiempo de respuesta < 12h laborales", "1 sesión de revisión mensual"],
    highlight: true,
  },
  {
    name: "Plan AI Partner",
    price: "RD$ 35,000",
    period: "/mes",
    ideal: "Ideal para negocios que quieren convertir la IA en su ventaja competitiva.",
    features: ["Todo lo del Plan Estándar", "Integración activa de Inteligencia Artificial", "Chatbot de WhatsApp con IA", "Llamada estratégica mensual", "Soporte prioritario y respuesta en horas"],
    deliverables: ["Implementación y mantenimiento de IA", "Optimización mensual de prompts y agentes", "Llamada estratégica 1:1 con Gamal", "Tiempo de respuesta < 4h laborales"],
    highlight: false,
  },
];

export default function Planes() {
  return (
    <LanguageProvider>
      <div className="min-h-screen min-h-[100dvh] bg-background relative w-full max-w-full overflow-x-hidden">
        <Header />
        <main className="relative z-10 pt-24 sm:pt-28">
          <section className="py-10 sm:py-16 px-4 sm:px-6 text-center">
            <div className="container mx-auto max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-5">
                Planes de Asociación Continua
              </div>
              <h1 className="font-extrabold mb-4">
                Planes que <span className="gradient-text">crecen contigo</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
                Elige el nivel de soporte que necesita tu operación. Todos los planes son mensuales y cancelables en cualquier momento.
              </p>
            </div>
          </section>

          <section className="py-8 sm:py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                {plans.map((p) => (
                  <div
                    key={p.name}
                    className={`glass-card p-6 sm:p-7 flex flex-col relative transition-all duration-300 hover:-translate-y-1 ${
                      p.highlight ? "border-primary/60 shadow-[0_0_50px_-10px_hsl(var(--primary)/0.5)]" : "hover:border-primary/40"
                    }`}
                  >
                    {p.highlight && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-gradient-to-r from-primary to-accent text-primary-foreground text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                        <Star className="w-3 h-3 fill-current" />
                        Más Popular
                      </div>
                    )}

                    <h3 className="font-bold text-foreground text-lg mb-2">{p.name}</h3>
                    <p className="text-xs text-muted-foreground italic mb-4 leading-relaxed">{p.ideal}</p>

                    <div className="mb-5 pb-5 border-b border-border/30">
                      <span className="text-3xl font-extrabold text-price-yellow">{p.price}</span>
                      <span className="text-sm text-muted-foreground">{p.period}</span>
                    </div>

                    <div className="mb-5">
                      <div className="text-[10px] font-bold tracking-widest uppercase text-primary mb-2">Incluye</div>
                      <ul className="space-y-2">
                        {p.features.map((f) => (
                          <li key={f} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={3} />
                            <span className="text-xs sm:text-sm text-foreground/90 leading-snug">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6 flex-1">
                      <div className="text-[10px] font-bold tracking-widest uppercase text-accent mb-2">Entregables</div>
                      <ul className="space-y-2">
                        {p.deliverables.map((d) => (
                          <li key={d} className="flex items-start gap-2">
                            <ArrowRight className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                            <span className="text-xs text-muted-foreground leading-snug">{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <BookingButton
                      ariaLabel={`Agendar llamada para ${p.name}`}
                      className={`w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 min-h-[48px] text-sm font-bold transition-all duration-300 cursor-pointer ${
                        p.highlight
                          ? "text-primary-foreground bg-gradient-to-r from-primary to-accent hover:scale-[1.02]"
                          : "text-foreground border border-primary/40 bg-glass-bg/40 hover:border-primary hover:bg-primary/10"
                      }`}
                    >
                      Agendar llamada
                    </BookingButton>
                  </div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <p className="text-sm text-muted-foreground mb-4">¿Necesitas algo distinto? Conversemos por WhatsApp.</p>
                <WhatsAppButton className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-foreground border border-primary/40 bg-glass-bg/40 backdrop-blur-md hover:border-primary hover:bg-primary/10 transition-all">
                  <MessageCircle className="w-4 h-4" />
                  Escribir por WhatsApp
                </WhatsAppButton>
              </div>
            </div>
          </section>

          <FinalCTA />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
