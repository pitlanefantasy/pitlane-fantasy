import StartLights from './StartLights';
import TrazadoCircuito from './TrazadoCircuito';
import useCountdown from '../hooks/useCountdown';

export default function ProximoGP({ carrera }) {
  const { days, hours, minutes, seconds, ended } = useCountdown(carrera.fecha);
  const circuito = carrera.circuito_detalle;
  const fecha = new Date(carrera.fecha).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const tieneCurvas = circuito && circuito.curvas_izquierda != null && circuito.curvas_derecha != null;
  const tieneVelocidad = circuito && circuito.velocidad_max_kmh != null;
  const tieneGanadores = circuito && (circuito.ultimo_ganador_motogp || circuito.ultimo_ganador_moto2 || circuito.ultimo_ganador_moto3);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
      <div>
        <p className="text-pit-red text-sm font-display font-bold uppercase tracking-widest">
          Próximo GP
        </p>
        <h1 className="font-display font-black text-4xl md:text-5xl text-pit-ink uppercase leading-none mt-2">
          {carrera.circuito}
        </h1>
        <h2 className="font-display text-xl text-pit-muted uppercase mt-1">
          {circuito?.ubicacion || carrera.pais} — {fecha}
        </h2>
        <div className="bg-pit-ink rounded-lg px-6 py-5 mt-6 inline-block">
          <StartLights active={5} />
          {ended ? (
            <p className="text-pit-red font-mono text-xl">EN CURSO</p>
          ) : (
            <div className="flex gap-8">
              <Time value={days} label="días" />
              <Time value={hours} label="horas" />
              <Time value={minutes} label="min" />
              <Time value={seconds} label="seg" />
            </div>
          )}
        </div>
      </div>

      {circuito && (
        <div className="bg-white rounded-lg border border-pit-muted/20 p-6 w-full md:w-80 flex-shrink-0">
          <p className="text-pit-red text-xs font-display font-bold uppercase tracking-widest">
            Ficha del circuito
          </p>

          {circuito.slug && (
            <div className="flex justify-center mt-4">
              <TrazadoCircuito
                slug={circuito.slug}
                curvasIzquierda={circuito.curvas_izquierda}
                curvasDerecha={circuito.curvas_derecha}
              />
            </div>
          )}

          {(tieneCurvas || tieneVelocidad) && (
            <div className="flex justify-center gap-6 text-pit-ink text-sm font-mono uppercase tracking-wide mt-4 pt-4 border-t border-pit-muted/10">
              {tieneCurvas && (
                <span>
                  <span className="text-pit-up font-bold">{circuito.curvas_izquierda}I</span>
                  {' / '}
                  <span className="text-pit-down font-bold">{circuito.curvas_derecha}D</span>
                </span>
              )}
              {tieneVelocidad && <span className="font-bold">{circuito.velocidad_max_kmh} km/h máx</span>}
            </div>
          )}

          {tieneGanadores && (
            <div className="mt-4 pt-4 border-t border-pit-muted/10">
              <p className="text-pit-muted text-xs font-display uppercase tracking-widest mb-2">
                Último ganador
              </p>
              <div className="space-y-1 text-sm">
                {circuito.ultimo_ganador_motogp && (
                  <p><span className="text-pit-muted">MotoGP:</span> <span className="font-bold text-pit-ink">{circuito.ultimo_ganador_motogp}</span></p>
                )}
                {circuito.ultimo_ganador_moto2 && (
                  <p><span className="text-pit-muted">Moto2:</span> <span className="font-bold text-pit-ink">{circuito.ultimo_ganador_moto2}</span></p>
                )}
                {circuito.ultimo_ganador_moto3 && (
                  <p><span className="text-pit-muted">Moto3:</span> <span className="font-bold text-pit-ink">{circuito.ultimo_ganador_moto3}</span></p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Time({ value, label }) {
  return (
    <div>
      <div className="text-4xl font-mono font-bold text-white leading-none">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs text-white/50 uppercase tracking-wide mt-1">{label}</div>
    </div>
  );
}
