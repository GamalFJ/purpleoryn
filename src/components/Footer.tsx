import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border/50 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and brand */}
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="Purple Cove Labs" 
              className="h-10 w-10 rounded-full"
            />
            <span className="font-semibold text-foreground">Purple Cove Labs</span>
          </div>
          
          {/* Links */}
          <div className="flex items-center gap-8 text-sm">
            <a 
              href="https://www.fiverr.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Fiverr
            </a>
            <a 
              href="https://www.linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              LinkedIn
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
