import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProximoGP from '../components/ProximoGP';
import AvisoVerificacion from '../components/AvisoVerificacion';

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
    <>
      <AvisoVerificacion />
      <div className="bg-pit-bg min-h-screen px-6 md:px-16 pt-10 pb-16">
        <p className="font-display text-xl md:text-2xl text-pit-ink max-w-2xl">
          El fantasy que une <span className="text-pit-red font-bold">MotoGP, Moto2 y Moto3</span> en un solo equipo.
        </p>
        <p className="text-pit-muted text-sm max-w-xl mt-2">
          Arma tu equipo con pilotos de MotoGP, Moto2 y Moto3, y pronostica quién será campeón, quién hará más poles y quién será el mejor rookie. Compite con tus amigos, carrera a carrera.
        </p>

        <section className="pt-8">
          {loading && <p className="text-pit-muted">Cargando próximo GP...</p>}
          {!loading && proximoGP && <ProximoGP carrera={proximoGP} />}
        </section>

        <section className="mt-16 border-t border-pit-muted/20 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 border border-pit-muted/20">
              <p className="text-pit-red text-xs font-display uppercase tracking-widest">Tu equipo</p>
              <p className="font-display font-bold text-lg text-pit-ink mt-1">Se arma una vez, evoluciona contigo</p>
              <p className="text-pit-muted text-sm mt-2">12 pilotos, fabricante y equipo de MotoGP — hasta 5 cambios por Gran Premio, sin empezar de cero cada semana.</p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-pit-muted/20">
              <p className="text-pit-red text-xs font-display uppercase tracking-widest">Toda la temporada</p>
              <p className="font-display font-bold text-lg text-pit-ink mt-1">Pronósticos de temporada</p>
              <p className="text-pit-muted text-sm mt-2">Campeón, poles, victorias y rookie — se suman a tu puntuación total del año.</p>
            </div>
          </div>
          <Link to="/reglas" className="inline-block text-pit-red font-display text-sm uppercase tracking-wide mt-6 hover:underline">
            Ver todas las reglas del juego →
          </Link>
        </section>
      </div>
    </>
  );
}
