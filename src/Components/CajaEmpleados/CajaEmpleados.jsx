import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CajaEmpleados.css';
import { useNavigate } from 'react-router-dom';

const CajaEmpleados = () => {
  const [empleados, setEmpleados] = useState([]); 
  const [selectedBox1, setSelectedBox1] = useState('');
  const [selectedBox2, setSelectedBox2] = useState('');
  const [selectedBox3, setSelectedBox3] = useState('');
  const [selectedBox4, setSelectedBox4] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await axios.get('http://localhost:8080/empleados');
        setEmpleados(response.data);
      } catch (error) {
        console.error('Error fetching empleados:', error);
      }
    };
    fetchEmpleados();
  }, []);

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

        <div className="box">
          <h2>Box 1</h2>
          <select
            value={selectedBox1}
            onChange={(e) => setSelectedBox1(e.target.value)}
          >
            <option value="">Selecciona un empleado</option>
            {empleados.map((empleado) => (
              <option key={empleado.id} value={empleado.nombrecompleto}>
                {empleado.nombrecompleto}
              </option>
            ))}
          </select>

          <h2>Box 2</h2>
          <select
            value={selectedBox2}
            onChange={(e) => setSelectedBox2(e.target.value)}
          >
            <option value="">Selecciona un empleado</option>
            {empleados.map((empleado) => (
              <option key={empleado.id} value={empleado.nombrecompleto}>
                {empleado.nombrecompleto}
              </option>
            ))}
          </select>

          <h2>Box 3</h2>
          <select
            value={selectedBox3}
            onChange={(e) => setSelectedBox3(e.target.value)}
          >
            <option value="">Selecciona un empleado</option>
            {empleados.map((empleado) => (
              <option key={empleado.id} value={empleado.nombrecompleto}>
                {empleado.nombrecompleto}
              </option>
            ))}
          </select>

          <h2>Box 4</h2>
          <select
            value={selectedBox4}
            onChange={(e) => setSelectedBox4(e.target.value)}
          >
            <option value="">Selecciona un empleado</option>
            {empleados.map((empleado) => (
              <option key={empleado.id} value={empleado.nombrecompleto}>
                {empleado.nombrecompleto}
              </option>
            ))}
          </select>
        </div>
      </main>
    </div>
  );
};

export default CajaEmpleados;
