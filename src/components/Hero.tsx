import founderImage from "@/assets/founder-hero.png";
import { ArrowRight, Calendar, TrendingUp, Clock, DollarSign } from "lucide-react";
import BookingButton from "@/components/BookingButton";
import { Link } from "react-router-dom";

const benefits = [
  {
    icon: TrendingUp,
    title: "Más Ventas",
    desc: "Automatizamos para que no pierdas oportunidades.",
  },
  {
    icon: Clock,
    title: "Más Tiempo",
    desc: "Eliminamos tareas manuales y repetitivas.",
  },
  {
    icon: DollarSign,
    title: "Más Beneficio",
    desc: "Sistemas que trabajan 24/7 para aumentar tus ingresos.",
  },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-32 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl" />

      <div className="container mx-auto relative z-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center">
          {/* Left: Copy */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h1 className="font-extrabold leading-[1.05] tracking-tight">
              <span className="block text-foreground">Sistemas que hacen</span>
              <span className="block text-foreground">crecer tu negocio.</span>
              <span className="block mt-2">
                <span className="gradient-text">Más ventas.</span>{" "}
                <span className="text-primary neon-text">Menos trabajo.</span>
              </span>
            </h1>

            <p className="mt-5 sm:mt-6 text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Automatizamos tus procesos, captamos más clientes y te devolvemos
              tiempo para enfocarte en lo que importa:{" "}
              <span className="text-primary font-semibold">
                hacer crecer tu negocio.
              </span>
            </p>

            {/* Benefit chips */}
            <div className="mt-7 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="glass-card p-3 sm:p-4 text-left flex items-start gap-3"
                >
                  <div className="shrink-0 w-9 h-9 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                    <b.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-foreground text-sm leading-tight">
                      {b.title}
                    </div>
                    <div className="text-xs text-muted-foreground leading-snug mt-0.5">
                      {b.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-center lg:justify-start">
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

          {/* Right: Founder */}
          <div className="order-1 lg:order-2 relative flex justify-center">
            <div className="relative w-[240px] sm:w-[300px] md:w-[360px] lg:w-full max-w-[440px] aspect-[3/4]">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl animate-glow-pulse" />
              {/* Orbiting accent rings */}
              <div className="absolute inset-4 rounded-full border border-primary/20" />
              <div className="absolute inset-8 rounded-full border border-accent/15" />
              <img
                src={founderImage}
                alt="Gamal Jastram - Fundador de Purple Cove Labs"
                className="relative z-10 w-full h-full object-contain object-bottom"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
