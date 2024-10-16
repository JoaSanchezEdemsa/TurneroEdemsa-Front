import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './Configuracion.css';
import { useNavigate } from 'react-router-dom';

const Configuracion = () => {
  const navigate = useNavigate();
  const [permisos, setPermisos] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedUserPermissions, setSelectedUserPermissions] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserNick, setSelectedUserNick] = useState(null);

  useEffect(() => {
    if (!(localStorage.getItem('me') > 0)) {
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

        if (nick === '2000826') {
          setIsAdmin(true);
          fetchUsuarios();
        }
      } else {
        console.error('No se encontraron permisos con ese nick');
        setPermisos(null);
      }
    } catch (error) {
      console.error('Error al obtener permisos:', error);
    }
  };

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


  const openPermissionsModal = async (usuario) => {
    try {
      const response = await axios.get('http://localhost:8080/getpermisosbynick', {
        params: { NICK: usuario.LEGAJO },
      });

      if (response.data) {
        setSelectedUserPermissions(response.data.result);
        setSelectedUserNick(usuario.LEGAJO);
        setIsModalOpen(true);
        console.log(response.data.result);
      } else {
        console.error('No se encontraron permisos para el usuario seleccionado');
      }
    } catch (error) {
      console.error('Error al obtener permisos del usuario:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

          {isAdmin && (
            <div className="admin-section">
              <h2>Vista del Administrador</h2>
              <ul>
                {usuarios.map((usuario) => (
                  <li key={usuario.LEGAJO}>
                    {usuario.NOMBRECOMPLETO}
                    <button className="cambiar-permisos-button" onClick={() => openPermissionsModal(usuario)}>Ver permisos</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isModalOpen && (
            <div className="modal-overlay" onClick={handleCloseModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Permisos del Usuario</h2>
                {selectedUserPermissions ? (
                  <ul>
                    <li>Añadir boxes: {selectedUserPermissions.turnero.add_boxes ? 'Si' : 'No'}</li>
                    <li>Añadir motivos de visita: {selectedUserPermissions.turnero.add_motivosvisita ? 'Si' : 'No'}</li>
                    <li>Administrar usuarios en boxes: {selectedUserPermissions.turnero.admin_usuarios_x_box ? 'Si' : 'No'}</li>
                    <li>Eliminar boxes: {selectedUserPermissions.turnero.del_boxes ? 'Si' : 'No'}</li>
                    <li>Eliminar motivos de visita: {selectedUserPermissions.turnero.del_motivosvisita ? 'Si' : 'No'}</li>
                    <li>Llamar turno: {selectedUserPermissions.turnero.llamar_turno ? 'Si' : 'No'}</li>
                    <li>Ver motivos de visita: {selectedUserPermissions.turnero.ver_motivosvisita ? 'Si' : 'No'}</li>
                    <li>Ver turnos: {selectedUserPermissions.turnero.ver_turnos ? 'Si' : 'No'}</li>
                  </ul>
                ) : (
                  <p>No se encontraron permisos para este usuario.</p>
                )}
                <button className="cerrar-button" onClick={handleCloseModal}>Cerrar</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Configuracion;
