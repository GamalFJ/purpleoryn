import { Check } from "lucide-react";
import BookingButton from "@/components/BookingButton";

const bullets = [
  "Automatizaciones que conectan tus herramientas y eliminan trabajo manual",
  "Agentes IA que responden, califican y agendan 24/7",
  "Apps y portales a medida que centralizan tu operación",
  "Integraciones con WhatsApp, CRM, correo y calendario",
  "Posicionamiento SEO para captar tráfico orgánico y nuevos clientes",
  "Documentación y capacitación para que tu equipo lo opere",
];

const Offer = () => {
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="glass-card p-6 sm:p-10 lg:p-14 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-4">
              La Oferta
            </div>
            <h2 className="font-extrabold mb-4">
              Diseñamos sistemas que{" "}
              <span className="gradient-text">automatizan</span> tu negocio y{" "}
              <span className="text-primary neon-text">aumentan</span> tus
              ingresos.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Una solución llave en mano: estrategia, implementación y soporte
              continuo — sin coordinar múltiples proveedores.
            </p>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto mb-8">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary" strokeWidth={3} />
                </span>
                <span className="text-sm text-foreground/90 leading-relaxed">
                  {b}
                </span>
              </li>
            ))}
          </ul>

          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-4">
              Implementación en días, no meses — con soporte continuo incluido.
            </p>
            <BookingButton className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 min-h-[52px] text-sm sm:text-base font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent shadow-[0_0_30px_-5px_hsl(var(--primary)/0.6)] hover:shadow-[0_0_45px_-5px_hsl(var(--primary)/0.8)] hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              Agendar Llamada Estratégica — Gratis
            </BookingButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Offer;
