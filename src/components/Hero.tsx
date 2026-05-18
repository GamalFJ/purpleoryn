import { Layers, FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden h-[92vh] sm:h-screen">
      {/* Subject image — anchored right so the person stays visible */}
      <img
        src="/lovable-uploads/Hero Section.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 z-0 w-full h-full object-cover object-right"
      />

      {/*
        Gradient mask: matches site background exactly (hsl 270 50% 8%).
        Covers the image's baked-in text on the left, fades to transparent
        toward the right so the person shows through naturally.
      */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to right, hsl(270 50% 8%) 0%, hsl(270 50% 8%) 30%, hsl(270 50% 8% / 0.92) 48%, hsl(270 50% 8% / 0.55) 65%, transparent 85%)",
        }}
      />

      {/* Bottom fade — blends hero into the next section */}
      <div
        className="absolute bottom-0 inset-x-0 z-10 h-32"
        style={{
          background:
            "linear-gradient(to top, hsl(270 50% 8%) 0%, transparent 100%)",
        }}
      />

      {/* Hero content — left-aligned, native to site design */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-10 lg:px-20 pt-20 sm:pt-24">
        <div className="max-w-xl">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-6">
            🔥 Últimos cupos del mes disponibles
          </div>

          {/* Headline */}
          <h1 className="font-extrabold leading-[1.05] tracking-tight mb-5">
            <span className="block text-foreground">Sistemas que hacen</span>
            <span className="block text-foreground">crecer tu negocio.</span>
            <span className="block mt-2">
              <span className="gradient-text">Más ventas.</span>{" "}
              <span className="text-primary neon-text">Menos trabajo.</span>
            </span>
          </h1>

          {/* Sub-copy */}
          <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-md leading-relaxed">
            Más de 10 negocios ya automatizan con nosotros.{" "}
            <span className="text-primary font-semibold">
              Los cupos se llenan rápido.
            </span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
            <Link
              to="/demos"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 min-h-[52px] text-sm sm:text-base font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent shadow-[0_0_30px_-5px_hsl(var(--primary)/0.6)] hover:shadow-[0_0_45px_-5px_hsl(var(--primary)/0.8)] hover:scale-[1.02] transition-all duration-300"
            >
              <Layers className="w-5 h-5 shrink-0" />
              Ver Demos
            </Link>

            <Link
              to="/portafolio"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 min-h-[52px] text-sm sm:text-base font-semibold text-foreground border border-primary/40 bg-glass-bg/40 backdrop-blur-md hover:border-primary hover:bg-primary/10 transition-all duration-300"
            >
              <FolderOpen className="w-5 h-5 shrink-0" />
              Ver Portafolio
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
