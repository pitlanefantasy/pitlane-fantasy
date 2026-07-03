import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Equipo from './pages/Equipo';
import Ranking from './pages/Ranking';
import Ligas from './pages/Ligas';
import RutaProtegida from './components/RutaProtegida';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/equipo" element={
          <RutaProtegida><Equipo /></RutaProtegida>
        } />
        <Route path="/ranking" element={
          <RutaProtegida><Ranking /></RutaProtegida>
        } />
        <Route path="/ligas" element={
          <RutaProtegida><Ligas /></RutaProtegida>
        } />
      </Routes>
    </Router>
  );
}

export default App;