import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './Configuracion.css';
import { useNavigate } from 'react-router-dom';

const Configuracion = () => {
  const navigate = useNavigate();
  const [permisos, setPermisos] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedUserPermissions, setSelectedUserPermissions] = useState(null);
  const [selectedUserNick, setSelectedUserNick] = useState(null);
  const [selectedSucursal, setSelectedSucursal] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    if (!(localStorage.getItem('me') > 0)) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    fetchPermisos();
    fetchSucursales();
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

  const fetchSucursales = async () => {
    try {
      const response = await axios.get('http://turnero:8080/getsucursales');
      if (Array.isArray(response.data)) {
        setSucursales(response.data);
      } else {
        console.error('La respuesta no es válida:', response.data);
      }
    } catch (error) {
      console.error('Error al obtener sucursales:', error);
    }
  };

  const showPermissionsInDiv = async (usuario) => {
    try {
      const response = await axios.get('http://localhost:8080/getpermisosbynick', {
        params: { NICK: usuario.LEGAJO },
      });

      if (response.data) {
        setSelectedUserPermissions(response.data.result);
        setSelectedUserNick(usuario.LEGAJO);
        console.log(response.data.result);
      } else {
        console.error('No se encontraron permisos para el usuario seleccionado');
      }
    } catch (error) {
      console.error('Error al obtener permisos del usuario:', error);
    }
  };

  const handleChangeSucursal = () => {
    if (selectedSucursal) {
      const sucursalSeleccionada = sucursales.find(s => s.NOM_UNICOM === selectedSucursal);
      if (sucursalSeleccionada) {
        localStorage.setItem('sucursalNombre', sucursalSeleccionada.NOM_UNICOM);  // Guardar nombre
        localStorage.setItem('sucursal', sucursalSeleccionada.COD_UNICOM);  // Guardar código
        console.log(`Sucursal cambiada a: ${sucursalSeleccionada.NOM_UNICOM} (${sucursalSeleccionada.COD_UNICOM})`);
        window.location.reload();
      }
    } else {
      console.log('No se ha seleccionado ninguna sucursal.');
    }
  };

  const handleUserChange = (event) => {
    const selectedLegajo = event.target.value;
    const selectedUsuario = usuarios.find((usuario) => usuario.LEGAJO === selectedLegajo);
    setSelectedUser(selectedUsuario);
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
          {isAdmin && (
            <div className="sucursales-section">
              <h3>Seleccionar Sucursal</h3>
              <select
                  value={selectedSucursal}
                  onChange={(e) => setSelectedSucursal(e.target.value)}  // Ya estaba correcto
                >
                  <option value="">Seleccionar una sucursal</option>
                  {sucursales.map((sucursal) => (
                    <option key={sucursal.COD_UNICOM} value={sucursal.NOM_UNICOM}>
                      {sucursal.NOM_UNICOM}
                    </option>
                  ))}
                </select>
              <button
                className="modal-close-button"
                onClick={handleChangeSucursal}
                disabled={!selectedSucursal}
              >
                Cambiar de Sucursal
              </button>
            </div>
          )}

          {permisos ? (
            <div className="permisos-section">
              <h2>Permisos - Turnero</h2>
              {permisos.turnero ? (
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
              ) : (
                <p>No se encontraron permisos para este usuario.</p>
              )}
            </div>
          ) : (
            <p>Cargando permisos...</p>
          )}
        </div>
      </main>

      {isAdmin && (
        <div className="vista-administrador">
          <h2>Vista del Administrador</h2>
          <div className="admin-section">
            <h3>Seleccionar Usuario</h3>
            <select value={selectedUser?.LEGAJO || ''} onChange={handleUserChange}>
              <option value="">Seleccionar un empleado</option>
              {usuarios.map((usuario) => (
                <option key={usuario.LEGAJO} value={usuario.LEGAJO}>
                  {usuario.NOMBRECOMPLETO}
                </option>
              ))}
            </select>
            <button
              className="cambiar-permisos-button"
              onClick={() => showPermissionsInDiv(selectedUser)}
              disabled={!selectedUser}
            >
              Ver Permisos
            </button>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="vista-permisos">
          <h2>Permisos del Usuario</h2>
          <h3>{selectedUserNick || 'Seleccione un usuario para ver sus permisos'}</h3>
          {selectedUserPermissions && selectedUserPermissions.turnero ? (
            <div className="permisos-usuario">
              <p>Añadir boxes: {selectedUserPermissions.turnero.add_boxes ? 'Si' : 'No'}</p>
              <p>Añadir motivos de visita: {selectedUserPermissions.turnero.add_motivosvisita ? 'Si' : 'No'}</p>
              <p>Administrar usuarios en boxes: {selectedUserPermissions.turnero.admin_usuarios_x_box ? 'Si' : 'No'}</p>
              <p>Eliminar boxes: {selectedUserPermissions.turnero.del_boxes ? 'Si' : 'No'}</p>
              <p>Eliminar motivos de visita: {selectedUserPermissions.turnero.del_motivosvisita ? 'Si' : 'No'}</p>
              <p>Llamar turno: {selectedUserPermissions.turnero.llamar_turno ? 'Si' : 'No'}</p>
              <p>Ver motivos de visita: {selectedUserPermissions.turnero.ver_motivosvisita ? 'Si' : 'No'}</p>
              <p>Ver turnos: {selectedUserPermissions.turnero.ver_turnos ? 'Si' : 'No'}</p>
            </div>
          ) : (
            <p>No se encontraron permisos para este usuario.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Configuracion;
