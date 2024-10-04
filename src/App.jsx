import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TurnoForm from './Components/TurnoPantalla/TurnoPantalla'; // Asegúrate de que la ruta sea correcta
import Dashboard from './Components/Dashboard/Dashboard'; // Asegúrate de que la ruta sea correcta
import CajaEmpleados from './Components/CajaEmpleados/CajaEmpleados';

function App() {
  return (
    <Router>
      
          <Routes>
            <Route path="/" element={<CajaEmpleados />} /> 
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
      
    </Router>
  );
}

export default App;
