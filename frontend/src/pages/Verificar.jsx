import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function Verificar() {
  const { token } = useParams();
  const [estado, setEstado] = useState('cargando');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    api.get(`/usuarios/verificar/${token}`)
      .then(res => {
        setEstado('exito');
        setMensaje(res.data.mensaje);
      })
      .catch(err => {
        setEstado('error');
        setMensaje(err.response?.data?.detail || 'No se pudo verificar el email');
      });
  }, [token]);

  return (
    <div className="bg-pit-bg min-h-screen flex items-center justify-center px-6">
      <div className="bg-white rounded-lg border border-pit-muted/20 p-8 max-w-sm text-center">
        {estado === 'cargando' && <p className="text-pit-muted">Verificando tu cuenta...</p>}
        {estado === 'exito' && (
          <>
            <p className="text-pit-up font-display font-bold text-xl uppercase">¡Cuenta verificada!</p>
            <p className="text-pit-muted text-sm mt-2">{mensaje}</p>
            <Link to="/login" className="inline-block bg-pit-red text-white font-display font-bold uppercase px-6 py-2 rounded mt-6 hover:bg-pit-red/90">
              Iniciar sesión
            </Link>
          </>
        )}
        {estado === 'error' && (
          <>
            <p className="text-pit-down font-display font-bold text-xl uppercase">No se pudo verificar</p>
            <p className="text-pit-muted text-sm mt-2">{mensaje}</p>
            <Link to="/" className="inline-block text-pit-red text-sm font-display uppercase mt-6 hover:underline">
              ← Volver al inicio
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
