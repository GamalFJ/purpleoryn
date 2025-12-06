import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
const CTA = () => {
  return <section className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative">
        <div className="glass-card max-w-3xl mx-auto p-12 md:p-16 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Let's Build Something Great
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Turn Chaos <br />
              <span className="gradient-text neon-text">into a System?</span>
            </h2>
            
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Stop wasting time on repetitive tasks. Let's automate your workflows and scale your business with AI-powered systems.
            </p>
            
            <Button variant="hero" size="xl" className="group" asChild>
              <a target="_blank" rel="noopener noreferrer" href="http://www.fiverr.com/s/qDBW55d">
                Let's Get Started  
                <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default CTA;