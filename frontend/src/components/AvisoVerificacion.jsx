import { useState, useEffect } from 'react';
import api, { getUsuario } from '../services/api';

export default function AvisoVerificacion() {
  const [aviso, setAviso] = useState(null);
  const [reenviando, setReenviando] = useState(false);
  const [mensajeReenvio, setMensajeReenvio] = useState('');

  useEffect(() => {
    const guardado = sessionStorage.getItem('avisoLogin');
    if (guardado) setAviso(guardado);
  }, []);

  const handleReenviar = async () => {
    const usuario = getUsuario();
    if (!usuario) return;
    setReenviando(true);
    setMensajeReenvio('');
    try {
      await api.post(`/usuarios/reenviar-verificacion?email=${encodeURIComponent(usuario.sub)}`);
      setMensajeReenvio('Correo reenviado. Revisa tu bandeja de entrada.');
    } catch (err) {
      setMensajeReenvio(err.response?.data?.detail || 'No se pudo reenviar el correo');
    } finally {
      setReenviando(false);
    }
  };

  const handleCerrar = () => {
    sessionStorage.removeItem('avisoLogin');
    setAviso(null);
  };

  if (!aviso) return null;

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3 flex items-center justify-between flex-wrap gap-2">
      <p className="text-yellow-800 text-sm">{mensajeReenvio || aviso}</p>
      <div className="flex items-center gap-4">
        <button
          onClick={handleReenviar}
          disabled={reenviando}
          className="text-yellow-800 text-sm font-display uppercase underline hover:no-underline disabled:opacity-50"
        >
          {reenviando ? 'Reenviando...' : 'Reenviar correo'}
        </button>
        <button onClick={handleCerrar} className="text-yellow-800 text-lg leading-none" aria-label="Cerrar aviso">
          ×
        </button>
      </div>
    </div>
  );
}
