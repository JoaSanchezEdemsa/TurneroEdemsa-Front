import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CajaEmpleados.css';
import { useNavigate } from 'react-router-dom';

const CajaEmpleados = () => {
  const [cajas, setCajas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [selectedBoxes, setSelectedBoxes] = useState({});
  const [newBoxName, setNewBoxName] = useState('');
  const [showAddBoxForm, setShowAddBoxForm] = useState(false);
  const [showDeleteButtons, setShowDeleteButtons] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!(localStorage.getItem("me") > 0)) {
      navigate('/');
    }
  }, [navigate]);

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
          setCajas(response.data.result);
        } else {
          console.error('No se encontraron cajas o el formato es incorrecto');
          setCajas([]);
        }
      } catch (error) {
        console.error('Error fetching cajas:', error);
        setCajas([]);
      }
    };

    fetchCajas();
  }, []);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const sucursal = localStorage.getItem('sucursal');
        if (!sucursal) {
          console.error('No se encontró la sucursal en el localStorage');
          return;
        }

        const response = await axios.get('http://localhost:8080/getUsuariosbyCod', {
          params: { codUnicom: sucursal },
        });

        if (response.data && Array.isArray(response.data.result)) {
          setUsuarios(response.data.result);
        } else {
          console.error('No se encontraron usuarios o el formato es incorrecto');
          setUsuarios([]);
        }
      } catch (error) {
        console.error('Error fetching usuarios:', error);
        setUsuarios([]);
      }
    };

    fetchUsuarios();
  }, []);

  const handleBoxChange = (cajaId, empleadoId) => {
    setSelectedBoxes((prevSelectedBoxes) => ({
      ...prevSelectedBoxes,
      [cajaId]: empleadoId,
    }));
  };

  const handleTurnoClick = () => {
    navigate('/dashboard');
  };

  const handleConfigClick = () => {
    navigate('/config');
  };

  const handleAddBoxClick = () => {
    setShowAddBoxForm(true);
  };

  const handleAddBoxSubmit = async () => {
    try {
      const sucursal = localStorage.getItem('sucursal');
      const created_by = localStorage.getItem('me');

      const response = await axios.post('http://localhost:8080/addbox', { // Asegúrate de que la ruta sea correcta
        nombre_box: newBoxName,
        COD_UNICOM: sucursal,
        created_by
      });
      console.log('Respuesta de agregar caja:', response.data); // Agrega esto para inspeccionar la respuesta

      if (response.data && response.data.success) {
        setCajas([...cajas, response.data.newBox]); // Asegúrate de que la respuesta contenga la nueva caja
        setNewBoxName('');
        setShowAddBoxForm(false);
      } else {
        console.error('Error al agregar la caja.');
      }
    } catch (error) {
      console.error('Error al agregar la caja:', error);
    }
  };

  const handleDeleteBox = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/deletebox/${id}`); // Asegúrate de que la ruta sea correcta
      if (response.data && response.data.success) {
        setCajas(cajas.filter(caja => caja.id !== id));
      } else {
        console.error('Error al eliminar la caja.');
      }
    } catch (error) {
      console.error('Error al eliminar la caja:', error);
    }
  };

  const toggleDeleteButtons = () => {
    setShowDeleteButtons(!showDeleteButtons);
  };

  return (
    <div className="cajas-page">
      <aside className="sidebar">
        <button onClick={handleTurnoClick} className="sidebar-button">Turnos</button>
        <button onClick={handleConfigClick} className="sidebar-button">Configuración</button>
        <button className="sidebar-button">Asignación de empleados</button>
      </aside>

      <main className="content">
        <header className="header">
          <h1>Cajas</h1>
          <div className="button-container">
            <button onClick={handleAddBoxClick} className="add-box-button">Agregar Caja</button>
            <button onClick={toggleDeleteButtons} className="delete-box-button">
              {showDeleteButtons ? 'Cancelar Eliminar' : 'Eliminar Caja'}
            </button>
          </div>
        </header>

        {showAddBoxForm && (
          <div className="add-box-form">
            <input
              type="text"
              value={newBoxName}
              onChange={(e) => setNewBoxName(e.target.value)}
              placeholder="Nombre de la nueva caja"
            />
            <button className="agregar" onClick={handleAddBoxSubmit}>Agregar</button>
            <button className="cancelar" onClick={() => setShowAddBoxForm(false)}>Cancelar</button>
          </div>
        )}

        <div className="box">
          {cajas.map((caja) => (
            <div key={caja.id} className="caja-item">
              <h2>{caja.nombre_box}</h2>
              <select
                value={selectedBoxes[caja.id] || ''}
                onChange={(e) => handleBoxChange(caja.id, e.target.value)}
              >
                <option value="">Seleccionar empleado</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.LEGAJO} value={usuario.LEGAJO}>
                    {usuario.NOMBRECOMPLETO}
                  </option>
                ))}
              </select>
              {showDeleteButtons && (
                <button className="delete-box-button" onClick={() => handleDeleteBox(caja.id)}>Eliminar</button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CajaEmpleados;