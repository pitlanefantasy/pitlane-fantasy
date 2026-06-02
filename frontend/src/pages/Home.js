import React from 'react';

function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>🏍️ PitLane Fantasy</h1>
      <p>El fantasy de MotoGP, Moto2 y Moto3</p>
      <a href="/login">Iniciar sesión</a>
      {' | '}
      <a href="/registro">Registrarse</a>
    </div>
  );
}

export default Home;
