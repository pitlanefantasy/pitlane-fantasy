import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function OlvidePassword() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      await api.post('/usuarios/olvide-password', { email });
    } finally {
      setEnviado(true);
      setCargando(false);
    }
  };

  return (
    <div className="bg-pit-bg min-h-screen flex items-center justify-center px-6">
      <div className="bg-white rounded-lg border border-pit-muted/20 p-8 w-full max-w-sm">
        {enviado ? (
          <>
            <p className="font-display font-bold text-lg text-pit-ink uppercase text-center">Revisa tu correo</p>
            <p className="text-pit-muted text-sm mt-3 text-center">
              Si existe una cuenta con ese email, te hemos enviado un enlace para restablecer tu contraseña. Caduca en 1 hora.
            </p>
            <Link to="/login" className="inline-block text-pit-red text-sm font-display uppercase mt-6 hover:underline w-full text-center">
              ← Volver a iniciar sesión
            </Link>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <h1 className="font-display font-black text-2xl text-pit-ink uppercase text-center">
              ¿Olvidaste tu contraseña?
            </h1>
            <p className="text-pit-muted text-sm mt-2 text-center">
              Escribe tu email y te enviaremos un enlace para restablecerla.
            </p>

            <label className="block text-xs font-display uppercase text-pit-muted mt-6 mb-1">Email</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border border-pit-muted/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-pit-red"
            />

            <button
              type="submit" disabled={cargando}
              className="w-full bg-pit-red text-white font-display font-bold uppercase py-2.5 rounded mt-6 hover:bg-pit-red/90 disabled:opacity-50"
            >
              {cargando ? 'Enviando...' : 'Enviar enlace'}
            </button>

            <Link to="/login" className="block text-center text-sm text-pit-muted mt-4 hover:underline">
              ← Volver a iniciar sesión
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
