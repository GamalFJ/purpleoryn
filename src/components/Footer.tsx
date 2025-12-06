import logo from "@/assets/logo.png";
import { Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border/50 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Logo and brand */}
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="Purple Cove Labs" 
              className="h-10 w-10 rounded-full"
            />
            <span className="font-semibold text-foreground">Purple Cove Labs</span>
          </div>
          
          {/* Social Icons */}
          <div className="flex items-center gap-6">
            <a 
              href="https://www.fiverr.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full glass-card hover:border-primary/50 hover:scale-110 transition-all duration-300"
              aria-label="Fiverr"
            >
              <svg 
                viewBox="0 0 24 24" 
                className="w-5 h-5 fill-current text-foreground hover:text-primary transition-colors"
                aria-hidden="true"
              >
                <path d="M23.004 15.588a.995.995 0 1 0 .002-1.99.995.995 0 0 0-.002 1.99zm-.996-3.705h-.85c-.546 0-.84.41-.84 1.092v2.466h-1.61v-3.558h-.684c-.547 0-.84.41-.84 1.092v2.466h-1.61v-4.874h1.61v.74c.264-.574.626-.74 1.163-.74h1.972v.74c.264-.574.625-.74 1.162-.74h.527v1.316zm-6.786 1.501h-3.359c.088.546.43.858 1.006.858.43 0 .732-.175.972-.527l1.376.654c-.478.762-1.266 1.218-2.348 1.218-1.757 0-2.71-1.17-2.71-2.544 0-1.382.953-2.544 2.71-2.544 1.61 0 2.505 1.042 2.505 2.544 0 .117-.01.234-.02.341h-.132zm-1.67-1.111c-.088-.498-.41-.81-.91-.81-.498 0-.82.312-.908.81h1.818zm-5.573 2.922c-.79 0-1.376-.342-1.376-1.17v-1.794h-.684v-1.316h.684v-1.218l1.61-.382v1.6h1.123v1.316h-1.123v1.57c0 .312.147.41.41.41h.712v1.316h-1.356v-.332zm-3.51-4.742h1.61v4.874h-1.61v-.74c-.264.574-.625.74-1.162.74-.953 0-1.757-.77-1.757-2.544 0-1.773.804-2.544 1.757-2.544.537 0 .898.166 1.162.74v-.526zm-1.318 2.33c0 .81.312 1.248.82 1.248.508 0 .82-.439.82-1.248 0-.81-.312-1.248-.82-1.248-.508 0-.82.439-.82 1.248z"/>
              </svg>
            </a>
            <a 
              href="https://www.linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full glass-card hover:border-primary/50 hover:scale-110 transition-all duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
            </a>
          </div>
          
          {/* Copyright */}
          <p className="text-muted-foreground text-sm">
            © 2025 Purple Cove Labs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
