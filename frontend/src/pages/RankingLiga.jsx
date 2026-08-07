import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function RankingLiga() {
  const { ligaId } = useParams();
  const [liga, setLiga] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/ligas/${ligaId}`).then(res => setLiga(res.data)).catch(() => {});
    api.get(`/ligas/${ligaId}/ranking`)
      .then(res => setRanking(res.data))
      .catch(() => setError('No se pudo cargar el ranking de esta liga'))
      .finally(() => setLoading(false));
  }, [ligaId]);

  return (
    <div className="bg-pit-bg min-h-screen px-6 md:px-16 py-10">
      <Link to="/ligas" className="text-pit-red text-sm font-display uppercase hover:underline">← Volver a ligas</Link>
      <p className="text-pit-red text-sm font-display font-bold uppercase tracking-widest mt-4">Ranking de liga</p>
      <h1 className="font-display font-black text-3xl text-pit-ink uppercase mt-1">
        {liga ? liga.nombre : 'Cargando...'}
      </h1>

      {loading && <p className="text-pit-muted mt-6">Cargando ranking...</p>}
      {error && <p className="text-pit-down mt-6">{error}</p>}
      {!loading && !error && ranking.length === 0 && (
        <p className="text-pit-muted mt-6">Nadie tiene puntos todavía.</p>
      )}

      {!loading && ranking.length > 0 && (
        <div className="bg-white rounded-lg border border-pit-muted/20 mt-8 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-pit-ink text-white font-display uppercase text-xs tracking-wide">
                <th className="text-left px-6 py-3">Pos</th>
                <th className="text-left px-6 py-3">Jugador</th>
                <th className="text-right px-6 py-3">Puntos</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((entry, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-pit-bg'}>
                  <td className="px-6 py-3 font-mono font-bold text-pit-muted">{i + 1}</td>
                  <td className="px-6 py-3 font-medium text-pit-ink">{entry.usuario}</td>
                  <td className="px-6 py-3 text-right font-mono font-bold text-pit-red">
                    {entry.puntos.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
