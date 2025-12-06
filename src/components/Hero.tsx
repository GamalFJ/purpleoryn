import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import founder from "@/assets/founder.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="animate-fade-in">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-primary font-medium">
                <Sparkles className="w-4 h-4" />
                AI Automation Expert
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in-delay-1">
              <span className="text-foreground">AI-POWERED SYSTEMS</span>
              <br />
              <span className="gradient-text neon-text">BUILT FOR BUSINESS SCALE</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 animate-fade-in-delay-2">
              Automation · AI Agents · Custom Web Tools — <span className="text-foreground font-medium">Done-for-You</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-delay-3">
              <Button 
                variant="hero" 
                size="xl"
                asChild
              >
                <a href="https://www.fiverr.com" target="_blank" rel="noopener noreferrer">
                  Hire Me on Fiverr
                  <ArrowRight className="w-5 h-5 ml-1" />
                </a>
              </Button>
              
              <Button 
                variant="glass" 
                size="xl"
                asChild
              >
                <a href="#portfolio">
                  See Portfolio
                </a>
              </Button>
            </div>
          </div>
          
          {/* Right content - Founder image */}
          <div className="relative hidden lg:flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-transparent rounded-full blur-2xl" />
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-xl animate-glow-pulse" />
              <img 
                src={founder} 
                alt="Gamal Jastram - Founder of Purple Cove Labs"
                className="relative z-10 w-80 h-auto object-contain animate-float"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-2">
          <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
