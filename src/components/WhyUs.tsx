import { TrendingUp, Layers, Shield, Users } from "lucide-react";

const differentiators = [
  {
    icon: TrendingUp,
    title: "Business-First Mindset",
    description: "With a background in business and finance, I understand ROI, operations, and what drives real value for your company."
  },
  {
    icon: Layers,
    title: "Full-Stack Solutions",
    description: "AI agents, automation workflows, web apps, and deployment — all handled end-to-end. No need to coordinate multiple vendors."
  },
  {
    icon: Shield,
    title: "Scalable Infrastructure",
    description: "I build maintainable, production-ready systems — not fragile scripts. Your tools will grow with your business."
  },
  {
    icon: Users,
    title: "Long-Term Partnership",
    description: "I don't just deliver and disappear. I offer ongoing support and become a trusted partner in your business growth."
  }
];

const WhyUs = () => {
  return (
    <section id="why-us" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 relative">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Why Choose <span className="gradient-text">Purple Cove Labs</span>
          </h2>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {differentiators.map((item) => (
            <div 
              key={item.title}
              className="glass-card-hover p-5 sm:p-6 md:p-8 flex gap-4 sm:gap-5"
            >
              <div className="shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/30">
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
              </div>
              
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
