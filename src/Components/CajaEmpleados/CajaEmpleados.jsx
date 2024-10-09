import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CajaEmpleados.css';
import { useNavigate } from 'react-router-dom';

const CajaEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [cajas, setCajas] = useState([]); // Agregar estado para las cajas
  const [selectedBoxes, setSelectedBoxes] = useState(['', '', '', '']); // Para manejar las selecciones de boxes
  const [codUnicom, setCodUnicom] = useState(null); // Estado para guardar COD_UNICOM
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

  const handleEmpleadoSelect = (empleado) => {
    // Establecer COD_UNICOM del empleado seleccionado
    setCodUnicom(empleado.COD_UNICOM);
    fetchCajas(empleado.COD_UNICOM);
  };

  const fetchCajas = async (codUnicom) => {
    try {
      const response = await axios.get(`http://localhost:8080/cajas/${codUnicom}`);
      setCajas(response.data.result); // Asignar el array de cajas
    } catch (error) {
      console.error('Error fetching cajas:', error);
    }
  };

  const handleTurnoClick = () => {
    navigate('/dashboard');
  };

  const handleBoxChange = (index, value) => {
    const newSelectedBoxes = [...selectedBoxes];
    newSelectedBoxes[index] = value;
    setSelectedBoxes(newSelectedBoxes);
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

        <div className="employee-selection">
          <h2>Selecciona un Empleado</h2>
          <select onChange={(e) => handleEmpleadoSelect(JSON.parse(e.target.value))}>
            <option value="">Selecciona un empleado</option>
            {empleados.map((empleado) => (
              <option key={empleado.id} value={JSON.stringify(empleado)}>
                {empleado.nombrecompleto}
              </option>
            ))}
          </select>
        </div>

        <div className="box">
          {cajas.map((caja, index) => (
            <div key={caja.id}>
              <h2>{caja.nombre_box}</h2>
              <select
                value={selectedBoxes[index]}
                onChange={(e) => handleBoxChange(index, e.target.value)}
              >
                <option value="">Selecciona un empleado</option>
                {empleados.map((empleado) => (
                  <option key={empleado.id} value={empleado.nombrecompleto}>
                    {empleado.nombrecompleto}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CajaEmpleados;
