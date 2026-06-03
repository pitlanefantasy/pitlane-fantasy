import React, { useState, useEffect } from 'react';
import api, { getUsuario } from '../services/api';

function Equipo() {
  const [proximaCarrera, setProximaCarrera] = useState(null);
  const [pilotos, setPilotos] = useState({ MotoGP: [], Moto2: [], Moto3: [] });
  const [equipo, setEquipo] = useState({
    motogp_oro1_id: '', motogp_oro2_id: '',
    motogp_plata1_id: '', motogp_plata2_id: '',
    moto2_oro1_id: '', moto2_oro2_id: '',
    moto2_plata1_id: '', moto2_plata2_id: '',
    moto3_oro1_id: '', moto3_oro2_id: '',
    moto3_plata1_id: '', moto3_plata2_id: '',
    capitan_id: 'null',
  });
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    // Carga la próxima carrera
    api.get('/carreras/proxima')
      .then(res => setProximaCarrera(res.data));

    // Carga pilotos de cada categoría
    ['MotoGP', 'Moto2', 'Moto3'].forEach(cat => {
      api.get(`/pilotos/categoria/${cat}`)
        .then(res => setPilotos(prev => ({ ...prev, [cat]: res.data })));
    });
  }, []);

  const handleGuardar = async () => {
    const usuario = getUsuario();
    if (!usuario) {
      window.location.href = '/login';
      return;
    }
    try {
      await api.post('/equipos/', {
        ...equipo,
        usuario_id: usuario.id,
        carrera_id: proximaCarrera.id,
        temporada: proximaCarrera.temporada,
        motogp_oro1_id: parseInt(equipo.motogp_oro1_id),
        motogp_oro2_id: parseInt(equipo.motogp_oro2_id),
        motogp_plata1_id: parseInt(equipo.motogp_plata1_id),
        motogp_plata2_id: parseInt(equipo.motogp_plata2_id),
        moto2_oro1_id: parseInt(equipo.moto2_oro1_id),
        moto2_oro2_id: parseInt(equipo.moto2_oro2_id),
        moto2_plata1_id: parseInt(equipo.moto2_plata1_id),
        moto2_plata2_id: parseInt(equipo.moto2_plata2_id),
        moto3_oro1_id: parseInt(equipo.moto3_oro1_id),
        moto3_oro2_id: parseInt(equipo.moto3_oro2_id),
        moto3_plata1_id: parseInt(equipo.moto3_plata1_id),
        moto3_plata2_id: parseInt(equipo.moto3_plata2_id),
        capitan_id: equipo.capitan_id ? parseInt(equipo.capitan_id) : null,
      });
      setMensaje('✅ Equipo guardado correctamente');
    } catch (err) {
      setMensaje('❌ Error al guardar el equipo');
    }
  };

  const renderSelector = (label, campo) => (
    <div style={{ margin: '8px 0' }}>
      <label>{label}: </label>
      <select value={equipo[campo]}
        onChange={e => setEquipo(prev => ({ ...prev, [campo]: e.target.value }))}>
        <option value=''>-- Elige piloto --</option>
        {campo.startsWith('motogp') && pilotos.MotoGP.map(p =>
          <option key={p.id} value={p.id}>{p.nombre} ({p.equipo})</option>)}
        {campo.startsWith('moto2') && pilotos.Moto2.map(p =>
          <option key={p.id} value={p.id}>{p.nombre} ({p.equipo})</option>)}
        {campo.startsWith('moto3') && pilotos.Moto3.map(p =>
          <option key={p.id} value={p.id}>{p.nombre} ({p.equipo})</option>)}
      </select>
    </div>
  );

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🏍️ Mi Equipo</h1>
      {proximaCarrera && (
        <h3>GP: {proximaCarrera.nombre} — {proximaCarrera.fecha}</h3>
      )}

      <h2>MotoGP</h2>
      {renderSelector('🥇 Oro 1', 'motogp_oro1_id')}
      {renderSelector('🥇 Oro 2', 'motogp_oro2_id')}
      {renderSelector('🥈 Plata 1', 'motogp_plata1_id')}
      {renderSelector('🥈 Plata 2', 'motogp_plata2_id')}

      <h2>Moto2</h2>
      {renderSelector('🥇 Oro 1', 'moto2_oro1_id')}
      {renderSelector('🥇 Oro 2', 'moto2_oro2_id')}
      {renderSelector('🥈 Plata 1', 'moto2_plata1_id')}
      {renderSelector('🥈 Plata 2', 'moto2_plata2_id')}

      <h2>Moto3</h2>
      {renderSelector('🥇 Oro 1', 'moto3_oro1_id')}
      {renderSelector('🥇 Oro 2', 'moto3_oro2_id')}
      {renderSelector('🥈 Plata 1', 'moto3_plata1_id')}
      {renderSelector('🥈 Plata 2', 'moto3_plata2_id')}

      <h2>Capitán</h2>
      <div style={{ margin: '8px 0' }}>
        <label>🎖️ Capitán: </label>
        <select value={equipo.capitan_id}
          onChange={e => setEquipo(prev => ({ ...prev, capitan_id: e.target.value }))}>
          <option value=''>-- Elige capitán --</option>
          {[...pilotos.MotoGP, ...pilotos.Moto2, ...pilotos.Moto3].map(p =>
            <option key={p.id} value={p.id}>{p.nombre} ({p.categoria})</option>)}
        </select>
      </div>

      <br />
      <button onClick={handleGuardar} style={{ padding: '10px 30px', fontSize: '16px' }}>
        Guardar Equipo
      </button>
      {mensaje && <p>{mensaje}</p>}

      <br /><br />
      <a href="/">← Volver al inicio</a>
    </div>
  );
}

export default Equipo;