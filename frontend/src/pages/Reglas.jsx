export default function Reglas() {
  return (
    <div className="bg-pit-bg min-h-screen px-6 md:px-16 py-12 max-w-4xl">
      <p className="text-pit-red text-sm font-display font-bold uppercase tracking-widest">Reglas</p>
      <h1 className="font-display font-black text-3xl md:text-4xl text-pit-ink uppercase mt-2">
        Cómo funciona PitPlay
      </h1>

      <section className="mt-12">
        <h2 className="font-display text-sm uppercase tracking-widest text-pit-muted mb-6">
          Formato de tu equipo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ReglaCard color="bg-pit-best-bg text-pit-best" titulo="2 Oro + 2 Plata"
            texto="Por cada categoría (MotoGP, Moto2, Moto3). Los Oro puntúan el doble que los Plata." />
          <ReglaCard color="bg-pit-up-bg text-pit-up" titulo="1 Capitán por categoría"
            texto="Solo puedes usarlo 3 veces por temporada en cada categoría (3 en MotoGP, 3 en Moto2, 3 en Moto3)." />
          <ReglaCard color="bg-pit-down-bg text-pit-down" titulo="Presupuesto limitado"
            texto="Cada piloto tiene un precio que sube o baja según sus resultados recientes." />
        </div>
      </section>

      <section className="mt-16 border-t border-pit-muted/20 pt-10">
        <h2 className="font-display text-sm uppercase tracking-widest text-pit-muted mb-4">
          Pronósticos de temporada
        </h2>
        <p className="text-pit-muted text-sm mb-6">
          Al inicio de la temporada predices quién se llevará cada categoría. Los aciertos suman directamente a tu puntuación total, además de lo que consigas con tu equipo semanal.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['Campeón, 2º y 3º', 'Más poles', 'Más victorias', 'Mejor rookie', 'Más caídas'].map(t => (
            <div key={t} className="border border-pit-muted/30 rounded-lg p-4 text-center">
              <p className="font-display font-bold text-sm text-pit-ink uppercase">{t}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 border-t border-pit-muted/20 pt-10">
        <h2 className="font-display text-sm uppercase tracking-widest text-pit-muted mb-6">
          Puntos por posición en carrera
        </h2>
        <div className="grid grid-cols-5 md:grid-cols-8 gap-3 font-mono text-sm">
          {[[1,25],[2,20],[3,16],[4,13],[5,11],[6,10],[7,9],[8,8],[9,7],[10,6],[11,5],[12,4],[13,3],[14,2],[15,1]].map(([pos, pts]) => (
            <div key={pos} className="bg-white border border-pit-muted/20 rounded p-2 text-center">
              <div className="text-pit-muted text-xs">P{pos}</div>
              <div className="text-pit-ink font-bold">{pts}</div>
            </div>
          ))}
        </div>
        <p className="text-pit-muted text-xs mt-3">+3 puntos extra por vuelta rápida · -5 puntos por abandono</p>
      </section>

      <section className="mt-16 border-t border-pit-muted/20 pt-10">
        <h2 className="font-display text-sm uppercase tracking-widest text-pit-muted mb-6">
          Paso a paso
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Paso n="1" texto="Elige tus 12 pilotos de MotoGP, Moto2 y Moto3 antes de que cierre cada Gran Premio." />
          <Paso n="2" texto="Suman puntos según su resultado real en carrera, sprint y clasificación." />
          <Paso n="3" texto="Compite en el ranking global o crea una liga privada con tus amigos." />
        </div>
      </section>
    </div>
  );
}

function ReglaCard({ color, titulo, texto }) {
  return (
    <div className={`rounded-lg p-5 ${color}`}>
      <p className="font-display font-bold text-lg">{titulo}</p>
      <p className="text-sm mt-1 text-pit-ink/70">{texto}</p>
    </div>
  );
}

function Paso({ n, texto }) {
  return (
    <div>
      <div className="font-display font-black text-3xl text-pit-red">{n}</div>
      <p className="text-pit-ink text-sm mt-2">{texto}</p>
    </div>
  );
}
