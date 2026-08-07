import { Navigate } from 'react-router-dom';
import { getUsuario } from '../services/api';

function RutaProtegida({ children, soloAdmin = false }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;

  if (soloAdmin) {
    const usuario = getUsuario();
    if (!usuario?.es_admin) return <Navigate to="/" />;
  }

  return children;
}
export default RutaProtegida;
