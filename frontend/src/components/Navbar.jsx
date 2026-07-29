import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-pit-muted/20">
      <Link to="/" className="font-display font-bold text-xl text-pit-ink tracking-wide">
        PIT<span className="text-pit-red">PLAY</span>
      </Link>
      <div className="flex gap-6 text-sm text-pit-muted font-display uppercase tracking-wide">
        <Link to="/" className="hover:text-pit-ink">Inicio</Link>
        <Link to="/ranking" className="hover:text-pit-ink">Ranking</Link>
        <Link to="/ligas" className="hover:text-pit-ink">Ligas</Link>
      </div>
      <div className="flex items-center gap-5">
        <Link to="/login" className="text-sm font-display uppercase text-pit-muted hover:text-pit-ink">
          Iniciar sesión
        </Link>
        <Link to="/registro" className="bg-pit-red text-white text-sm font-display font-bold uppercase px-5 py-2 rounded hover:bg-pit-red/90">
          Crear mi equipo
        </Link>
      </div>
    </nav>
  );
}
