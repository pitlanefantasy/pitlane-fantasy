import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Home() {
  const [proximaCarrera, setProximaCarrera] = useState(null);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    api.get('/carreras/proxima')
      .then(res => setProximaCarrera(res.data))
      .catch(() => {});
    const token = localStorage.getItem('token');
    if (token) setUsuario('logueado');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>🏍️ PitLane Fantasy</h1>
      <p>El fantasy de MotoGP, Moto2 y Moto3</p>

      {usuario ? (
        <div>
          <a href="/equipo">Mi Equipo</a>
          {' | '}
          <a href="/ranking">Ranking</a>
          {' | '}
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      ) : (
        <div>
          <a href="/login">Iniciar sesión</a>
          {' | '}
          <a href="/registro">Registrarse</a>
        </div>
      )}

      {proximaCarrera && (
        <div style={{ marginTop: '40px', padding: '20px',
          border: '1px solid #ccc', borderRadius: '8px',
          display: 'inline-block' }}>
          <h2>🏁 Próximo GP</h2>
          <h3>{proximaCarrera.nombre}</h3>
          <p>📍 {proximaCarrera.circuito} — {proximaCarrera.pais}</p>
          <p>📅 {proximaCarrera.fecha}</p>
        </div>
      )}
    </div>
  );
}

export default Home;