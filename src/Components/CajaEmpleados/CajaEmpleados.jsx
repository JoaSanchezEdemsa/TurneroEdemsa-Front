import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CajaEmpleados.css';
import { useNavigate } from 'react-router-dom';

const CajaEmpleados = () => {
  const [cajas, setCajas] = useState([]); // Estado para almacenar las cajas
  const [selectedBoxes, setSelectedBoxes] = useState({}); // Para manejar las selecciones de empleados por caja
  const navigate = useNavigate();

  
  useEffect(() => {
    // Verificar el localStorage al montar el componente
    if (!(localStorage.getItem("me") > 0)) {
      navigate('/login');
    }
  }, [navigate]);


  // Obtener las cajas según el COD_UNICOM desde el backend
  useEffect(() => {
    const fetchCajas = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getboxes'); // Asume que este endpoint te dará las cajas basadas en el COD_UNICOM del empleado logueado
        
        if (response.data && response.data.result) {
          setCajas(response.data.result); // Asignar las cajas al estado
        } else {
          console.error('No se encontraron cajas en la respuesta');
        }
      } catch (error) {
        console.error('Error fetching cajas:', error);
      }
    };

    fetchCajas();
  }, []);

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
                <option value="">Seleccionar empleado</option>
                {/* Aquí podrías agregar opciones de empleados si es necesario */}
              </select>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CajaEmpleados;
