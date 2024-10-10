import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CajaEmpleados.css';
import { useNavigate } from 'react-router-dom';

const CajaEmpleados = () => {
  const [empleadoLogueado, setEmpleadoLogueado] = useState(null); // Estado para el empleado logueado
  const [cajas, setCajas] = useState([]); // Estado para almacenar las cajas
  const [selectedBoxes, setSelectedBoxes] = useState({}); // Para manejar las selecciones de empleados por caja
  const navigate = useNavigate();

  // Obtener el empleado logueado y su COD_UNICOM
  useEffect(() => {
    const fetchEmpleadoLogueado = async () => {
      try {
        const response = await axios.get('http://localhost:8080/login'); // Suponiendo que este endpoint devuelve el empleado logueado
        const empleado = response.data;
        setEmpleadoLogueado(empleado); // Guardar el empleado logueado
        fetchCajas(empleado.COD_UNICOM); // Obtener cajas usando el COD_UNICOM
      } catch (error) {
        console.error('Error fetching empleado logueado:', error);
      }
    };

    fetchEmpleadoLogueado();
  }, []);

  // Obtener las cajas según el COD_UNICOM del empleado logueado
  const fetchCajas = async (codUnicom) => {
    try {
      const response = await axios.get(`http://localhost:8080/getboxes?COD_UNICOM=${codUnicom}`);
      setCajas(response.data.result); // Asignar las cajas al estado
    } catch (error) {
      console.error('Error fetching cajas:', error);
    }
  };

  // Manejar el cambio en el dropdown de empleados
  const handleBoxChange = (cajaId, empleadoId) => {
    setSelectedBoxes((prevSelectedBoxes) => ({
      ...prevSelectedBoxes,
      [cajaId]: empleadoId, // Guardar la selección de empleado para cada caja
    }));
  };

  // Navegar a la página de turnos
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
          {/* Mostrar las cajas */}
          {cajas.map((caja) => (
            <div key={caja.id} className="caja-item">
              <h2>{caja.nombre_box}</h2>
              <select
                value={selectedBoxes[caja.id] || ''} // Selección actual para esta caja
                onChange={(e) => handleBoxChange(caja.id, e.target.value)}
              >
                <option value={empleadoLogueado?.id}>
                  {empleadoLogueado?.nombrecompleto} {/* Mostrar el empleado logueado */}
                </option>
              </select>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CajaEmpleados;
