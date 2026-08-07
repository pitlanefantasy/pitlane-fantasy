import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { getUsuario } from '../services/api';

export default function Ligas() {
  const [ligas, setLigas] = useState([]);
  const [nombreLiga, setNombreLiga] = useState('');
  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [codigoCreado, setCodigoCreado] = useState(null);

  useEffect(() => {
    api.get('/ligas/').then(res => setLigas(res.data)).catch(() => {});
  }, []);

  const handleCrear = async (e) => {
    e.preventDefault();
    const usuario = getUsuario();
    if (!usuario) { window.location.href = '/login'; return; }
    setMensaje(null);
    setCodigoCreado(null);
    try {
      const res = await api.post('/ligas/', {
        nombre: nombreLiga,
        creador_id: usuario.id,
        temporada: 2026,
        publica: false,
      });
      setCodigoCreado(res.data.codigo);
      setNombreLiga('');
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.response?.data?.detail || 'Error al crear la liga' });
    }
  };

  const handleUnirse = async (e) => {
    e.preventDefault();
    const usuario = getUsuario();
    if (!usuario) { window.location.href = '/login'; return; }
    setMensaje(null);
    try {
      const res = await api.post(`/ligas/${codigo}/unirse?usuario_id=${usuario.id}`);
      setMensaje({ tipo: 'exito', texto: res.data.mensaje });
      setCodigo('');
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.response?.data?.detail || 'Código incorrecto o ya eres miembro' });
    }
  };

  return (
    <div className="bg-pit-bg min-h-screen px-6 md:px-16 py-10">
      <p className="text-pit-red text-sm font-display font-bold uppercase tracking-widest">Ligas</p>
      <h1 className="font-display font-black text-3xl text-pit-ink uppercase mt-1">
        Juega con tus amigos
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <form onSubmit={handleCrear} className="bg-white rounded-lg border border-pit-muted/20 p-6">
          <h2 className="font-display font-bold text-lg text-pit-ink uppercase">Crear liga privada</h2>
          <input
            type="text" required placeholder="Nombre de la liga"
            value={nombreLiga} onChange={e => setNombreLiga(e.target.value)}
            className="w-full border border-pit-muted/30 rounded px-3 py-2 text-sm mt-4"
          />
          <button type="submit" className="bg-pit-red text-white font-display font-bold uppercase px-6 py-2 rounded mt-4 hover:bg-pit-red/90">
            Crear
          </button>
          {codigoCreado && (
            <div className="bg-pit-up-bg text-pit-up rounded p-4 mt-4">
              <p className="text-sm">Liga creada. Comparte este código con tus amigos:</p>
              <p className="font-mono font-bold text-2xl mt-1 tracking-widest">{codigoCreado}</p>
            </div>
          )}
        </form>

        <form onSubmit={handleUnirse} className="bg-white rounded-lg border border-pit-muted/20 p-6">
          <h2 className="font-display font-bold text-lg text-pit-ink uppercase">Unirse a una liga</h2>
          <input
            type="text" required placeholder="Código de invitación"
            value={codigo} onChange={e => setCodigo(e.target.value.toUpperCase())}
            className="w-full border border-pit-muted/30 rounded px-3 py-2 text-sm mt-4 font-mono tracking-widest"
          />
          <button type="submit" className="bg-pit-red text-white font-display font-bold uppercase px-6 py-2 rounded mt-4 hover:bg-pit-red/90">
            Unirse
          </button>
        </form>
      </div>

      {mensaje && (
        <p className={`mt-6 font-medium ${mensaje.tipo === 'exito' ? 'text-pit-up' : 'text-pit-down'}`}>
          {mensaje.texto}
        </p>
      )}

      <div className="mt-12 pt-8 border-t border-pit-muted/20">
        <h2 className="font-display text-sm uppercase tracking-widest text-pit-muted mb-4">Ligas públicas</h2>
        {ligas.length === 0 && <p className="text-pit-muted text-sm">No hay ligas públicas.</p>}
        <div className="space-y-3">
          {ligas.map(l => (
            <div key={l.id} className="bg-white rounded-lg border border-pit-muted/20 p-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-pit-ink">{l.nombre}</p>
                <p className="text-xs text-pit-muted font-mono">Código: {l.codigo}</p>
              </div>
              <Link to={`/ranking-liga/${l.id}`} className="text-pit-red text-sm font-display uppercase hover:underline">
                Ver ranking →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
