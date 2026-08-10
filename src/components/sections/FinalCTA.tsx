import { Calendar, MessageCircle } from "lucide-react";
import BookingButton from "@/components/BookingButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import { BorderBeam } from "@/components/ui/border-beam";

const FinalCTA = () => {
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/15 rounded-full blur-3xl" />

      <div className="container mx-auto max-w-3xl relative">
        <div className="glass-card p-6 sm:p-10 lg:p-14 text-center relative overflow-hidden">
          <BorderBeam
            size={140}
            duration={7}
            reverse
            colorFrom="hsl(270 100% 65%)"
            colorTo="hsl(280 100% 70%)"
          />
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />

          <h2 className="font-extrabold mb-4">
            Agenda hoy y empieza a{" "}
            <span className="gradient-text">escalar tu negocio</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-lg mx-auto">
            20 minutos para identificar qué sistema te dará el mayor retorno.
            Sin costo, sin compromiso.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
            <BookingButton
              ariaLabel="Agendar Llamada Estratégica"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 min-h-[52px] text-sm sm:text-base font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent shadow-[0_0_30px_-5px_hsl(var(--primary)/0.6)] hover:shadow-[0_0_45px_-5px_hsl(var(--primary)/0.8)] hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            >
              <Calendar className="w-5 h-5" />
              Agendar Llamada
            </BookingButton>

            <WhatsAppButton className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 min-h-[52px] text-sm sm:text-base font-semibold text-foreground border border-primary/40 bg-glass-bg/40 backdrop-blur-md hover:border-primary hover:bg-primary/10 transition-all duration-300">
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
