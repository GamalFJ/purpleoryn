import { MessageSquare, PenTool, Rocket, HeartHandshake } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Share Your Requirements",
    description: "Tell me about your business needs, pain points, and goals."
  },
  {
    number: "02",
    icon: PenTool,
    title: "Architecture & Planning",
    description: "I design the system architecture and create a detailed project plan."
  },
  {
    number: "03",
    icon: Rocket,
    title: "Build & Deploy",
    description: "I develop, test, deploy, and document your complete solution."
  },
  {
    number: "04",
    icon: HeartHandshake,
    title: "Handoff & Support",
    description: "You receive your tool with optional ongoing maintenance and scaling."
  }
];

const Process = () => {
  return (
    <section id="process" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      
      <div className="container mx-auto max-w-6xl relative">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            How It <span className="gradient-text">Works</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map((step, index) => (
            <div 
              key={step.number}
              className="relative"
            >
              {/* Connector line - only visible on lg+ */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-primary/10 -translate-y-1/2 z-0" />
              )}
              
              <div className="glass-card-hover p-5 sm:p-6 md:p-8 h-full relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary/30">{step.number}</span>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/30">
                    <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                </div>
                
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-foreground">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
