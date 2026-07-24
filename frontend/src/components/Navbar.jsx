import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-pit-asphalt border-b border-pit-grey/20">
      <Link to="/" className="font-display font-bold text-xl text-pit-white tracking-wide">
        PIT<span className="text-pit-red">LANE</span>
      </Link>
      <div className="flex gap-6 text-sm text-pit-grey font-display uppercase tracking-wide">
        <Link to="/" className="hover:text-pit-white">Inicio</Link>
        <Link to="/ranking" className="hover:text-pit-white">Ranking</Link>
        <Link to="/ligas" className="hover:text-pit-white">Ligas</Link>
      </div>
      <Link to="/login" className="bg-pit-red text-white text-sm font-display uppercase px-4 py-2 rounded hover:bg-pit-red/80">
        Iniciar sesión
      </Link>
    </nav>
  );
}
