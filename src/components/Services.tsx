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
    <section id="services" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 relative">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            What I <span className="gradient-text">Build</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            End-to-end AI solutions and automation systems that transform how your business operates.
          </p>
        </div>
        
        {/* Services grid - responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <article 
              key={service.title}
              className="glass-card-hover p-5 sm:p-6 md:p-8 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4 sm:mb-6 relative">
                <div className="absolute -inset-2 bg-primary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/30 group-hover:border-primary/60 transition-colors duration-300">
                  <service.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
              </div>
              
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                {service.title}
              </h3>
              
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
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
