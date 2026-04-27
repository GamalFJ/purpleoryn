import { Calendar } from "lucide-react";
import BookingButton from "@/components/BookingButton";

const StickyMobileCTA = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
      <div className="pointer-events-auto">
        <BookingButton
          ariaLabel="Agendar Llamada Estratégica"
          className="w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 min-h-[52px] text-sm font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent shadow-[0_0_30px_-5px_hsl(var(--primary)/0.7)] cursor-pointer"
        >
          <Calendar className="w-5 h-5" />
          Agendar Llamada
        </BookingButton>
      </div>
    </div>
  );
};

export default StickyMobileCTA;
