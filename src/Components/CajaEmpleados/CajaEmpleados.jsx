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
  const [successMessage, setSuccessMessage] = useState(''); // Estado para el mensaje de éxito
  
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
        console.log(response.data.result);
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
    // Validar que el nombre de la caja no esté vacío
    if (!newBoxName.trim()) {
      console.error('El nombre de la caja es requerido.');
      alert('El nombre de la caja es requerido.'); // Muestra un mensaje de alerta
      return; // No continuar con el envío si el nombre está vacío
    }
  
    // Verificar si el nombre de la caja ya existe
    const boxExists = cajas.some((box) => box.nombre_box.toLowerCase() === newBoxName.trim().toLowerCase());
    
    if (boxExists) {
      console.error('Nombre del box repetido.');
      alert('Nombre del box repetido'); // Mostrar alerta si el nombre ya existe
      return; // No continuar si el nombre ya existe
    }
  
    try {
      const sucursal = localStorage.getItem('sucursal');
      const created_by = localStorage.getItem('me');
  
      console.log('Enviando solicitud para crear caja...');
      
      // Enviar solicitud al servidor para crear la caja
      const response = await axios.post('http://localhost:8080/addBox', { 
        nombre_box: newBoxName,
        COD_UNICOM: sucursal,
        created_by: created_by
      });
  
      console.log('Respuesta de la solicitud:', response.data);
  
      // Verifica que la respuesta contenga `success: true` y un `result`
      if (response.data && response.data.success && response.data.result) {
        const newBoxId = response.data.result;
  
        console.log('Caja creada con éxito, ID:', newBoxId);
  
        // Muestra el mensaje de éxito
        setSuccessMessage('Caja creada exitosamente');
        
        // Resetea el nombre de la caja
        setNewBoxName('');
        
        // Oculta el formulario
        setShowAddBoxForm(false);
  
        // Mostrar el mensaje por 3 segundos antes de ocultarlo y luego recargar la página
        setTimeout(() => {
          setSuccessMessage(''); // Oculta el mensaje manualmente después de 3 segundos
          window.location.reload(); // Recargar la página
        }, 3000); // 3 segundos
      } else {
        console.error('Error al agregar la caja: la respuesta no es válida o falta información.');
        alert('Error: No se pudo crear la caja.');
      }
    } catch (error) {
      console.error('Error al agregar la caja:', error);
      alert('Error: Ocurrió un problema al intentar agregar la caja.');
    }
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

        {successMessage && <div className="success-message">{successMessage}</div>} {/* Muestra el mensaje de éxito */}

        <div className="box">
          {cajas.length > 0 ? (
            cajas.map((caja) => (
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
                  <p>No se encontraron permisos para seleccionar usuarios</p>
                )}
              </div>
            ))
          ) : (
            <p>No hay cajas disponibles.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default CajaEmpleados;