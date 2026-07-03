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
    capitan_motogp_id: '',
    capitan_moto2_id: '',
    capitan_moto3_id: '',
  });
  const [mensaje, setMensaje] = useState('');
  const [presupuestoUsado, setPresupuestoUsado] = useState(0);
  const PRESUPUESTO = 60;

  useEffect(() => {
    api.get('/carreras/proxima')
      .then(res => setProximaCarrera(res.data));
    ['MotoGP', 'Moto2', 'Moto3'].forEach(cat => {
      api.get(`/pilotos/categoria/${cat}`)
        .then(res => setPilotos(prev => ({ ...prev, [cat]: res.data })));
    });
  }, []);

  useEffect(() => {
    const ids = [
      equipo.motogp_oro1_id, equipo.motogp_oro2_id,
      equipo.motogp_plata1_id, equipo.motogp_plata2_id,
      equipo.moto2_oro1_id, equipo.moto2_oro2_id,
      equipo.moto2_plata1_id, equipo.moto2_plata2_id,
      equipo.moto3_oro1_id, equipo.moto3_oro2_id,
      equipo.moto3_plata1_id, equipo.moto3_plata2_id,
    ].filter(id => id !== '');

    const todosLosPilotos = [...pilotos.MotoGP, ...pilotos.Moto2, ...pilotos.Moto3];
    const total = ids.reduce((sum, id) => {
      const p = todosLosPilotos.find(p => String(p.id) === String(id));
      return sum + (p ? parseFloat(p.precio) : 0);
    }, 0);
    setPresupuestoUsado(total);
  }, [equipo, pilotos]);

  const handleGuardar = async () => {
    const usuario = getUsuario();
    if (!usuario) { window.location.href = '/login'; return; }

    const camposObligatorios = [
      'motogp_oro1_id', 'motogp_oro2_id', 'motogp_plata1_id', 'motogp_plata2_id',
      'moto2_oro1_id', 'moto2_oro2_id', 'moto2_plata1_id', 'moto2_plata2_id',
      'moto3_oro1_id', 'moto3_oro2_id', 'moto3_plata1_id', 'moto3_plata2_id',
    ];
    const faltantes = camposObligatorios.filter(c => !equipo[c]);
    if (faltantes.length > 0) {
      setMensaje('❌ Debes seleccionar los 12 pilotos antes de guardar');
      return;
    }

    try {
      await api.post('/equipos/', {
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
        capitan_motogp_id: equipo.capitan_motogp_id ? parseInt(equipo.capitan_motogp_id) : null,
        capitan_moto2_id: equipo.capitan_moto2_id ? parseInt(equipo.capitan_moto2_id) : null,
        capitan_moto3_id: equipo.capitan_moto3_id ? parseInt(equipo.capitan_moto3_id) : null,
      });
      setMensaje('✅ Equipo guardado correctamente');
    } catch (err) {
      const detalle = err.response?.data?.detail || 'Error al guardar el equipo';
      setMensaje(`❌ ${detalle}`);
    }
  };

  const renderSelector = (label, campo, categoria) => (
    <div style={{ margin: '8px 0' }}>
      <label>{label}: </label>
      <select value={equipo[campo]}
        onChange={e => setEquipo(prev => ({ ...prev, [campo]: e.target.value }))}>
        <option value=''>-- Elige piloto --</option>
        {pilotos[categoria].map(p =>
          <option key={p.id} value={p.id}>
            {p.nombre} ({p.equipo}) — 💰{p.precio}M
          </option>)}
      </select>
    </div>
  );

  const renderCapitan = (label, campo, categoria) => {
    const pilotosCategoria = [
      equipo[`${categoria}_oro1_id`],
      equipo[`${categoria}_oro2_id`],
      equipo[`${categoria}_plata1_id`],
      equipo[`${categoria}_plata2_id`],
    ].filter(id => id !== '');

    const cat = categoria === 'motogp' ? 'MotoGP' : categoria === 'moto2' ? 'Moto2' : 'Moto3';
    const pilotosFiltrados = pilotos[cat].filter(p =>
      pilotosCategoria.includes(String(p.id))
    );

    return (
      <div style={{ margin: '8px 0' }}>
        <label>{label}: </label>
        <select value={equipo[campo]}
          onChange={e => setEquipo(prev => ({ ...prev, [campo]: e.target.value }))}>
          <option value=''>-- Sin capitán --</option>
          {pilotosFiltrados.map(p =>
            <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>
      </div>
    );
  };

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🏍️ Mi Equipo</h1>

      <div style={{
        padding: '10px 20px',
        backgroundColor: presupuestoUsado > PRESUPUESTO ? '#fddede' : '#d4edda',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        💰 Presupuesto: {(PRESUPUESTO - presupuestoUsado).toFixed(1)}M restantes
        ({presupuestoUsado.toFixed(1)}M / {PRESUPUESTO}M usados)
      </div>

      {proximaCarrera && (
        <h3>GP: {proximaCarrera.nombre} — {proximaCarrera.fecha}</h3>
      )}

      <h2>MotoGP</h2>
      {renderSelector('🥇 Oro 1', 'motogp_oro1_id', 'MotoGP')}
      {renderSelector('🥇 Oro 2', 'motogp_oro2_id', 'MotoGP')}
      {renderSelector('🥈 Plata 1', 'motogp_plata1_id', 'MotoGP')}
      {renderSelector('🥈 Plata 2', 'motogp_plata2_id', 'MotoGP')}
      {renderCapitan('🎖️ Capitán MotoGP', 'capitan_motogp_id', 'motogp')}

      <h2>Moto2</h2>
      {renderSelector('🥇 Oro 1', 'moto2_oro1_id', 'Moto2')}
      {renderSelector('🥇 Oro 2', 'moto2_oro2_id', 'Moto2')}
      {renderSelector('🥈 Plata 1', 'moto2_plata1_id', 'Moto2')}
      {renderSelector('🥈 Plata 2', 'moto2_plata2_id', 'Moto2')}
      {renderCapitan('🎖️ Capitán Moto2', 'capitan_moto2_id', 'moto2')}

      <h2>Moto3</h2>
      {renderSelector('🥇 Oro 1', 'moto3_oro1_id', 'Moto3')}
      {renderSelector('🥇 Oro 2', 'moto3_oro2_id', 'Moto3')}
      {renderSelector('🥈 Plata 1', 'moto3_plata1_id', 'Moto3')}
      {renderSelector('🥈 Plata 2', 'moto3_plata2_id', 'Moto3')}
      {renderCapitan('🎖️ Capitán Moto3', 'capitan_moto3_id', 'moto3')}

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