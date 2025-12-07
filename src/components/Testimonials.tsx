import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Marcus Chen",
    role: "CEO, TechFlow Solutions",
    quote: "Purple Cove Labs delivered an AI system that cut our manual processing time by 80%. The multi-agent architecture they built handles our entire client onboarding now.",
    rating: 5,
  },
  {
    name: "Sarah Mitchell",
    role: "Founder, DataPulse Agency",
    quote: "I needed a custom dashboard that connected to 5 different APIs. They delivered a production-ready tool in 2 weeks that my team uses daily. Exceptional work.",
    rating: 5,
  },
  {
    name: "James Rodriguez",
    role: "Operations Lead, ScaleUp Ventures",
    quote: "The AI automation pipeline they built replaced 3 manual workflows. Clean architecture, great documentation, and the system just works. Highly recommend.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <header className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Clients{" "}
            <span className="gradient-text">Say</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real results from real businesses. Here's what founders and teams say about working with Purple Cove Labs.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.name}
              className="glass-card glass-card-hover p-6 flex flex-col animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-primary/50" />
              </div>

              {/* Quote Text */}
              <blockquote className="text-foreground/90 text-sm leading-relaxed mb-6 flex-1">
                "{testimonial.quote}"
              </blockquote>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-primary text-primary"
                  />
                ))}
              </div>

              {/* Author */}
              <footer>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-muted-foreground text-sm">{testimonial.role}</p>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
