import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const body = new URLSearchParams();
      body.append('username', email);
      body.append('password', password);
      const response = await api.post('/usuarios/login', body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      localStorage.setItem('token', response.data.access_token);
      if (response.data.aviso) {
        sessionStorage.setItem('avisoLogin', response.data.aviso);
      }
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.detail || 'Email o contraseña incorrectos');
      setCargando(false);
    }
  };

  return (
    <div className="bg-pit-bg min-h-screen flex items-center justify-center px-6">
      <form onSubmit={handleLogin} className="bg-white rounded-lg border border-pit-muted/20 p-8 w-full max-w-sm">
        <h1 className="font-display font-black text-2xl text-pit-ink uppercase text-center">
          Iniciar sesión
        </h1>

        <label className="block text-xs font-display uppercase text-pit-muted mt-6 mb-1">Email</label>
        <input
          type="email" required value={email} onChange={e => setEmail(e.target.value)}
          className="w-full border border-pit-muted/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-pit-red"
        />

        <label className="block text-xs font-display uppercase text-pit-muted mt-4 mb-1">Contraseña</label>
        <input
          type="password" required value={password} onChange={e => setPassword(e.target.value)}
          className="w-full border border-pit-muted/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-pit-red"
        />

        <Link to="/olvide-password" className="block text-right text-xs text-pit-muted mt-2 hover:text-pit-red hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>

        {error && <p className="text-pit-down text-sm mt-3">{error}</p>}

        <button
          type="submit" disabled={cargando}
          className="w-full bg-pit-red text-white font-display font-bold uppercase py-2.5 rounded mt-6 hover:bg-pit-red/90 disabled:opacity-50"
        >
          {cargando ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="text-center text-sm text-pit-muted mt-4">
          ¿No tienes cuenta? <Link to="/registro" className="text-pit-red hover:underline">Regístrate</Link>
        </p>
      </form>
    </div>
  );
}
