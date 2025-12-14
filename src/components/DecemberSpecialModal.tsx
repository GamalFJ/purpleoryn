import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Gift, X, CheckCircle, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

interface DecemberSpecialModalProps {
  onClose: () => void;
}

const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  businessName: z.string().min(1, "Business name is required"),
  email: z.string().email("Invalid email address"),
  projectType: z.string().min(1, "Please select a project type"),
  projectDetails: z.string().min(1, "Please describe your project"),
});

type FormData = z.infer<typeof formSchema>;

const DecemberSpecialModal = ({ onClose }: DecemberSpecialModalProps) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    businessName: "",
    email: "",
    projectType: "",
    projectDetails: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const projectTypeOptions = [
    { value: "Automation", label: t("decemberModal.projectTypes.automation") },
    { value: "AI Agent", label: t("decemberModal.projectTypes.aiAgent") },
    { value: "Landing Page", label: t("decemberModal.projectTypes.landingPage") },
    { value: "Business Tool (App)", label: t("decemberModal.projectTypes.businessTool") },
    { value: "Automation + Agent + Landing Page or Tool", label: t("decemberModal.projectTypes.combined") },
    { value: "I'm Not Sure", label: t("decemberModal.projectTypes.notSure") },
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validatedData = formSchema.parse(formData);
      
      // Call the edge function to forward data to n8n webhook
      const { data, error } = await supabase.functions.invoke('december-special-webhook', {
        body: validatedData,
      });

      if (error) {
        console.error('Error submitting form:', error);
        toast.error('Failed to submit form. Please try again.');
        return;
      }

      setIsSubmitted(true);
      toast.success(t("decemberModal.successMessage"));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof FormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error('Unexpected error:', error);
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Thank you view after successful submission
  if (isSubmitted) {
    return (
      <DialogContent className="december-modal-content sm:max-w-[500px] border-0 p-0">
        <button
          onClick={onClose}
          className="december-modal-close absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-christmas-green/20 border border-christmas-gold/30">
              <CheckCircle className="w-10 h-10 text-christmas-green" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold christmas-gradient-text mb-3">
            {t("decemberModal.thankYouTitle")}
          </h2>
          
          <p className="text-muted-foreground mb-6">
            {t("decemberModal.thankYouMessage")}
          </p>

          <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-primary/10 border border-primary/20 mb-6">
            <Mail className="w-5 h-5 text-christmas-gold" />
            <span className="text-sm text-foreground/80">
              {t("decemberModal.checkEmail")}
            </span>
          </div>

          <Button
            variant="hero"
            size="xl"
            className="christmas-cta w-full"
            onClick={onClose}
          >
            {t("decemberModal.closeButton")}
          </Button>
        </div>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="december-modal-content sm:max-w-[500px] max-h-[90vh] overflow-y-auto border-0 p-0">
      <button
        onClick={onClose}
        className="december-modal-close absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="p-6 sm:p-8">
        <DialogHeader className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="p-3 rounded-full bg-christmas-red/20 border border-christmas-gold/30">
              <Gift className="w-6 h-6 text-christmas-gold" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold christmas-gradient-text">
            {t("decemberModal.title")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            {t("decemberModal.subtitle")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-foreground/90">
              {t("decemberModal.fullName")} <span className="text-christmas-red">*</span>
            </Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder={t("decemberModal.fullNamePlaceholder")}
              className="december-input"
            />
            {errors.fullName && (
              <p className="text-sm text-christmas-red">{errors.fullName}</p>
            )}
          </div>

          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="businessName" className="text-foreground/90">
              {t("decemberModal.businessName")} <span className="text-christmas-red">*</span>
            </Label>
            <Input
              id="businessName"
              type="text"
              value={formData.businessName}
              onChange={(e) => handleInputChange("businessName", e.target.value)}
              placeholder={t("decemberModal.businessNamePlaceholder")}
              className="december-input"
            />
            {errors.businessName && (
              <p className="text-sm text-christmas-red">{errors.businessName}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground/90">
              {t("decemberModal.email")} <span className="text-christmas-red">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder={t("decemberModal.emailPlaceholder")}
              className="december-input"
            />
            {errors.email && (
              <p className="text-sm text-christmas-red">{errors.email}</p>
            )}
          </div>

          {/* Project Type */}
          <div className="space-y-2">
            <Label htmlFor="projectType" className="text-foreground/90">
              {t("decemberModal.projectType")} <span className="text-christmas-red">*</span>
            </Label>
            <Select
              value={formData.projectType}
              onValueChange={(value) => handleInputChange("projectType", value)}
            >
              <SelectTrigger className="december-input">
                <SelectValue placeholder={t("decemberModal.projectTypePlaceholder")} />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/50 z-50">
                {projectTypeOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="focus:bg-primary/20"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.projectType && (
              <p className="text-sm text-christmas-red">{errors.projectType}</p>
            )}
          </div>

          {/* Project Details */}
          <div className="space-y-2">
            <Label htmlFor="projectDetails" className="text-foreground/90">
              {t("decemberModal.projectDetails")} <span className="text-christmas-red">*</span>
            </Label>
            <Textarea
              id="projectDetails"
              value={formData.projectDetails}
              onChange={(e) => handleInputChange("projectDetails", e.target.value)}
              placeholder={t("decemberModal.projectDetailsPlaceholder")}
              className="december-input min-h-[120px] resize-none"
            />
            {errors.projectDetails && (
              <p className="text-sm text-christmas-red">{errors.projectDetails}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="hero"
            size="xl"
            className="christmas-cta w-full mt-6"
            disabled={isSubmitting}
          >
            <Gift className="w-5 h-5 mr-2" />
            {isSubmitting ? "..." : t("decemberModal.submit")}
          </Button>
        </form>
      </div>
    </DialogContent>
  );
};

export default DecemberSpecialModal;
