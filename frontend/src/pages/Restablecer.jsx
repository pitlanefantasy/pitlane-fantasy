import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

function extraerError(err) {
  const detail = err.response?.data?.detail;
  if (!detail) return 'No se pudo restablecer la contraseña';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail.map(e => e.msg.replace('Value error, ', '')).join('. ');
  }
  return 'No se pudo restablecer la contraseña';
}

export default function Restablecer() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setCargando(true);
    try {
      await api.post('/usuarios/restablecer-password', { token, password_nueva: password });
      setExito(true);
    } catch (err) {
      setError(extraerError(err));
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-pit-bg min-h-screen flex items-center justify-center px-6">
      <div className="bg-white rounded-lg border border-pit-muted/20 p-8 w-full max-w-sm">
        {exito ? (
          <>
            <p className="font-display font-bold text-lg text-pit-up uppercase text-center">¡Contraseña actualizada!</p>
            <Link to="/login" className="inline-block bg-pit-red text-white font-display font-bold uppercase px-6 py-2 rounded mt-6 hover:bg-pit-red/90 w-full text-center">
              Iniciar sesión
            </Link>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <h1 className="font-display font-black text-2xl text-pit-ink uppercase text-center">
              Nueva contraseña
            </h1>

            <label className="block text-xs font-display uppercase text-pit-muted mt-6 mb-1">Contraseña nueva</label>
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border border-pit-muted/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-pit-red"
            />
            <p className="text-xs text-pit-muted mt-1">Mínimo 8 caracteres. Evita contraseñas comunes.</p>

            <label className="block text-xs font-display uppercase text-pit-muted mt-4 mb-1">Confirmar contraseña</label>
            <input
              type="password" required value={confirmar} onChange={e => setConfirmar(e.target.value)}
              className="w-full border border-pit-muted/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-pit-red"
            />

            {error && <p className="text-pit-down text-sm mt-3">{error}</p>}

            <button
              type="submit" disabled={cargando}
              className="w-full bg-pit-red text-white font-display font-bold uppercase py-2.5 rounded mt-6 hover:bg-pit-red/90 disabled:opacity-50"
            >
              {cargando ? 'Guardando...' : 'Guardar contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
