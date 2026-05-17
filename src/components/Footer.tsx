import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border/30 mt-8 py-10 px-4 sm:px-6 pb-24 md:pb-10">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-3">
              <img src={logo} alt="Purple Cove Labs" className="h-10 w-10 rounded-full" />
              <span className="font-bold text-foreground">Purple Cove Labs</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              Sistemas que automatizan tu negocio y aumentan tus ingresos.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-foreground mb-3">
              Navegación
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary">Inicio</Link></li>
              <li><Link to="/portafolio" className="hover:text-primary">Portafolio</Link></li>
              <li><Link to="/apps" className="hover:text-primary">Apps</Link></li>
              <li><Link to="/demos" className="hover:text-primary">Demos</Link></li>
              <li><Link to="/planes" className="hover:text-primary">Planes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-foreground mb-3">
              Contacto
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="mailto:gamal.jastram@purpleoryn.com" className="hover:text-primary">
                  gamal.jastram@purpleoryn.com
                </a>
              </li>
              <li>
                <a href="mailto:purplecoves@gmail.com" className="hover:text-primary">
                  purplecoves@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://cal.com/purple-cove-labs/20-min-cafe-virtual"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  Agendar llamada
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground border-t border-border/30 pt-6">
          © 2026 Purple Cove Labs · Impulsado por Oryn AI · Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
