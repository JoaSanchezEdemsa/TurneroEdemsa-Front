import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CajaEmpleados.css';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const CajaEmpleados = () => {
  const [permisos, setPermisos] = useState({});
  const [cajas, setCajas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [selectedBoxes, setSelectedBoxes] = useState({});
  const [selectedStatus, setSelectedStatus] = useState({});
  const [newBoxName, setNewBoxName] = useState('');
  const [showAddBoxForm, setShowAddBoxForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleBoxChange = async (cajaId, empleadoId) => {
    // Actualizar el estado de selectedBoxes
    const empleadoSeleccionado = usuarios.find(user => user.LEGAJO === empleadoId);
    
    setSelectedBoxes((prevSelectedBoxes) => ({
      ...prevSelectedBoxes,
      [cajaId]: empleadoId,
    }));
  
    if (empleadoSeleccionado) {
      const nombreOperador = empleadoSeleccionado.NOMBRECOMPLETO; // Obtener el nombre completo del usuario
  
      try {
        const sucursal = localStorage.getItem('sucursal');
        
        // Crear el objeto de datos que se enviará
        const datosParaEnviar = {
          id: cajaId,
          COD_UNICOM: sucursal,
          empleado: nombreOperador, 

        };
  
        // Mostrar en la consola los datos que se van a enviar
        console.log('Datos que se enviarán:', datosParaEnviar);
  
        // Enviar los datos a la base de datos
        const response = await axios.post('http://localhost:8080/addOperador', datosParaEnviar);
  
        if (response.data && response.data.success) {
          console.log('Operador asignado exitosamente');
  
          // Actualizar los usuarios disponibles, eliminando el que ya fue asignado
          setUsuarios((prevUsuarios) => prevUsuarios.filter((user) => user.LEGAJO !== empleadoId));
        } else {
          console.error('Error al asignar el operador');
        }
      } catch (error) {
        console.error('Error al asignar el operador:', error);
      }
    } else {
      console.error('No se encontró el empleado seleccionado');
    }
  };
  
  

  const handleStatusChange = (cajaId, status) => {
    setSelectedStatus((prevSelectedStatus) => ({
      ...prevSelectedStatus,
      [cajaId]: status,
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
    if (!newBoxName.trim()) {
      alert('El nombre de la caja es requerido.');
      return;
    }

    const boxExists = cajas.some((box) => box.nombre_box.toLowerCase() === newBoxName.trim().toLowerCase());

    if (boxExists) {
      alert('Nombre del box repetido');
      return;
    }

    try {
      const sucursal = localStorage.getItem('sucursal');
      const created_by = localStorage.getItem('me');

      const response = await axios.post('http://localhost:8080/addBox', {
        nombre_box: newBoxName,
        COD_UNICOM: sucursal,
        created_by: created_by,
      });

      if (response.data && response.data.success) {
        setSuccessMessage('Caja creada exitosamente');
        setNewBoxName('');
        setShowAddBoxForm(false);

        setTimeout(() => {
          setSuccessMessage('');
          window.location.reload();
        }, 3000);
      } else {
        console.error('Error al agregar la caja.');
      }
    } catch (error) {
      console.error('Error al agregar la caja:', error);
    }
  };

  const handleDeleteBox = (boxId) => {
    // Aquí agregarías la lógica para eliminar una caja
    console.log('Eliminar caja con ID:', boxId);
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
          <h1>Boxes</h1>
          {permisos.turnero ? (
            <div className="button-container">
              <button 
                onClick={handleAddBoxClick} 
                className="add-box-button"
                disabled={!permisos.turnero.add_boxes}  
              >
                Agregar Caja
              </button>
            </div>
          ) : (
            <p>No se encontraron permisos para modificar las cajas</p>
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

        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre de caja</th>
                <th>Operador</th>
                <th>Estado</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {cajas.length > 0 ? (
                cajas.map((caja) => (
                  <tr key={caja.id}>
                    <td>{caja.nombre_box}</td>
                    <td>
                      {permisos.turnero && permisos.turnero.admin_usuarios_x_box ? (
                        <select
                          value={selectedBoxes[caja.id] || ''}
                          onChange={(e) => handleBoxChange(caja.id, e.target.value)}
                        >
                          <option value="">Sin Operador</option>
                          {usuarios.map((usuario) => (
                            <option key={usuario.LEGAJO} value={usuario.LEGAJO}>
                              {usuario.NOMBRECOMPLETO}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p>No se encontraron permisos para seleccionar usuarios</p>
                      )}
                    </td>
                    <td>
                      <select
                        value={selectedStatus[caja.id] || ''}
                        onChange={(e) => handleStatusChange(caja.id, e.target.value)}
                      >
                        <option value="Habilitado">Habilitado</option>
                        <option value="Deshabilitado">Deshabilitado</option>
                      </select>
                    </td>
                    <td>
                      <button className="delete-box-button" onClick={() => handleDeleteBox(caja.id)}>
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No hay cajas disponibles.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default CajaEmpleados;