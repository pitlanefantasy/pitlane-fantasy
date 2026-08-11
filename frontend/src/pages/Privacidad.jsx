export default function Privacidad() {
  return (
    <div className="bg-pit-bg min-h-screen px-6 md:px-16 py-12 max-w-3xl">
      <p className="text-pit-red text-sm font-display font-bold uppercase tracking-widest">Legal</p>
      <h1 className="font-display font-black text-3xl md:text-4xl text-pit-ink uppercase mt-2">
        Política de Privacidad
      </h1>
      <p className="text-pit-muted text-sm mt-2">Última actualización: 11 de agosto de 2026</p>

      <div className="mt-10 space-y-8 text-sm text-pit-ink leading-relaxed">
        <section>
          <h2 className="font-display font-bold text-lg uppercase text-pit-ink mb-2">Responsable del tratamiento</h2>
          <p className="text-pit-muted">
            Oscar Alexander Encalada Cordova, a título personal, como titular de PitPlay Fantasy (pitplayfantasy.com).
            Contacto: <a href="mailto:pitlanefantasy@gmail.com" className="text-pit-red hover:underline">pitlanefantasy@gmail.com</a>
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg uppercase text-pit-ink mb-2">Qué datos recogemos</h2>
          <ul className="text-pit-muted list-disc pl-5 space-y-1">
            <li>Al registrarte: tu email, tu nombre y tu contraseña (cifrada, nunca en texto plano — ni nosotros podemos leerla).</li>
            <li>Al jugar: los pilotos que eliges cada Gran Premio, tus pronósticos de temporada, y las ligas a las que te unes o creas.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg uppercase text-pit-ink mb-2">Para qué los usamos</h2>
          <ul className="text-pit-muted list-disc pl-5 space-y-1">
            <li>Crear y gestionar tu cuenta.</li>
            <li>Calcular tu puntuación y mostrarte en los rankings del juego (tu nombre es visible para otros jugadores en los rankings públicos).</li>
            <li>Comunicarnos contigo si es necesario sobre tu cuenta.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg uppercase text-pit-ink mb-2">Base legal</h2>
          <p className="text-pit-muted">Tu consentimiento, al registrarte voluntariamente en la web.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg uppercase text-pit-ink mb-2">Edad mínima</h2>
          <p className="text-pit-muted">
            Actualmente no exigimos una edad mínima para registrarse. Si tienes menos de 14 años, te recomendamos registrarte con el consentimiento de un padre, madre o tutor.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg uppercase text-pit-ink mb-2">Dónde se guardan tus datos</h2>
          <p className="text-pit-muted">En servidores de Google Cloud, en la Unión Europea (región de Bélgica).</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg uppercase text-pit-ink mb-2">Cuánto tiempo los guardamos</h2>
          <p className="text-pit-muted">Mientras tu cuenta exista. Puedes pedir que se borren en cualquier momento, escribiéndonos.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg uppercase text-pit-ink mb-2">Tus derechos</h2>
          <p className="text-pit-muted">
            Tienes derecho a acceder a tus datos, corregirlos, pedir que se borren, pedir una copia (portabilidad) y oponerte a su uso.
            Para ejercer cualquiera de estos derechos, escribe a <a href="mailto:pitlanefantasy@gmail.com" className="text-pit-red hover:underline">pitlanefantasy@gmail.com</a>.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg uppercase text-pit-ink mb-2">Con quién compartimos tus datos</h2>
          <p className="text-pit-muted">
            Con nadie fuera de los proveedores técnicos necesarios para que la web funcione: Google Cloud (alojamiento) y Cloudflare (gestión del dominio).
            No vendemos ni cedemos tus datos a terceros con fines comerciales ni publicitarios.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg uppercase text-pit-ink mb-2">Cookies y almacenamiento local</h2>
          <p className="text-pit-muted">
            No usamos cookies de rastreo ni publicidad. Guardamos un token de sesión en tu propio navegador (localStorage) únicamente para mantenerte identificado mientras usas la web — se borra si cierras sesión o borras los datos del navegador.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg uppercase text-pit-ink mb-2">Cambios en esta política</h2>
          <p className="text-pit-muted">Si actualizamos este texto, cambiaremos la fecha de arriba. Te recomendamos revisarlo de vez en cuando.</p>
        </section>
      </div>
    </div>
  );
}
