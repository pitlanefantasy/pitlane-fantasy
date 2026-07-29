import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProximoGP from '../components/ProximoGP';

export default function Home() {
  const [proximoGP, setProximoGP] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/carreras/proxima')
      .then(res => setProximoGP(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-pit-bg min-h-screen px-6 md:px-16 pt-10 pb-16">

      <p className="font-display text-xl md:text-2xl text-pit-ink max-w-2xl">
        El fantasy que une <span className="text-pit-red font-bold">MotoGP, Moto2 y Moto3</span> en un solo equipo.
      </p>
      <p className="text-pit-muted text-sm max-w-xl mt-2">
        Pronostica al campeón, al mejor rookie, quién hará más poles y quién se llevará más caídas. Entra y vive el mejor fantasy de motos.
      </p>

      <section className="pt-8">
        {loading && <p className="text-pit-muted">Cargando próximo GP...</p>}
        {!loading && proximoGP && <ProximoGP carrera={proximoGP} />}
      </section>

      <section className="mt-16 border-t border-pit-muted/20 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 border border-pit-muted/20">
            <p className="text-pit-red text-xs font-display uppercase tracking-widest">Cada Gran Premio</p>
            <p className="font-display font-bold text-lg text-pit-ink mt-1">Tu equipo semanal</p>
            <p className="text-pit-muted text-sm mt-2">2 Oro + 2 Plata por categoría, un capitán y presupuesto que sube y baja según resultados.</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-pit-muted/20">
            <p className="text-pit-red text-xs font-display uppercase tracking-widest">Toda la temporada</p>
            <p className="font-display font-bold text-lg text-pit-ink mt-1">Pronósticos de temporada</p>
            <p className="text-pit-muted text-sm mt-2">Campeón, poles, victorias, rookie y caídas — se suman a tu puntuación total del año.</p>
          </div>
        </div>
        <Link to="/reglas" className="inline-block text-pit-red font-display text-sm uppercase tracking-wide mt-6 hover:underline">
          Ver todas las reglas del juego →
        </Link>
      </section>
    </div>
  );
}
