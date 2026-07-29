import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Equipo from './pages/Equipo';
import Ranking from './pages/Ranking';
import Ligas from './pages/Ligas';
import Pronosticos from './pages/Pronosticos';
import Admin from './pages/Admin';
import RutaProtegida from './components/RutaProtegida';
import Reglas from './pages/Reglas';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/reglas" element={<Reglas />} />
          <Route path="/equipo" element={<RutaProtegida><Equipo /></RutaProtegida>} />
          <Route path="/ranking" element={<RutaProtegida><Ranking /></RutaProtegida>} />
          <Route path="/ligas" element={<RutaProtegida><Ligas /></RutaProtegida>} />
          <Route path="/pronosticos" element={<RutaProtegida><Pronosticos /></RutaProtegida>} />
          <Route path="/admin" element={<RutaProtegida><Admin /></RutaProtegida>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
