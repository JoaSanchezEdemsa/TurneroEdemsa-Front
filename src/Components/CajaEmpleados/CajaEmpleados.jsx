import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CajaEmpleados.css';
import { useNavigate } from 'react-router-dom';

const CajaEmpleados = () => {
  const [permisos, setPermisos] = useState({});
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
    fetchPermisos();
  }, []);

  const fetchPermisos = async () => {
    try {
      const nick = localStorage.getItem('me');
      if (!nick) {
        console.error('No se encontró el nick en el localStorage');
        return;
      }

      const response = await axios.get('http://localhost:8080/getpermisosbynick', {
        params: { NICK: nick },
      });

      if (response.data) {
        setPermisos(response.data.result);
        console.log(response.data.result)
      } else {
        console.error('No se encontraron permisos con ese nick');
        setPermisos(null);
      }
    } catch (error) {
      console.error('Error al obtener permisos:', error);
    }
  };

  

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

      const response = await axios.post('http://localhost:8080/addbox', { 
        nombre_box: newBoxName,
        COD_UNICOM: sucursal,
        created_by
      });
      console.log('Respuesta de agregar caja:', response.data); 

      if (response.data && response.data.success) {
        setCajas([...cajas, response.data.newBox]); 
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
      const response = await axios.delete(`http://localhost:8080/deletebox/${id}`); 
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
          {permisos.turnero ? (
          <div className="button-container">
          <button 
            onClick={handleAddBoxClick} 
            className="add-box-button"
            disabled={!permisos.turnero.add_boxes}  
          >
            Agregar Caja
          </button>
          <button 
              onClick={toggleDeleteButtons} 
              className="delete-box-button"
              disabled={!permisos.turnero.del_boxes} 
            >
              {showDeleteButtons ? 'Cancelar Eliminar' : 'Eliminar Caja'}
            </button>
          </div>
          ) : (
            <p>No se encontraron perimsos para modificar las cajas</p>
        )}
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
            
              {permisos.turnero && permisos.turnero.admin_usuarios_x_box ? (
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

                    ) : (
                      <p>No se encontraron perimsos para seleccionar usuarios</p>
                    )}
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