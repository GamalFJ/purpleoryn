import { useState } from "react";
import { Star, Quote, Send, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  created_at: string;
}

const defaultTestimonials: Omit<Testimonial, "id" | "created_at">[] = [
  {
    name: "Kathleen P. Thomas",
    role: "Founder",
    company: "ArKyTek",
    quote: "Purple Cove Labs delivered an AI system that cut our manual processing time by 80%. The multi-agent architecture they built handles our entire client onboarding now.",
    rating: 5,
  },
  {
    name: "Sarah Mitchell",
    role: "Founder",
    company: "DataPulse Agency",
    quote: "I needed a custom dashboard that connected to 5 different APIs. They delivered a production-ready tool in 2 weeks that my team uses daily. Exceptional work.",
    rating: 5,
  },
  {
    name: "James Rodriguez",
    role: "Operations Lead",
    company: "ScaleUp Ventures",
    quote: "The AI automation pipeline they built replaced 3 manual workflows. Clean architecture, great documentation, and the system just works. Highly recommend.",
    rating: 5,
  },
];

const Testimonials = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    quote: "",
    rating: 5,
  });
  const queryClient = useQueryClient();

  const { data: testimonials = [] } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Testimonial[];
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("testimonials").insert({
        name: data.name.trim(),
        role: data.role.trim(),
        company: data.company.trim(),
        quote: data.quote.trim(),
        rating: data.rating,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Thank you for your testimonial!");
      setFormData({ name: "", role: "", company: "", quote: "", rating: 5 });
      setIsFormOpen(false);
    },
    onError: () => {
      toast.error("Failed to submit testimonial. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.company || !formData.quote) {
      toast.error("Please fill in all fields.");
      return;
    }
    submitMutation.mutate(formData);
  };

  // Combine database testimonials with defaults (show DB ones first)
  const allTestimonials = testimonials.length > 0 
    ? testimonials 
    : defaultTestimonials.map((t, i) => ({ ...t, id: `default-${i}`, created_at: "" }));

  return (
    <section id="testimonials" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <header className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Client{" "}
            <span className="gradient-text">Recommendations</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Real results from real businesses. See what founders and teams say about working with Purple Cove Labs.
          </p>
          <Button
            onClick={() => setIsFormOpen(!isFormOpen)}
            variant="outline"
            className="border-primary/30 hover:bg-primary/10"
          >
            {isFormOpen ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Close Form
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Leave a Recommendation
              </>
            )}
          </Button>
        </header>

        {/* Submission Form */}
        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="glass-card p-6 md:p-8 mb-12 max-w-2xl mx-auto animate-fade-in"
          >
            <h3 className="text-xl font-semibold mb-6 text-center">Share Your Experience</h3>
            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  maxLength={100}
                  className="bg-background/50 border-border/50"
                />
                <Input
                  placeholder="Your Role (e.g., CEO, Founder)"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  maxLength={100}
                  className="bg-background/50 border-border/50"
                />
              </div>
              <Input
                placeholder="Company Name"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                maxLength={100}
                className="bg-background/50 border-border/50"
              />
              <Textarea
                placeholder="Tell us about your experience working with Purple Cove Labs..."
                value={formData.quote}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                maxLength={500}
                rows={4}
                className="bg-background/50 border-border/50 resize-none"
              />
              
              {/* Star Rating */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= formData.rating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="btn-glow w-full"
              >
                {submitMutation.isPending ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Recommendation
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {allTestimonials.slice(0, 6).map((testimonial, index) => (
            <article
              key={testimonial.id}
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
                <p className="text-muted-foreground text-sm">
                  {testimonial.role}, {testimonial.company}
                </p>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
