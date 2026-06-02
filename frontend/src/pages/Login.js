import React, { useState } from 'react';
import api from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);
      const response = await api.post('/usuarios/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      localStorage.setItem('token', response.data.access_token);
      window.location.href = '/';
    } catch (err) {
      setError('Email o contraseña incorrectos');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>🏍️ PitLane Fantasy</h1>
      <h2>Iniciar sesión</h2>
      <input type="email" placeholder="Email" value={email}
        onChange={e => setEmail(e.target.value)} /><br /><br />
      <input type="password" placeholder="Contraseña" value={password}
        onChange={e => setPassword(e.target.value)} /><br /><br />
      <button onClick={handleLogin}>Entrar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <br />
      <a href="/registro">¿No tienes cuenta? Regístrate</a>
    </div>
  );
}

export default Login;
