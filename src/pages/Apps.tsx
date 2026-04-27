import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import FinalCTA from "@/components/sections/FinalCTA";
import { Sparkles, ArrowRight } from "lucide-react";
import BookingButton from "@/components/BookingButton";

const apps = [
  {
    name: "Client Whisperer",
    by: "Oryn AI",
    what: "Convierte notas de clientes en propuestas listas para enviar en menos de un minuto.",
    forWho: "Freelancers, agencias y consultores que envían múltiples propuestas al mes.",
    demo: "💬",
    status: "Próximamente",
    cta: "Recibir aviso de lanzamiento",
  },
  {
    name: "Onboarding Engine",
    by: "Purple Cove Labs",
    what: "Sistema modular para automatizar onboarding de clientes con formularios, agendas y CRM.",
    forWho: "Estudios profesionales, agencias y servicios B2B.",
    demo: "🗂️",
    status: "Disponible",
    cta: "Solicitar demo",
  },
  {
    name: "WA Lead Agent",
    by: "Purple Cove Labs",
    what: "Agente de WhatsApp con IA que califica leads, agenda citas y los envía a tu CRM.",
    forWho: "Negocios con alto volumen de mensajes entrantes.",
    demo: "🤖",
    status: "Disponible",
    cta: "Solicitar demo",
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
              Productos propios y plantillas reutilizables — diseñados para
              implementarse en días, no meses.
            </p>
          </div>
        </section>

        <section className="py-8 sm:py-12 px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {apps.map((a) => (
                <div
                  key={a.name}
                  className="glass-card p-6 sm:p-7 flex flex-col hover:-translate-y-1 hover:border-primary/40 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{a.demo}</div>
                    <span
                      className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full ${
                        a.status === "Disponible"
                          ? "bg-success-green/15 text-success-green border border-success-green/30"
                          : "bg-primary/15 text-primary border border-primary/30"
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-foreground text-lg mb-1">
                    {a.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-4">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span>por {a.by}</span>
                  </div>

                  <div className="mb-4">
                    <div className="text-[10px] font-bold tracking-widest uppercase text-primary mb-1">
                      Qué hace
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {a.what}
                    </p>
                  </div>

                  <div className="mb-5 flex-1">
                    <div className="text-[10px] font-bold tracking-widest uppercase text-accent mb-1">
                      Para quién
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {a.forWho}
                    </p>
                  </div>

                  <BookingButton
                    ariaLabel={`Agendar llamada sobre ${a.name}`}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 min-h-[48px] text-sm font-bold text-foreground border border-primary/40 bg-glass-bg/40 hover:border-primary hover:bg-primary/10 transition-all duration-300 cursor-pointer"
                  >
                    {a.cta}
                    <ArrowRight className="w-4 h-4" />
                  </BookingButton>
                </div>
              ))}
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
