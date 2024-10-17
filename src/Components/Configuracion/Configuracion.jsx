import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './Configuracion.css';
import { useNavigate } from 'react-router-dom';

const Configuracion = () => {
  const navigate = useNavigate();
  const [permiso, setPermisos] = useState(null); // Estado para los permisos
  const [nick, setNick] = useState(''); // Estado para almacenar el nick
  const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar si es admin

  useEffect(() => {
    // Verificar el localStorage al montar el componente
    const storedNick = localStorage.getItem("me");
    if (!(storedNick > 0)) {
      navigate('/');
    } else {
      setNick(storedNick);
      if (storedNick === '2000826') {
        setIsAdmin(true); // Si el nick es 2000826, el usuario es admin
      }
    }
  }, [navigate]);

  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        if (!nick) {
          console.error('No se encontró el nick en el localStorage');
          return;
        }

        const response = await axios.get('http://localhost:8080/getpermisosbynick', {
          params: { NICK: nick },
        });

        if (response.data && response.data.result) {
          setPermisos(response.data.result); // Guardamos los permisos en el estado
        } else {
          console.error('No se encontraron permisos con ese nick');
          setPermisos(null);
        }
      } catch (error) {
        console.error('Error al obtener permisos:', error);
      }
    };
    if (nick) {
      fetchPermisos();
    }
  }, [nick]);

  // Función para alternar los permisos (Sí/No)
  const togglePermiso = async (permisoCategory, permisoKey) => {
    if (permiso && permiso[permisoCategory]) {
      const nuevoValor = !permiso[permisoCategory][permisoKey];
      const updatedPermisos = {
        ...permiso,
        [permisoCategory]: {
          ...permiso[permisoCategory],
          [permisoKey]: nuevoValor,
        },
      };

      setPermisos(updatedPermisos); // Actualizamos el estado local

      try {
        // Aquí puedes hacer una llamada al backend para actualizar el permiso
        await axios.post('http://localhost:8080/updatePermiso', {
          nick: nick,
          category: permisoCategory,
          key: permisoKey,
          value: nuevoValor,
        });
      } catch (error) {
        console.error('Error al actualizar el permiso:', error);
      }
    }
  };

  const traducirPermiso = (permiso) => {
    return permiso ? 'Sí' : 'No';
  };

  return (
    <div className="configuracion-page">
      <aside className="sidebar">
        <button className="sidebar-button" onClick={() => navigate('/dashboard')}>Turnos</button>
        <button className="sidebar-button" onClick={() => navigate('/config')}>Configuración</button>
        <button className="sidebar-button" onClick={() => navigate('/boxes')}>Asignación de empleados</button>
      </aside>

      <main className="content">
        <header className="header">
          <h1>Configuración</h1>
        </header>

        <div className="configuracion-content">
          <h2>Permisos - Turnero</h2>
          {permiso && permiso.turnero ? (
            <ul className="permisos-list">
              {Object.keys(permiso.turnero).map((permisoKey) => (
                <li key={permisoKey}>
                  {permisoKey.replace(/_/g, ' ')}: {traducirPermiso(permiso.turnero[permisoKey])}
                  {isAdmin && (
                    <button
                      className="toggle-permiso-btn"
                      onClick={() => togglePermiso('turnero', permisoKey)}
                    >
                      Cambiar a {permiso.turnero[permisoKey] ? 'No' : 'Sí'}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>Cargando permisos...</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Configuracion;
