import logo from "@/assets/logo.png";

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <img 
              src={logo} 
              alt="Purple Cove Labs Logo" 
              className="h-12 w-12 rounded-full transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-lg font-bold text-foreground hidden sm:block">
              Purple Cove Labs
            </span>
          </a>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
              Services
            </a>
            <a href="#portfolio" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
              Portfolio
            </a>
            <a href="#process" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
              Process
            </a>
            <a href="#why-us" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
              Why Us
            </a>
          </div>

          <a 
            href="https://www.fiverr.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="glass-card px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary/60 transition-all duration-300"
          >
            Hire Me
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
