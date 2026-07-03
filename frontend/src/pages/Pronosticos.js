import React, { useState, useEffect } from 'react';
import api, { getUsuario } from '../services/api';

function Pronosticos() {
  const [pilotos, setPilotos] = useState({ MotoGP: [], Moto2: [], Moto3: [] });
  const [rookies, setRookies] = useState({ MotoGP: [], Moto2: [], Moto3: [] });
  const [pronosticos, setPronosticos] = useState({
    campeon_motogp_id: '', segundo_motogp_id: '', tercero_motogp_id: '',
    campeon_moto2_id: '', segundo_moto2_id: '', tercero_moto2_id: '',
    campeon_moto3_id: '', segundo_moto3_id: '', tercero_moto3_id: '',
    poleman_motogp_id: '', poleman_moto2_id: '', poleman_moto3_id: '',
    victorias_motogp_id: '', victorias_moto2_id: '', victorias_moto3_id: '',
    rookie_motogp_id: '', rookie_moto2_id: '', rookie_moto3_id: '',
    caidas_motogp_id: '', caidas_moto2_id: '', caidas_moto3_id: '',
  });
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    ['MotoGP', 'Moto2', 'Moto3'].forEach(cat => {
      api.get(`/pilotos/categoria/${cat}`)
        .then(res => setPilotos(prev => ({ ...prev, [cat]: res.data })));
      api.get(`/pilotos/rookies/${cat}`)
        .then(res => setRookies(prev => ({ ...prev, [cat]: res.data })))
        .catch(() => {});
    });
  }, []);

  const handleGuardar = async () => {
    const usuario = getUsuario();
    if (!usuario) { window.location.href = '/login'; return; }
    try {
      await api.post('/pronosticos/', {
        usuario_id: usuario.id,
        temporada: 2026,
        ...Object.fromEntries(
          Object.entries(pronosticos).map(([k, v]) => [k, v ? parseInt(v) : null])
        )
      });
      setMensaje('✅ Pronósticos guardados correctamente');
    } catch (err) {
      const detalle = err.response?.data?.detail || 'Error al guardar';
      setMensaje(`❌ ${detalle}`);
    }
  };

  const sel = (label, campo, lista, puntos) => (
    <div style={{ margin: '8px 0' }}>
      <label>{label} (+{puntos} pts): </label>
      <select value={pronosticos[campo]}
        onChange={e => setPronosticos(prev => ({ ...prev, [campo]: e.target.value }))}>
        <option value=''>-- Elige piloto --</option>
        {lista.map(p =>
          <option key={p.id} value={p.id}>{p.nombre}</option>)}
      </select>
    </div>
  );

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🔮 Pronósticos de Temporada 2026</h1>
      <p>Se eligen una sola vez al inicio de la temporada.</p>

      <h2>🏆 Campeones</h2>
      {sel('🥇 Campeón MotoGP', 'campeon_motogp_id', pilotos.MotoGP, 150)}
      {sel('🥈 2º MotoGP', 'segundo_motogp_id', pilotos.MotoGP, 80)}
      {sel('🥉 3º MotoGP', 'tercero_motogp_id', pilotos.MotoGP, 50)}
      {sel('🥇 Campeón Moto2', 'campeon_moto2_id', pilotos.Moto2, 100)}
      {sel('🥈 2º Moto2', 'segundo_moto2_id', pilotos.Moto2, 60)}
      {sel('🥉 3º Moto2', 'tercero_moto2_id', pilotos.Moto2, 40)}
      {sel('🥇 Campeón Moto3', 'campeon_moto3_id', pilotos.Moto3, 100)}
      {sel('🥈 2º Moto3', 'segundo_moto3_id', pilotos.Moto3, 60)}
      {sel('🥉 3º Moto3', 'tercero_moto3_id', pilotos.Moto3, 40)}

      <h2>⚡ Más Poles</h2>
      {sel('Más poles MotoGP', 'poleman_motogp_id', pilotos.MotoGP, 60)}
      {sel('Más poles Moto2', 'poleman_moto2_id', pilotos.Moto2, 40)}
      {sel('Más poles Moto3', 'poleman_moto3_id', pilotos.Moto3, 40)}

      <h2>🏁 Más Victorias</h2>
      {sel('Más victorias MotoGP', 'victorias_motogp_id', pilotos.MotoGP, 60)}
      {sel('Más victorias Moto2', 'victorias_moto2_id', pilotos.Moto2, 40)}
      {sel('Más victorias Moto3', 'victorias_moto3_id', pilotos.Moto3, 40)}

      <h2>🔰 Mejor Rookie</h2>
      {sel('Mejor rookie MotoGP', 'rookie_motogp_id', rookies.MotoGP, 50)}
      {sel('Mejor rookie Moto2', 'rookie_moto2_id', rookies.Moto2, 35)}
      {sel('Mejor rookie Moto3', 'rookie_moto3_id', rookies.Moto3, 35)}

      <h2>💥 Más Caídas</h2>
      {sel('Más caídas MotoGP', 'caidas_motogp_id', pilotos.MotoGP, 30)}
      {sel('Más caídas Moto2', 'caidas_moto2_id', pilotos.Moto2, 20)}
      {sel('Más caídas Moto3', 'caidas_moto3_id', pilotos.Moto3, 20)}

      <br />
      <button onClick={handleGuardar} style={{ padding: '10px 30px', fontSize: '16px' }}>
        Guardar Pronósticos
      </button>
      {mensaje && <p>{mensaje}</p>}
      <br /><br />
      <a href="/">← Volver al inicio</a>
    </div>
  );
}

export default Pronosticos;