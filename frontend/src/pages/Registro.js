import React, { useState } from 'react';
import api from '../services/api';

function Registro() {
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegistro = async () => {
    try {
      await api.post('/usuarios/', { email, nombre, password });
      window.location.href = '/login';
    } catch (err) {
      setError('Error al registrarse. El email puede estar en uso.');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>🏍️ PitLane Fantasy</h1>
      <h2>Crear cuenta</h2>
      <input type="text" placeholder="Nombre" value={nombre}
        onChange={e => setNombre(e.target.value)} /><br /><br />
      <input type="email" placeholder="Email" value={email}
        onChange={e => setEmail(e.target.value)} /><br /><br />
      <input type="password" placeholder="Contraseña" value={password}
        onChange={e => setPassword(e.target.value)} /><br /><br />
      <button onClick={handleRegistro}>Registrarse</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <br />
      <a href="/login">¿Ya tienes cuenta? Inicia sesión</a>
    </div>
  );
}

export default Registro;
