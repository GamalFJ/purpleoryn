import { useState } from "react";
import { Star, Quote, Send, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { useLanguage } from "@/contexts/LanguageContext";

// Validation schema for testimonial submissions
const testimonialSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  role: z.string().trim().min(1, "Role is required").max(100, "Role must be less than 100 characters"),
  company: z.string().trim().min(1, "Company is required").max(100, "Company must be less than 100 characters"),
  quote: z.string().trim().min(10, "Testimonial must be at least 10 characters").max(500, "Testimonial must be less than 500 characters"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
});
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
    quote: "Purple Cove Labs delivered a web page, a form submission automated workflow and has given our business a digital backbone, and an actual database thus cutting off manual process and decreasing client friction by 90%. They now handle our entire backend and AI systems.",
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
  const { t } = useLanguage();
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
    mutationFn: async (data: z.infer<typeof testimonialSchema>) => {
      const { error } = await supabase.from("testimonials").insert({
        name: data.name,
        role: data.role,
        company: data.company,
        quote: data.quote,
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
    
    // Validate form data with zod schema
    const validation = testimonialSchema.safeParse(formData);
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast.error(firstError.message);
      return;
    }
    
    submitMutation.mutate(validation.data);
  };

  // Combine database testimonials with defaults (show DB ones first)
  const allTestimonials = testimonials.length > 0 
    ? testimonials 
    : defaultTestimonials.map((t, i) => ({ ...t, id: `default-${i}`, created_at: "" }));

  return (
    <section id="testimonials" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <header className="text-center mb-10 sm:mb-16 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            {t("testimonials.title")}{" "}
            <span className="gradient-text">{t("testimonials.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-6 sm:mb-8">
            {t("testimonials.subtitle")}
          </p>
          <Button
            onClick={() => setIsFormOpen(!isFormOpen)}
            variant="outline"
            className="border-primary/30 hover:bg-primary/10 min-h-[48px]"
          >
            {isFormOpen ? (
              <>
                <X className="w-4 h-4 mr-2" />
                {t("testimonials.closeForm")}
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                {t("testimonials.leaveRecommendation")}
              </>
            )}
          </Button>
        </header>

        {/* Submission Form */}
        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="glass-card p-4 sm:p-6 md:p-8 mb-8 sm:mb-12 max-w-2xl mx-auto animate-fade-in"
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center">{t("testimonials.formTitle")}</h3>
            <div className="grid gap-3 sm:gap-4">
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  placeholder={t("testimonials.placeholders.name")}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  maxLength={100}
                  className="bg-background/50 border-border/50 min-h-[48px]"
                />
                <Input
                  placeholder={t("testimonials.placeholders.role")}
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  maxLength={100}
                  className="bg-background/50 border-border/50 min-h-[48px]"
                />
              </div>
              <Input
                placeholder={t("testimonials.placeholders.company")}
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                maxLength={100}
                className="bg-background/50 border-border/50 min-h-[48px]"
              />
              <Textarea
                placeholder={t("testimonials.placeholders.quote")}
                value={formData.quote}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                maxLength={500}
                rows={4}
                className="bg-background/50 border-border/50 resize-none min-h-[120px]"
              />
              
              {/* Star Rating */}
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground">{t("testimonials.rating")}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="focus:outline-none transition-transform hover:scale-110 p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <Star
                        className={`w-6 h-6 sm:w-7 sm:h-7 ${
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
                className="btn-glow w-full min-h-[48px]"
              >
                {submitMutation.isPending ? (
                  t("testimonials.submitting")
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {t("testimonials.submit")}
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {allTestimonials.slice(0, 6).map((testimonial, index) => (
            <article
              key={testimonial.id}
              className="glass-card glass-card-hover p-4 sm:p-6 flex flex-col animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Quote Icon */}
              <div className="mb-3 sm:mb-4">
                <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-primary/50" />
              </div>

              {/* Quote Text */}
              <blockquote className="text-foreground/90 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 flex-1">
                "{testimonial.quote}"
              </blockquote>

              {/* Rating */}
              <div className="flex gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-primary text-primary"
                  />
                ))}
              </div>

              {/* Author */}
              <footer>
                <p className="font-semibold text-foreground text-sm sm:text-base">{testimonial.name}</p>
                <p className="text-muted-foreground text-xs sm:text-sm">
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
