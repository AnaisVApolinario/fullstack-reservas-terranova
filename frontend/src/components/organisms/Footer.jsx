import { Mail, Phone } from "lucide-react";
import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="" className="h-12 w-auto" />
            <span className="font-display font-extrabold text-2xl">Terranova</span>
          </div>
          <p className="mt-4 max-w-sm text-white/75 leading-relaxed">
            Explora el mundo, una experiencia a la vez. Tours guiados por
            Latinoamérica, con fechas claras y reserva en minutos.
          </p>
        </div>

        <div className="md:justify-self-end">
          <h2 className="font-display text-lg font-bold">Contáctanos</h2>
          <ul className="mt-4 space-y-3 text-white/85">
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-sun" />
              <a href="mailto:contacto@terranova.com" className="hover:text-white underline-offset-4 hover:underline">
                contacto@terranova.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-sun" />
              <span>+51 999 999 999</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-5 py-5 text-sm text-white/60">
          © {new Date().getFullYear()} Terranova. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
