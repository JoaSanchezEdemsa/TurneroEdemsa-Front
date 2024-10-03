import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sucursal from './Components/TurnoPantalla/TurnoPantalla'; // Asegúrate de que la ruta sea correcta
import TurnoForm from './Components/Pantalla/Pantalla'; // Asegúrate de que la ruta sea correcta

function App() {
  return (
    <Router>
          <Routes>
            <Route path="/pantalla" element={<TurnoForm />} /> {/* Ruta para la página de inicio */}
            <Route path="/" element={<Sucursal />} /> {/* Ruta para el formulario */}
          </Routes>
    </Router>
  );
}

export default App;
