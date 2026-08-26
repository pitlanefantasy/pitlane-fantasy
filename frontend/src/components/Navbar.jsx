import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsuario } from '../services/api';

export default function Navbar() {
  const [usuario, setUsuario] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    setUsuario(getUsuario());
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const enlaces = [
    { to: '/', label: 'Inicio' },
    { to: '/equipo', label: 'Mi equipo' },
    { to: '/pronosticos', label: 'Pronósticos' },
    { to: '/resultados', label: 'Resultados' },
    { to: '/ranking', label: 'Ranking' },
    { to: '/ligas', label: 'Ligas' },
  ];

  return (
    <nav className="bg-white border-b border-pit-muted/20 relative">
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-display font-bold text-xl text-pit-ink tracking-wide">
          PIT<span className="text-pit-red">PLAY</span>
        </Link>

        <div className="hidden md:flex gap-6 text-sm text-pit-muted font-display uppercase tracking-wide">
          {enlaces.map(e => (
            <Link key={e.to} to={e.to} className="hover:text-pit-ink">{e.label}</Link>
          ))}
        </div>

        <div className="hidden md:flex items-center">
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
        </div>

        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="md:hidden text-2xl text-pit-ink w-8 h-8 flex items-center justify-center"
          aria-label="Abrir menú"
        >
          {menuAbierto ? '✕' : '☰'}
        </button>
      </div>

      {menuAbierto && (
        <div className="md:hidden border-t border-pit-muted/20 px-6 py-4 flex flex-col gap-4 bg-white">
          {enlaces.map(e => (
            <Link
              key={e.to} to={e.to}
              onClick={() => setMenuAbierto(false)}
              className="text-sm text-pit-muted font-display uppercase tracking-wide hover:text-pit-ink"
            >
              {e.label}
            </Link>
          ))}
          <div className="border-t border-pit-muted/20 pt-4 mt-1">
            {usuario ? (
              <div className="flex flex-col gap-3">
                <span className="text-sm text-pit-muted">{usuario.nombre || usuario.sub}</span>
                <button
                  onClick={cerrarSesion}
                  className="text-sm font-display uppercase text-pit-red hover:underline text-left"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Link
                  to="/login" onClick={() => setMenuAbierto(false)}
                  className="text-sm font-display uppercase text-pit-muted hover:text-pit-ink"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/registro" onClick={() => setMenuAbierto(false)}
                  className="bg-pit-red text-white text-sm font-display font-bold uppercase px-5 py-2 rounded hover:bg-pit-red/90 text-center"
                >
                  Crear mi equipo
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
