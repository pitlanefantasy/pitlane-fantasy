import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Liga global ID 1
    api.get('/ligas/1/ranking')
      .then(res => setRanking(res.data))
      .catch(() => setError('No se pudo cargar el ranking'));
  }, []);

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🏆 Ranking Global</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {ranking.length === 0 && !error && <p>No hay datos aún.</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#e8631a', color: 'white' }}>
            <th style={{ padding: '10px' }}>Pos</th>
            <th style={{ padding: '10px' }}>Usuario</th>
            <th style={{ padding: '10px' }}>Puntos</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((entry, index) => (
            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f5f5f5' }}>
              <td style={{ padding: '10px', textAlign: 'center' }}>{index + 1}</td>
              <td style={{ padding: '10px' }}>{entry.usuario}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>{entry.puntos}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <a href="/">← Volver al inicio</a>
    </div>
  );
}

export default Ranking;

