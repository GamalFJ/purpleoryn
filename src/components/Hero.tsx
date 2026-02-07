import founderImage from "@/assets/founder.png";
import { Button } from "@/components/ui/button";
import { Coffee } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] flex items-center overflow-hidden pt-20 pb-8 px-4 sm:px-6">
      <div className="container mx-auto relative z-10 w-full max-w-full px-0">
        <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10">
          {/* Left: Text Content */}
          <div className="flex-1 text-center md:text-left space-y-4 sm:space-y-5">
            <h1 className="font-bold text-foreground leading-tight">
              I help businesses scale with{" "}
              <span className="text-primary neon-text">AI</span>
            </h1>

            <div className="space-y-0.5">
              <p className="text-lg sm:text-xl font-semibold text-foreground">
                Gamal Jastram
              </p>
              <p className="text-sm sm:text-base text-muted-foreground">
                Web & AI Developer
              </p>
            </div>

            <p className="text-sm sm:text-base text-muted-foreground font-medium tracking-wide">
              Web Development{" "}
              <span className="text-primary/70 mx-1">|</span>{" "}
              Automation{" "}
              <span className="text-primary/70 mx-1">|</span>{" "}
              Custom Apps & Tools
            </p>

            <div className="pt-2">
              <Button
                variant="outline"
                size="default"
                className="border-primary/50 text-primary hover:bg-primary/10 hover:border-primary gap-2 text-xs sm:text-sm px-4 py-2 h-auto min-h-[44px]"
                asChild
              >
                <a
                  href="https://fluum.ai/c/15-minute-virtual-coffee-139038"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Coffee className="w-5 h-5" />
                  Let's have a (Free) Virtual Coffee
                </a>
              </Button>
            </div>
          </div>

          {/* Right: Founder Image */}
          <div className="flex-shrink-0 w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 relative">
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl animate-glow-pulse" />
            <img
              src={founderImage}
              alt="Gamal Jastram - Founder of Purple Cove Labs"
              className="w-full h-full object-cover rounded-full relative z-10 border-2 border-primary/30"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
