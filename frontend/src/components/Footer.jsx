import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="text-center text-pit-muted text-xs py-6 border-t border-pit-muted/20 bg-white">
      PitPlay Fantasy · Temporada 2026
      {' · '}
      <Link to="/privacidad" className="hover:text-pit-ink hover:underline">
        Política de Privacidad
      </Link>
    </footer>
  );
}
