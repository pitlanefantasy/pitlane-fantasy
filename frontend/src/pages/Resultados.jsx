import { useState, useEffect } from 'react';
import api from '../services/api';

const TEMPORADA = 2026;
const CATEGORIAS = ['MotoGP', 'Moto2', 'Moto3'];

export default function Resultados() {
  const [carreras, setCarreras] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/resultados/publico/temporada/${TEMPORADA}`)
      .then(res => {
        setCarreras(res.data);
        const conResultado = res.data.filter(c => c.tiene_resultado);
        setSeleccionada(conResultado.length ? conResultado[conResultado.length - 1].carrera_id : res.data[0]?.carrera_id);
      })
      .finally(() => setLoading(false));
  }, []);

  const carrera = carreras.find(c => c.carrera_id === seleccionada);

  return (
    <div className="bg-pit-bg min-h-screen px-6 md:px-16 py-12">
      <p className="text-pit-red text-sm font-display font-bold uppercase tracking-widest">Resultados</p>
      <h1 className="font-display font-black text-3xl md:text-4xl text-pit-ink uppercase mt-2">
        Temporada {TEMPORADA}
      </h1>

      {loading && <p className="text-pit-muted mt-8">Cargando...</p>}

      {!loading && (
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <div className="lg:w-72 flex-shrink-0 space-y-1 max-h-[70vh] overflow-y-auto">
            {carreras.map(c => (
              <button
                key={c.carrera_id}
                onClick={() => setSeleccionada(c.carrera_id)}
                className={`w-full text-left px-4 py-2.5 rounded text-sm font-display uppercase tracking-wide flex justify-between items-center ${
                  seleccionada === c.carrera_id
                    ? 'bg-pit-red text-white'
                    : 'text-pit-muted hover:bg-white'
                }`}
              >
                <span>{c.nombre}</span>
                {c.tiene_resultado && (
                  <span className={`w-2 h-2 rounded-full ${seleccionada === c.carrera_id ? 'bg-white' : 'bg-pit-up'}`} />
                )}
              </button>
            ))}
          </div>

          <div className="flex-1">
            {carrera && (
              <>
                <h2 className="font-display font-bold text-2xl text-pit-ink uppercase">{carrera.nombre}</h2>
                <p className="text-pit-muted text-sm mt-1">
                  {carrera.circuito}, {carrera.pais} — {new Date(carrera.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>

                {!carrera.tiene_resultado ? (
                  <p className="text-pit-muted text-sm mt-8 bg-white border border-pit-muted/20 rounded-lg p-6">
                    Resultado pendiente — se publicará cuando se dispute la carrera.
                  </p>
                ) : (
                  <div className="mt-6 space-y-8">
                    {CATEGORIAS.map(cat => {
                      const pilotosCategoria = carrera.resultados
                        .filter(r => r.categoria === cat)
                        .sort((a, b) => (a.posicion_carrera ?? 999) - (b.posicion_carrera ?? 999));
                      if (!pilotosCategoria.length) return null;
                      return (
                        <div key={cat}>
                          <h3 className="font-display text-sm uppercase tracking-widest text-pit-muted mb-3">{cat}</h3>
                          <div className="bg-white rounded-lg border border-pit-muted/20 divide-y divide-pit-muted/10">
                            {pilotosCategoria.map(r => (
                              <div key={r.piloto_id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-pit-muted w-6">
                                    {r.abandono ? '—' : r.posicion_carrera ?? '—'}
                                  </span>
                                  <span className="text-pit-ink font-medium">{r.piloto_nombre}</span>
                                  {r.hizo_pole && <span className="text-pit-best text-xs font-bold">POLE</span>}
                                  {r.vuelta_rapida && <span className="text-pit-up text-xs font-bold">VR</span>}
                                  {r.abandono && <span className="text-pit-down text-xs font-bold">DNF</span>}
                                </div>
                                <span className="font-mono font-bold text-pit-ink">{r.puntos_total} pts</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
