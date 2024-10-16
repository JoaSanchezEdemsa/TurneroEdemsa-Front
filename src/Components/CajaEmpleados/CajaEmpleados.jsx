import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CajaEmpleados.css';
import { useNavigate } from 'react-router-dom';

const CajaEmpleados = () => {
  const [cajas, setCajas] = useState([]); // Estado para almacenar las cajas
  const [usuarios, setUsuarios] = useState([]); // Estado para almacenar los usuarios
  const [selectedBoxes, setSelectedBoxes] = useState({}); // Para manejar las selecciones de empleados por caja
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar el localStorage al montar el componente
    if (!(localStorage.getItem("me") > 0)) {
      navigate('/');
    }
  }, [navigate]);

  // Obtener las cajas según el COD_UNICOM desde el backend
  useEffect(() => {
    const fetchCajas = async () => {
      try {
        const sucursal = localStorage.getItem('sucursal');
        if (!sucursal) {
          console.error('No se encontró la sucursal en el localStorage');
          return;
        }

        const response = await axios.get('http://localhost:8080/getboxesbyCod', {
          params: { codUnicom: sucursal },
        });

        if (response.data && Array.isArray(response.data.result)) {
          setCajas(response.data.result); // Asignar las cajas al estado
        } else {
          console.error('No se encontraron cajas o el formato es incorrecto');
          setCajas([]); // Asegúrate de manejar este caso
        }
      } catch (error) {
        console.error('Error fetching cajas:', error);
        setCajas([]); // En caso de error, asegura que sea un array vacío
      }
    };

    fetchCajas();
  }, []);

  // Obtener los usuarios desde el backend
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const sucursal = localStorage.getItem('sucursal');
        if (!sucursal) {
          console.error('No se encontró la sucursal en el localStorage');
          return;
        }

        const response = await axios.get('http://localhost:8080/getUsuariosbyCod', {
          params: { codUnicom: sucursal }, // Usa el mismo parámetro
        });

        if (response.data && Array.isArray(response.data.result)) {
          setUsuarios(response.data.result); // Asignar los usuarios al estado
        } else {
          console.error('No se encontraron usuarios o el formato es incorrecto');
          setUsuarios([]); // Asegúrate de manejar este caso
        }
      } catch (error) {
        console.error('Error fetching usuarios:', error);
        setUsuarios([]); // En caso de error, asegura que sea un array vacío
      }
    };

    fetchUsuarios();
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
                {/* Agregar opciones de usuarios al dropdown */}
                {usuarios.map((usuario) => (
                  <option key={usuario.LEGAJO} value={usuario.LEGAJO}>
                    {usuario.NOMBRECOMPLETO} {/* Cambia 'nombre' por el atributo adecuado de usuario */}
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
