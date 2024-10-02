import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TurnoForm from './TurnoPantalla'; // Asegúrate de que la ruta sea correcta
import Home from './Pantalla'; // Asegúrate de que la ruta sea correcta

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>EDEMSA</h1>
          <Routes>
            <Route path="/pantalla" element={<Home />} /> {/* Ruta para la página de inicio */}
            <Route path="/" element={<TurnoForm />} /> {/* Ruta para el formulario */}
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
