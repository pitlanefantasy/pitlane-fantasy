import React, { useState, useEffect } from 'react';
import api, { getUsuario } from '../services/api';

function Ligas() {
  const [ligas, setLigas] = useState([]);
  const [nombreLiga, setNombreLiga] = useState('');
  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    api.get('/ligas/')
      .then(res => setLigas(res.data))
      .catch(() => {});
  }, []);

  const handleCrear = async () => {
    const usuario = getUsuario();
    if (!usuario) return;
    try {
      await api.post('/ligas/', {
        nombre: nombreLiga,
        creador_id: usuario.id,
        temporada: 2026,
        publica: false
      });
      setMensaje('✅ Liga creada correctamente');
      setNombreLiga('');
    } catch (err) {
      setMensaje('❌ Error al crear la liga');
    }
  };

  const handleUnirse = async () => {
    const usuario = getUsuario();
    if (!usuario) return;
    try {
      await api.post(`/ligas/${codigo}/unirse?usuario_id=${usuario.id}`);
      setMensaje('✅ Te has unido a la liga');
      setCodigo('');
    } catch (err) {
      setMensaje('❌ Código incorrecto o ya eres miembro');
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🏆 Ligas</h1>

      <h2>Crear liga privada</h2>
      <input type="text" placeholder="Nombre de la liga"
        value={nombreLiga} onChange={e => setNombreLiga(e.target.value)} />
      <button onClick={handleCrear} style={{ marginLeft: '10px' }}>Crear</button>

      <h2>Unirse a una liga</h2>
      <input type="text" placeholder="Código de invitación"
        value={codigo} onChange={e => setCodigo(e.target.value)} />
      <button onClick={handleUnirse} style={{ marginLeft: '10px' }}>Unirse</button>

      {mensaje && <p>{mensaje}</p>}

      <h2>Ligas públicas</h2>
      {ligas.length === 0 && <p>No hay ligas públicas.</p>}
      <ul>
        {ligas.map(l => (
          <li key={l.id}>
            <strong>{l.nombre}</strong> — Código: {l.codigo}
            {' '}
            <a href={`/ranking/${l.id}`}>Ver ranking</a>
          </li>
        ))}
      </ul>

      <br />
      <a href="/">← Volver al inicio</a>
    </div>
  );
}

export default Ligas;
