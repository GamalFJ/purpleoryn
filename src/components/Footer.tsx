import logo from "@/assets/logo.png";
import { Linkedin, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Custom X (Twitter) icon
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Custom Beacons icon
const BeaconsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="4" fill="currentColor" />
  </svg>
);

// Payment icons in full color
const VisaIcon = () => (
  <svg viewBox="0 0 48 32" className="h-6 sm:h-8 w-auto">
    <rect width="48" height="32" rx="4" fill="#1A1F71" />
    <path d="M19.5 21h-3l2-10h3l-2 10zm7.5-10l-2.8 7-1-5.2c-.2-.8-.6-1-1.3-1h-3.8l-.1.4c1.3.3 2.5.8 3.3 1.3l2.7 7.5h3l4.5-10h-3.5zm10.3 6.8l1.5-4 .9 4h-2.4zm3.7 3.2h2.8l-2.4-10h-2.5c-.6 0-1.1.3-1.3 1l-4.6 9h3.2l.6-1.8h3.9l.3 1.8zm-16.5-6.5l.4-2.3c-.8-.3-1.6-.5-2.5-.5-2.7 0-4.6 1.4-4.6 3.5 0 1.5 1.4 2.4 2.4 2.9 1.1.5 1.4.9 1.4 1.3 0 .7-.8 1-1.6 1-.9 0-2-.2-2.9-.6l-.4 2.3c.8.3 2 .5 3.3.5 2.9 0 4.8-1.4 4.8-3.6 0-1.2-.7-2.1-2.3-2.8-1-.4-1.5-.7-1.5-1.2 0-.4.5-.8 1.5-.8.9 0 1.6.2 2 .3z" fill="#fff"/>
  </svg>
);

const MastercardIcon = () => (
  <svg viewBox="0 0 48 32" className="h-6 sm:h-8 w-auto">
    <rect width="48" height="32" rx="4" fill="#fff" />
    <circle cx="18" cy="16" r="8" fill="#EB001B" />
    <circle cx="30" cy="16" r="8" fill="#F79E1B" />
    <path d="M24 9.6c1.9 1.5 3.1 3.8 3.1 6.4s-1.2 4.9-3.1 6.4c-1.9-1.5-3.1-3.8-3.1-6.4s1.2-4.9 3.1-6.4z" fill="#FF5F00" />
  </svg>
);

const PayPalIcon = () => (
  <svg viewBox="0 0 48 32" className="h-6 sm:h-8 w-auto">
    <rect width="48" height="32" rx="4" fill="#fff" />
    <path d="M19.5 8h5.8c3.8 0 5.2 2 4.9 4.8-.4 3.8-2.8 5.9-6.4 5.9h-1.5c-.5 0-.9.3-1 .9l-.8 5.1c-.1.4-.4.7-.8.7h-3.3c-.4 0-.6-.3-.5-.7l2.6-16c.1-.5.5-.7 1-.7z" fill="#003087"/>
    <path d="M32.2 8.3c.8.9 1.1 2.2.9 3.7-.6 4.6-3.2 7.2-7.7 7.2h-2c-.5 0-.9.4-1 .9l-1 6.3c-.1.4-.4.6-.8.6h-2.8c-.3 0-.5-.2-.4-.6l.4-2.4.8-5.1c.1-.5.5-.9 1-.9h1.5c3.6 0 6-2.1 6.4-5.9.2-1.5.1-2.7-.6-3.5" fill="#002F86"/>
    <path d="M14.5 8h5.8c.5 0 .9.2 1 .7l-2.6 16c-.1.4.1.7.5.7h3.3c.4 0 .7-.3.8-.7l.8-5.1c.1-.5.5-.9 1-.9h1.5c3.6 0 6-2.1 6.4-5.9.2-1.5-.1-2.8-.9-3.7-.9-1-2.5-1.5-4.4-1.5h-5.8c-.5 0-.9.2-1 .7l-2.6 16c-.1.4.1.7.5.7" fill="#009CDE"/>
  </svg>
);

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-8 sm:py-12 border-t border-border/50 relative px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-4 sm:gap-6 text-center">
          {/* Logo and brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img 
              src={logo} 
              alt="Purple Cove Labs" 
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" 
            />
            <span className="font-semibold text-foreground text-sm sm:text-base">Purple Cove Labs</span>
          </div>
          
          {/* Social Icons */}
          <div className="flex items-center gap-4 sm:gap-6">
            <a 
              href="https://www.instagram.com/purplecovelabs.ai/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 sm:p-3 rounded-full glass-card hover:border-primary/50 hover:scale-110 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center" 
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
            </a>
            <a 
              href="https://www.linkedin.com/in/gamal-jastram-8a88b7175/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 sm:p-3 rounded-full glass-card hover:border-primary/50 hover:scale-110 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center" 
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
            </a>
            <a 
              href="https://x.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 sm:p-3 rounded-full glass-card hover:border-primary/50 hover:scale-110 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center" 
              aria-label="X (Twitter)"
            >
              <XIcon className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
            </a>
            <a 
              href="https://beacons.ai/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 sm:p-3 rounded-full glass-card hover:border-primary/50 hover:scale-110 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center" 
              aria-label="Beacons"
            >
              <BeaconsIcon className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
            </a>
          </div>

          {/* Payment Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <VisaIcon />
            <MastercardIcon />
            <PayPalIcon />
          </div>
          
          {/* Copyright */}
          <p className="text-muted-foreground text-xs sm:text-sm text-center max-w-xs sm:max-w-none">
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
