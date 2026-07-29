import StartLights from './StartLights';
import TrazadoCircuito from './TrazadoCircuito';
import useCountdown from '../hooks/useCountdown';

export default function ProximoGP({ carrera }) {
  const { days, hours, minutes, seconds, ended } = useCountdown(carrera.fecha);
  const circuito = carrera.circuito_detalle;
  const fecha = new Date(carrera.fecha).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
      <div>
        <p className="text-pit-red text-sm font-display font-bold uppercase tracking-widest">
          Próximo GP
        </p>
        <h1 className="font-display font-black text-4xl md:text-5xl text-pit-ink uppercase leading-none mt-2">
          {carrera.circuito}
        </h1>
        <h2 className="font-display text-xl text-pit-muted uppercase mt-1">
          {carrera.pais} — {fecha}
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

        {circuito && (
          <div className="mt-6 flex gap-6 text-pit-muted text-xs font-mono uppercase tracking-wide">
            <span>{circuito.curvas_izquierda}i / {circuito.curvas_derecha}d</span>
            <span>{circuito.velocidad_max_kmh} km/h máx</span>
          </div>
        )}
      </div>

      {circuito && (
        <TrazadoCircuito
          slug={circuito.slug}
          curvasIzquierda={circuito.curvas_izquierda}
          curvasDerecha={circuito.curvas_derecha}
        />
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
