import { Bot, Code2, Rocket, Wrench } from "lucide-react";

const services = [
  {
    icon: Bot,
    title: "AI Automation Pipelines",
    description: "Multi-agent workflows and intelligent backend logic that handle complex business processes autonomously."
  },
  {
    icon: Code2,
    title: "Custom Web Apps & Dashboards",
    description: "Full-stack applications with beautiful frontends, robust backends, data integrations, and API connections."
  },
  {
    icon: Rocket,
    title: "Tool Productization & Onboarding",
    description: "Professional landing pages, seamless user flows, CRM integrations, and staging environments."
  },
  {
    icon: Wrench,
    title: "Maintenance & Scaling Support",
    description: "Ongoing monitoring, updates, and scalability solutions to grow with your business needs."
  }
];

const Services = () => {
  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What I <span className="gradient-text">Build</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            End-to-end AI solutions and automation systems that transform how your business operates.
          </p>
        </div>
        
        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <article 
              key={service.title}
              className="glass-card-hover p-8 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6 relative">
                <div className="absolute -inset-2 bg-primary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/30 group-hover:border-primary/60 transition-colors duration-300">
                  <service.icon className="w-7 h-7 text-primary" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                {service.title}
              </h3>
              
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
