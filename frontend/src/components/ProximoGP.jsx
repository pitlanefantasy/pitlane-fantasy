import StartLights from './StartLights';
import useCountdown from '../hooks/useCountdown';

export default function ProximoGP({ carrera }) {
  const { days, hours, minutes, seconds, ended } = useCountdown(carrera.fecha);

  return (
    <div className="bg-pit-asphalt-light rounded-lg p-6 max-w-md mx-auto text-center border border-pit-grey/20">
      <StartLights active={5} />
      <p className="text-pit-grey text-sm uppercase tracking-wider font-display">Próximo GP</p>
      <h2 className="text-2xl font-display font-bold text-pit-white uppercase tracking-wide mt-1">
        {carrera.circuito}
      </h2>
      <p className="text-pit-grey text-sm">{carrera.pais}</p>

      {ended ? (
        <p className="text-pit-red font-mono text-xl mt-4">EN CURSO</p>
      ) : (
        <div className="flex justify-center gap-4 mt-4 font-mono text-pit-yellow">
          <Time value={days} label="d" />
          <Time value={hours} label="h" />
          <Time value={minutes} label="m" />
          <Time value={seconds} label="s" />
        </div>
      )}
    </div>
  );
}

function Time({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold">{String(value).padStart(2, '0')}</div>
      <div className="text-xs text-pit-grey">{label}</div>
    </div>
  );
}
