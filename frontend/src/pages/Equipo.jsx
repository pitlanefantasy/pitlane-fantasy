import { useState, useEffect } from 'react';
import api, { getUsuario } from '../services/api';

const PRESUPUESTO = 60;
const MAX_BOOSTS = 3;
const CATEGORIAS = ['MotoGP', 'Moto2', 'Moto3'];

export default function Equipo() {
  const [proximaCarrera, setProximaCarrera] = useState(null);
  const [pilotos, setPilotos] = useState({ MotoGP: [], Moto2: [], Moto3: [] });
  const [boostsUsados, setBoostsUsados] = useState({ MotoGP: 0, Moto2: 0, Moto3: 0 });
  const [equipo, setEquipo] = useState({
    motogp_oro1_id: '', motogp_oro2_id: '', motogp_plata1_id: '', motogp_plata2_id: '',
    moto2_oro1_id: '', moto2_oro2_id: '', moto2_plata1_id: '', moto2_plata2_id: '',
    moto3_oro1_id: '', moto3_oro2_id: '', moto3_plata1_id: '', moto3_plata2_id: '',
    capitan_motogp_id: '', capitan_moto2_id: '', capitan_moto3_id: '',
    pole_motogp_id: '', pole_moto2_id: '', pole_moto3_id: '',
  });
  const [mensaje, setMensaje] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const usuario = getUsuario();
    if (!usuario) { window.location.href = '/login'; return; }

    api.get('/carreras/proxima').then(res => setProximaCarrera(res.data));
    CATEGORIAS.forEach(cat => {
      api.get(`/pilotos/categoria/${cat}`).then(res =>
        setPilotos(prev => ({ ...prev, [cat]: res.data }))
      );
    });
    api.get(`/equipos/boosts/${usuario.id}/2026`)
      .then(res => setBoostsUsados({
        MotoGP: res.data.MOTOGP?.usados || 0,
        Moto2: res.data.MOTO2?.usados || 0,
        Moto3: res.data.MOTO3?.usados || 0,
      }))
      .catch(() => {});
  }, []);

  const idsElegidos = Object.entries(equipo)
    .filter(([campo]) => campo.includes('_oro') || campo.includes('_plata'))
    .map(([, valor]) => valor)
    .filter(Boolean);

  const todosPilotos = [...pilotos.MotoGP, ...pilotos.Moto2, ...pilotos.Moto3];
  const presupuestoUsado = idsElegidos.reduce((sum, id) => {
    const p = todosPilotos.find(p => String(p.id) === String(id));
    return sum + (p ? parseFloat(p.precio) : 0);
  }, 0);
  const sobrePresupuesto = presupuestoUsado > PRESUPUESTO;

  const cambiar = (campo, valor) => setEquipo(prev => ({ ...prev, [campo]: valor }));

  const handleGuardar = async () => {
    const usuario = getUsuario();
    const camposObligatorios = Object.keys(equipo).filter(c => c.includes('_oro') || c.includes('_plata'));
    if (camposObligatorios.some(c => !equipo[c])) {
      setMensaje({ tipo: 'error', texto: 'Debes seleccionar los 12 pilotos antes de guardar' });
      return;
    }
    setGuardando(true);
    setMensaje(null);
    try {
      const payload = { usuario_id: usuario.id, carrera_id: proximaCarrera.id, temporada: proximaCarrera.temporada };
      Object.entries(equipo).forEach(([k, v]) => { payload[k] = v ? parseInt(v) : null; });
      await api.post('/equipos/', payload);
      setMensaje({ tipo: 'exito', texto: 'Equipo guardado correctamente' });
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.response?.data?.detail || 'Error al guardar el equipo' });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="bg-pit-bg min-h-screen px-6 md:px-16 py-10">
      <p className="text-pit-red text-sm font-display font-bold uppercase tracking-widest">Mi equipo</p>
      <h1 className="font-display font-black text-3xl text-pit-ink uppercase mt-1">
        {proximaCarrera ? `${proximaCarrera.nombre}` : 'Cargando...'}
      </h1>

      <div className={`inline-block rounded-lg px-5 py-3 mt-4 font-mono ${sobrePresupuesto ? 'bg-pit-down-bg text-pit-down' : 'bg-pit-up-bg text-pit-up'}`}>
        {(PRESUPUESTO - presupuestoUsado).toFixed(1)}M restantes
        <span className="text-xs ml-2 opacity-70">({presupuestoUsado.toFixed(1)}M / {PRESUPUESTO}M usados)</span>
      </div>

      <div className="mt-10 space-y-8">
        {CATEGORIAS.map(cat => (
          <CategoriaBloque
            key={cat}
            categoria={cat}
            pilotos={pilotos[cat]}
            equipo={equipo}
            cambiar={cambiar}
            usosRestantes={MAX_BOOSTS - (boostsUsados[cat] || 0)}
          />
        ))}
      </div>

      {mensaje && (
        <p className={`mt-6 font-medium ${mensaje.tipo === 'exito' ? 'text-pit-up' : 'text-pit-down'}`}>
          {mensaje.texto}
        </p>
      )}

      <button
        onClick={handleGuardar}
        disabled={guardando}
        className="bg-pit-red text-white font-display font-bold uppercase px-8 py-3 rounded mt-6 hover:bg-pit-red/90 disabled:opacity-50"
      >
        {guardando ? 'Guardando...' : 'Guardar equipo'}
      </button>
    </div>
  );
}

function CategoriaBloque({ categoria, pilotos, equipo, cambiar, usosRestantes }) {
  const prefijo = categoria.toLowerCase();
  const camposCategoria = [`${prefijo}_oro1_id`, `${prefijo}_oro2_id`, `${prefijo}_plata1_id`, `${prefijo}_plata2_id`];
  const seleccionados = camposCategoria.map(c => equipo[c]).filter(Boolean);

  const opciones = (campoActual) => pilotos.filter(p =>
    !seleccionados.includes(String(p.id)) || equipo[campoActual] === String(p.id)
  );

  return (
    <div className="bg-white rounded-lg border border-pit-muted/20 p-6">
      <h2 className="font-display font-bold text-xl text-pit-ink uppercase mb-4">{categoria}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Selector label="Oro 1" campo={`${prefijo}_oro1_id`} equipo={equipo} cambiar={cambiar} opciones={opciones(`${prefijo}_oro1_id`)} />
        <Selector label="Oro 2" campo={`${prefijo}_oro2_id`} equipo={equipo} cambiar={cambiar} opciones={opciones(`${prefijo}_oro2_id`)} />
        <Selector label="Plata 1" campo={`${prefijo}_plata1_id`} equipo={equipo} cambiar={cambiar} opciones={opciones(`${prefijo}_plata1_id`)} />
        <Selector label="Plata 2" campo={`${prefijo}_plata2_id`} equipo={equipo} cambiar={cambiar} opciones={opciones(`${prefijo}_plata2_id`)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-pit-muted/20">
        <div>
          <label className="block text-xs font-display uppercase text-pit-muted mb-1">
            Capitán <span className="text-pit-best">({usosRestantes} usos restantes)</span>
          </label>
          <select
            value={equipo[`capitan_${prefijo}_id`]}
            onChange={e => cambiar(`capitan_${prefijo}_id`, e.target.value)}
            disabled={usosRestantes <= 0}
            className="w-full border border-pit-muted/30 rounded px-3 py-2 text-sm disabled:opacity-50"
          >
            <option value="">— Sin boost —</option>
            {pilotos.filter(p => seleccionados.includes(String(p.id))).map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <Selector label="Predicción de pole" campo={`pole_${prefijo}_id`} equipo={equipo} cambiar={cambiar} opciones={pilotos} vacio="— Sin predicción —" />
      </div>
    </div>
  );
}

function Selector({ label, campo, equipo, cambiar, opciones, vacio = '— Elige piloto —' }) {
  return (
    <div>
      <label className="block text-xs font-display uppercase text-pit-muted mb-1">{label}</label>
      <select
        value={equipo[campo]}
        onChange={e => cambiar(campo, e.target.value)}
        className="w-full border border-pit-muted/30 rounded px-3 py-2 text-sm"
      >
        <option value="">{vacio}</option>
        {opciones.map(p => (
          <option key={p.id} value={p.id}>{p.nombre} ({p.equipo}) — {p.precio}M</option>
        ))}
      </select>
    </div>
  );
}
