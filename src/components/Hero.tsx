import { Layers, FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden h-[90vh] sm:h-screen">
      {/* Background image */}
      <img
        src="/lovable-uploads/Hero Section.png"
        alt="Hero"
        className="absolute inset-0 z-0 w-full h-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 z-10 bg-black/40" />

      {/* CTA buttons — bottom third */}
      <div className="absolute bottom-12 sm:bottom-16 inset-x-0 z-20 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center px-4">
        <Link
          to="/demos"
          className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 min-h-[52px] text-sm sm:text-base font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent shadow-[0_0_30px_-5px_hsl(var(--primary)/0.6)] hover:shadow-[0_0_45px_-5px_hsl(var(--primary)/0.8)] hover:scale-[1.02] transition-all duration-300"
        >
          <Layers className="w-5 h-5 shrink-0" />
          Ver Demos
        </Link>

        <Link
          to="/portafolio"
          className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 min-h-[52px] text-sm sm:text-base font-semibold text-white border border-white/60 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white transition-all duration-300"
        >
          <FolderOpen className="w-5 h-5 shrink-0" />
          Ver Portafolio
        </Link>
      </div>
    </section>
  );
};

export default Hero;
