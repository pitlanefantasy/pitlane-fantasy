import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Admin() {
  const [carreras, setCarreras] = useState([]);
  const [pilotos, setPilotos] = useState([]);
  const [carreraId, setCarreraId] = useState('');
  const [resultados, setResultados] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    api.get('/carreras/').then(res => setCarreras(res.data));
    api.get('/pilotos/').then(res => setPilotos(res.data));
  }, []);

  const handleCarreraChange = (id) => {
    setCarreraId(id);
    setResultados(pilotos.map(p => ({
      carrera_id: parseInt(id),
      piloto_id: p.id,
      piloto_nombre: p.nombre,
      categoria: p.categoria,
      posicion_carrera: '',
      posicion_sprint: '',
      vuelta_rapida: false,
      abandono: false,
      hizo_pole: false,
    })));
  };

  const updateResultado = (piloto_id, campo, valor) => {
    setResultados(prev => prev.map(r =>
      r.piloto_id === piloto_id ? { ...r, [campo]: valor } : r
    ));
  };

  const handleGuardar = async () => {
    const resultadosValidos = resultados.filter(r =>
      r.posicion_carrera !== '' || r.abandono || r.hizo_pole
    );
    try {
      for (const r of resultadosValidos) {
        await api.post('/resultados/', {
          carrera_id: r.carrera_id,
          piloto_id: r.piloto_id,
          posicion_carrera: r.posicion_carrera ? parseInt(r.posicion_carrera) : null,
          posicion_sprint: r.posicion_sprint ? parseInt(r.posicion_sprint) : null,
          vuelta_rapida: r.vuelta_rapida,
          abandono: r.abandono,
          hizo_pole: r.hizo_pole,
        });
      }
      setMensaje('✅ Resultados guardados correctamente');
    } catch (err) {
      const detalle = err.response?.data?.detail || 'Error al guardar';
      setMensaje(`❌ ${detalle}`);
    }
  };

  const categorias = ['MotoGP', 'Moto2', 'Moto3'];

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>⚙️ Admin — Introducir Resultados</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>Selecciona carrera: </label>
        <select value={carreraId} onChange={e => handleCarreraChange(e.target.value)}>
          <option value=''>-- Elige carrera --</option>
          {carreras.map(c => (
            <option key={c.id} value={c.id}>{c.nombre} ({c.fecha})</option>
          ))}
        </select>
      </div>

      {carreraId && categorias.map(cat => (
        <div key={cat}>
          <h2>{cat}</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#e8631a', color: 'white' }}>
                <th style={{ padding: '8px' }}>Piloto</th>
                <th style={{ padding: '8px' }}>Pos. Carrera</th>
                <th style={{ padding: '8px' }}>Pos. Sprint</th>
                <th style={{ padding: '8px' }}>Pole</th>
                <th style={{ padding: '8px' }}>V. Rápida</th>
                <th style={{ padding: '8px' }}>Abandono</th>
              </tr>
            </thead>
            <tbody>
              {resultados.filter(r => r.categoria === cat).map((r, i) => (
                <tr key={r.piloto_id} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f5f5f5' }}>
                  <td style={{ padding: '8px' }}>{r.piloto_nombre}</td>
                  <td style={{ padding: '8px' }}>
                    <input type="number" min="1" max="25" style={{ width: '60px' }}
                      value={r.posicion_carrera}
                      onChange={e => updateResultado(r.piloto_id, 'posicion_carrera', e.target.value)} />
                  </td>
                  <td style={{ padding: '8px' }}>
                    {cat === 'MotoGP' && (
                      <input type="number" min="1" max="12" style={{ width: '60px' }}
                        value={r.posicion_sprint}
                        onChange={e => updateResultado(r.piloto_id, 'posicion_sprint', e.target.value)} />
                    )}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    <input type="checkbox" checked={r.hizo_pole}
                      onChange={e => updateResultado(r.piloto_id, 'hizo_pole', e.target.checked)} />
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    <input type="checkbox" checked={r.vuelta_rapida}
                      onChange={e => updateResultado(r.piloto_id, 'vuelta_rapida', e.target.checked)} />
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    <input type="checkbox" checked={r.abandono}
                      onChange={e => updateResultado(r.piloto_id, 'abandono', e.target.checked)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {carreraId && (
        <button onClick={handleGuardar} style={{ padding: '10px 30px', fontSize: '16px' }}>
          Guardar Resultados
        </button>
      )}
      {mensaje && <p>{mensaje}</p>}
      <br />
      <a href="/">← Volver al inicio</a>
    </div>
  );
}

export default Admin;
