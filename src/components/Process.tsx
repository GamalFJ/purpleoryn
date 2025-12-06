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
    <section id="process" className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      
      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            How It <span className="gradient-text">Works</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div 
              key={step.number}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-primary/10 -translate-y-1/2 z-0" />
              )}
              
              <div className="glass-card-hover p-8 h-full relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl font-bold text-primary/30">{step.number}</span>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/30">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground text-sm">
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
