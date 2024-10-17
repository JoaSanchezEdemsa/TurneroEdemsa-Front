import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './Configuracion.css';
import { useNavigate } from 'react-router-dom';

const Configuracion = () => {
  const navigate = useNavigate();
  const [permiso, setPermisos] = useState(null); // Ahora solo manejamos un objeto de permisos en vez de array.

  useEffect(() => {
    // Verificar el localStorage al montar el componente
    if (!(localStorage.getItem("me") > 0)) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
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

        if (response.data && response.data.result) {
          setPermisos(response.data.result); // Guardamos todos los permisos en el estado
        } else {
          console.error('No se encontraron permisos con ese nick');
          setPermisos(null);
        }
      } catch (error) {
        console.error('Error al obtener permisos:', error);
      }
    };
    fetchPermisos();
  }, []);

  // Función para traducir los permisos a texto legible
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
              <li>Añadir boxes: {traducirPermiso(permiso.turnero.add_boxes)}</li>
              <li>Añadir motivos de visita: {traducirPermiso(permiso.turnero.add_motivosvisita)}</li>
              <li>Administrar usuarios por box: {traducirPermiso(permiso.turnero.admin_usuarios_x_box)}</li>
              <li>Eliminar boxes: {traducirPermiso(permiso.turnero.del_boxes)}</li>
              <li>Eliminar motivos de visita: {traducirPermiso(permiso.turnero.del_motivosvisita)}</li>
              <li>Llamar turno: {traducirPermiso(permiso.turnero.llamar_turno)}</li>
              <li>Ver motivos de visita: {traducirPermiso(permiso.turnero.ver_motivosvisita)}</li>
              <li>Ver turnos: {traducirPermiso(permiso.turnero.ver_turnos)}</li>
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
