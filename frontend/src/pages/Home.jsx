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
    <div className="bg-pit-asphalt min-h-screen">
      <section className="text-center pt-16 pb-10 px-4">
        <h1 className="font-display font-black text-4xl md:text-6xl text-pit-white uppercase tracking-tight">
          Tu equipo. <span className="text-pit-red">Tu parrilla.</span>
        </h1>
        <p className="text-pit-grey mt-3 max-w-md mx-auto">
          Fantasy de MotoGP, Moto2 y Moto3. Elige tus 12 pilotos cada Gran Premio y compite en tu liga.
        </p>
      </section>

      <section className="px-4">
        {loading && <p className="text-center text-pit-grey">Cargando próximo GP...</p>}
        {!loading && proximoGP && <ProximoGP carrera={proximoGP} />}
      </section>

      <section className="text-center py-12">
        <Link to="/registro" className="bg-pit-red text-white font-display uppercase px-8 py-3 rounded text-lg hover:bg-pit-red/80">
          Crear mi equipo
        </Link>
      </section>
    </div>
  );
}
