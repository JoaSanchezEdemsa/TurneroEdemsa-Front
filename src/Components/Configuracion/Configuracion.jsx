import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './Configuracion.css';
import { useNavigate } from 'react-router-dom';

const Configuracion = () => {
  const navigate = useNavigate();
  const [permisos, setPermisos] = useState(null);

  useEffect(() => {
    // Verificar el localStorage al montar el componente
    if (!(localStorage.getItem('me') > 0)) {
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
    fetchPermisos();
  }, []);

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
          {/* Sección de permisos */}
          {permisos ? (
            <div className="permisos-section">
              <h2>Permisos - Turnero</h2>
              <ul>
                <li>Añadir boxes: {permisos.turnero.add_boxes ? 'Si' : 'No'}</li>
                <li>Añadir motivos de visita: {permisos.turnero.add_motivosvisita ? 'Si' : 'No'}</li>
                <li>Administrar usuarios en boxes: {permisos.turnero.admin_usuarios_x_box ? 'Si' : 'No'}</li>
                <li>Eliminar boxes: {permisos.turnero.del_boxes ? 'Si' : 'No'}</li>
                <li>Eliminar motivos de visita: {permisos.turnero.del_motivosvisita ? 'Si' : 'No'}</li>
                <li>Llamar turno: {permisos.turnero.llamar_turno ? 'Si' : 'No'}</li>
                <li>Ver motivos de visita: {permisos.turnero.ver_motivosvisita ? 'Si' : 'No'}</li>
                <li>Ver turnos: {permisos.turnero.ver_turnos ? 'Si' : 'No'}</li>
              </ul>
            </div>
          ) : (
            <p>Cargando permisos...</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Configuracion;
