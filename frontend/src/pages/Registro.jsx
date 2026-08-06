import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await api.post('/usuarios/', { email, nombre, password });
      window.location.href = '/login';
    } catch (err) {
      setError('Error al registrarse. El email puede estar en uso.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-pit-bg min-h-screen flex items-center justify-center px-6">
      <form onSubmit={handleRegistro} className="bg-white rounded-lg border border-pit-muted/20 p-8 w-full max-w-sm">
        <h1 className="font-display font-black text-2xl text-pit-ink uppercase text-center">
          Crear cuenta
        </h1>

        <label className="block text-xs font-display uppercase text-pit-muted mt-6 mb-1">Nombre</label>
        <input
          type="text" required value={nombre} onChange={e => setNombre(e.target.value)}
          className="w-full border border-pit-muted/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-pit-red"
        />

        <label className="block text-xs font-display uppercase text-pit-muted mt-4 mb-1">Email</label>
        <input
          type="email" required value={email} onChange={e => setEmail(e.target.value)}
          className="w-full border border-pit-muted/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-pit-red"
        />

        <label className="block text-xs font-display uppercase text-pit-muted mt-4 mb-1">Contraseña</label>
        <input
          type="password" required value={password} onChange={e => setPassword(e.target.value)}
          className="w-full border border-pit-muted/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-pit-red"
        />

        {error && <p className="text-pit-down text-sm mt-3">{error}</p>}

        <button
          type="submit" disabled={cargando}
          className="w-full bg-pit-red text-white font-display font-bold uppercase py-2.5 rounded mt-6 hover:bg-pit-red/90 disabled:opacity-50"
        >
          {cargando ? 'Creando cuenta...' : 'Registrarse'}
        </button>

        <p className="text-center text-sm text-pit-muted mt-4">
          ¿Ya tienes cuenta? <Link to="/login" className="text-pit-red hover:underline">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}
