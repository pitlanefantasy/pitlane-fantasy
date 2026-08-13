import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsuario } from '../services/api';

export default function Navbar() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    setUsuario(getUsuario());
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-pit-muted/20">
      <Link to="/" className="font-display font-bold text-xl text-pit-ink tracking-wide">
        PIT<span className="text-pit-red">PLAY</span>
      </Link>
      <div className="flex gap-6 text-sm text-pit-muted font-display uppercase tracking-wide">
        <Link to="/" className="hover:text-pit-ink">Inicio</Link>
        <Link to="/equipo" className="hover:text-pit-ink">Mi equipo</Link>
        <Link to="/pronosticos" className="hover:text-pit-ink">Pronósticos</Link>
        <Link to="/resultados" className="hover:text-pit-ink">Resultados</Link>
        <Link to="/ranking" className="hover:text-pit-ink">Ranking</Link>
        <Link to="/ligas" className="hover:text-pit-ink">Ligas</Link>
      </div>
      {usuario ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-pit-muted">{usuario.nombre || usuario.sub}</span>
          <button onClick={cerrarSesion} className="text-sm font-display uppercase text-pit-red hover:underline">
            Cerrar sesión
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-5">
          <Link to="/login" className="text-sm font-display uppercase text-pit-muted hover:text-pit-ink">
            Iniciar sesión
          </Link>
          <Link to="/registro" className="bg-pit-red text-white text-sm font-display font-bold uppercase px-5 py-2 rounded hover:bg-pit-red/90">
            Crear mi equipo
          </Link>
        </div>
      )}
    </nav>
  );
}
