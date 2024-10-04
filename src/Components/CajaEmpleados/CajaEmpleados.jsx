import React, { useState } from 'react';
import './CajaEmpleados.css';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const CajaEmpleados = () => {
  const empleados = ["Javier Lopez", "Martina Suarez", "Alfonso Hernandez"];
  const navigate = useNavigate(); // Inicializa useNavigate
  
  const [selectedBox1, setSelectedBox1] = useState('');
  const [selectedBox2, setSelectedBox2] = useState('');
  const [selectedBox3, setSelectedBox3] = useState('');
  const [selectedBox4, setSelectedBox4] = useState('');

  const handleTurnoClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="cajas-page">
      <aside className="sidebar">
        <button onClick={handleTurnoClick} className="sidebar-button">Turnos</button>
        <button className="sidebar-button">Configuración</button>
        <button className="sidebar-button">Asignación de empleados</button>
      </aside>

      <main className="content">
        <header className="header">
          <h1>Cajas</h1>
        </header>

        
          {/* Box 1 */}
          <div className="box">
            <h2>Box 1</h2>
            <select 
              value={selectedBox1} 
              onChange={(e) => setSelectedBox1(e.target.value)}
            >
              <option value="">Selecciona un empleado</option>
              {empleados.map((empleado, index) => (
                <option key={index} value={empleado}>{empleado}</option>
              ))}
            </select>
        
          
            <h2>Box 2</h2>
            <select 
              value={selectedBox2} 
              onChange={(e) => setSelectedBox2(e.target.value)}
            >
              <option value="">Selecciona un empleado</option>
              {empleados.map((empleado, index) => (
                <option key={index} value={empleado}>{empleado}</option>
              ))}
            </select>
          

          
            <h2>Box 3</h2>
            <select 
              value={selectedBox3} 
              onChange={(e) => setSelectedBox3(e.target.value)}
            >
              <option value="">Selecciona un empleado</option>
              {empleados.map((empleado, index) => (
                <option key={index} value={empleado}>{empleado}</option>
              ))}
            </select>
          
            <h2>Box 4</h2>
            <select 
              value={selectedBox4} 
              onChange={(e) => setSelectedBox4(e.target.value)}
            >
              <option value="">Selecciona un empleado</option>
              {empleados.map((empleado, index) => (
                <option key={index} value={empleado}>{empleado}</option>
              ))}
            </select>
          
        </div>
      </main>
    </div>
  );
};

export default CajaEmpleados;
