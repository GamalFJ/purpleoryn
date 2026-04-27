import { ArrowRight, Calendar } from "lucide-react";
import BookingButton from "@/components/BookingButton";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-24 sm:pt-28 pb-10 sm:pb-14 px-4 sm:px-6">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-32 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl" />

      <div className="container mx-auto relative z-10 max-w-3xl text-center">
        <h1 className="font-extrabold leading-[1.05] tracking-tight">
          <span className="block text-foreground">Sistemas que hacen</span>
          <span className="block text-foreground">crecer tu negocio.</span>
          <span className="block mt-2">
            <span className="gradient-text">Más ventas.</span>{" "}
            <span className="text-primary neon-text">Menos trabajo.</span>
          </span>
        </h1>

        <p className="mt-5 sm:mt-6 text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Automatizamos tus procesos, captamos más clientes y te devolvemos
          tiempo para enfocarte en lo que importa:{" "}
          <span className="text-primary font-semibold">
            hacer crecer tu negocio.
          </span>
        </p>

        <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-center">
          <BookingButton
            ariaLabel="Agendar Llamada Estratégica"
            className="group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 min-h-[52px] text-sm sm:text-base font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent shadow-[0_0_30px_-5px_hsl(var(--primary)/0.6)] hover:shadow-[0_0_45px_-5px_hsl(var(--primary)/0.8)] hover:scale-[1.02] transition-all duration-300 cursor-pointer"
          >
            <Calendar className="w-5 h-5 shrink-0" />
            <span>Agendar Llamada Estratégica</span>
          </BookingButton>

          <Link
            to="/portafolio"
            className="group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 min-h-[52px] text-sm sm:text-base font-semibold text-foreground border border-primary/40 bg-glass-bg/40 backdrop-blur-md hover:border-primary hover:bg-primary/10 transition-all duration-300"
          >
            <span>Ver Casos de Éxito</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
