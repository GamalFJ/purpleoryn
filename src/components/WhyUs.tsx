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
    <section id="why-us" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Why Choose <span className="gradient-text">Purple Cove Labs</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {differentiators.map((item, index) => (
            <div 
              key={item.title}
              className="glass-card-hover p-8 flex gap-5"
            >
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/30">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
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
