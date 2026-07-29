import { useEffect, useRef, useState } from 'react';
import trazados from '../data/trazados';

export default function TrazadoCircuito({ slug, curvasIzquierda, curvasDerecha }) {
  const total = (curvasIzquierda || 0) + (curvasDerecha || 0);
  const pathRef = useRef(null);
  const [puntos, setPuntos] = useState([]);
  const pathD = trazados[slug];

  useEffect(() => {
    if (!pathRef.current || !total) return;
    const length = pathRef.current.getTotalLength();
    const nuevos = Array.from({ length: total }, (_, i) => {
      const p = pathRef.current.getPointAtLength((i / total) * length);
      return { x: p.x, y: p.y, n: i + 1 };
    });
    setPuntos(nuevos);
  }, [pathD, total]);

  // Si no tenemos un trazado dibujado a mano para este circuito, no mostramos
  // nada en vez de un óvalo genérico sin sentido.
  if (!pathD || !total) return null;

  return (
    <div className="text-right">
      <svg width="240" height="180" viewBox="0 0 300 200">
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="#E4472B"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {puntos.map((p) => (
          <g key={p.n}>
            <circle cx={p.x} cy={p.y} r="8" fill="#fff" stroke="#E4472B" strokeWidth="1.5" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="#12141A" fontFamily="'JetBrains Mono', monospace">
              {p.n}
            </text>
          </g>
        ))}
      </svg>
      <p className="text-xs text-pit-muted uppercase tracking-wide mt-1 font-display">
        Trazado esquemático · {total} curvas
      </p>
    </div>
  );
}
