import { useState, useEffect } from 'react';
import api from '../services/api';

const TEMPORADA = 2026;
const CATEGORIAS = ['MotoGP', 'Moto2', 'Moto3'];

const PUNTOS_CARRERA = {1:25,2:20,3:16,4:13,5:11,6:10,7:9,8:8,9:7,10:6,11:5,12:4,13:3,14:2,15:1};
const PUNTOS_SPRINT = {1:12,2:9,3:7,4:6,5:5,6:4,7:3,8:2,9:1};

function puntosCarreraDe(r) {
  if (r.abandono) return -5;
  let p = PUNTOS_CARRERA[r.posicion_carrera] || 0;
  if (r.vuelta_rapida && r.posicion_carrera && r.posicion_carrera <= 15) p += 3;
  return p;
}

function puntosSprintDe(r) {
  if (!r.posicion_sprint) return 0;
  return PUNTOS_SPRINT[r.posicion_sprint] || 0;
}

export default function Resultados() {
  const [carreras, setCarreras] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const [categoria, setCategoria] = useState('MotoGP');
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
  const pilotosCategoria = carrera
    ? carrera.resultados
        .filter(r => r.categoria === categoria)
        .sort((a, b) => (a.posicion_carrera ?? 999) - (b.posicion_carrera ?? 999))
    : [];

  const esMotoGP = categoria === 'MotoGP';
  const colsGrid = esMotoGP ? 'grid-cols-[1fr_7rem_7rem_5rem]' : 'grid-cols-[3rem_1fr_5rem]';

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

                <div className="flex gap-2 mt-6 border-b border-pit-muted/20">
                  {CATEGORIAS.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoria(cat)}
                      className={`px-4 py-2 text-sm font-display uppercase tracking-wide border-b-2 -mb-px ${
                        categoria === cat
                          ? 'border-pit-red text-pit-ink'
                          : 'border-transparent text-pit-muted hover:text-pit-ink'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {!carrera.tiene_resultado ? (
                  <p className="text-pit-muted text-sm mt-8 bg-white border border-pit-muted/20 rounded-lg p-6">
                    Resultado pendiente — se publicará cuando se dispute la carrera.
                  </p>
                ) : pilotosCategoria.length === 0 ? (
                  <p className="text-pit-muted text-sm mt-8 bg-white border border-pit-muted/20 rounded-lg p-6">
                    Sin resultados cargados todavía para {categoria} en esta carrera.
                  </p>
                ) : (
                  <div className="mt-6 bg-white rounded-lg border border-pit-muted/20 overflow-hidden">
                    <div className={`grid ${colsGrid} gap-2 px-4 py-2 text-xs font-display uppercase tracking-wide text-pit-muted border-b border-pit-muted/10`}>
                      {!esMotoGP && <span>Pos.</span>}
                      <span>Piloto</span>
                      {esMotoGP && <span className="text-center">Sprint</span>}
                      {esMotoGP && <span className="text-center">Carrera</span>}
                      <span className="text-right">Total</span>
                    </div>
                    <div className="divide-y divide-pit-muted/10">
                      {pilotosCategoria.map(r => {
                        const ptsCarrera = puntosCarreraDe(r);
                        const ptsSprint = puntosSprintDe(r);
                        return (
                          <div
                            key={r.piloto_id}
                            className={`grid ${colsGrid} gap-2 items-center px-4 py-3 text-sm`}
                          >
                            {!esMotoGP && (
                              <span className={`font-display font-bold text-base ${r.abandono ? 'text-pit-down' : 'text-pit-ink'}`}>
                                {r.abandono ? '—' : r.posicion_carrera ?? '—'}
                              </span>
                            )}
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-pit-ink font-bold text-base truncate">{r.piloto_nombre}</span>
                              {r.hizo_pole && <span className="text-pit-best text-xs font-bold flex-shrink-0">POLE</span>}
                              {r.vuelta_rapida && <span className="text-pit-up text-xs font-bold flex-shrink-0">VR</span>}
                              {r.abandono && <span className="text-pit-down text-xs font-bold flex-shrink-0">DNF</span>}
                            </div>
                            {esMotoGP && (
                              <span className="font-mono text-pit-muted text-center text-xs">
                                {r.posicion_sprint ? `P${r.posicion_sprint} · ${ptsSprint}pts` : '—'}
                              </span>
                            )}
                            {esMotoGP && (
                              <span className="font-mono text-pit-muted text-center text-xs">
                                {r.abandono ? `DNF · ${ptsCarrera}pts` : `P${r.posicion_carrera} · ${ptsCarrera}pts`}
                              </span>
                            )}
                            <span className="font-mono font-bold text-base text-pit-ink text-right">{r.puntos_total} pts</span>
                          </div>
                        );
                      })}
                    </div>
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
