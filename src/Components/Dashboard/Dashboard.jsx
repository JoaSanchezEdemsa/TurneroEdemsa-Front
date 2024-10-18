import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoMdSettings } from "react-icons/io"; // Importa el ícono aquí

const Dashboard = () => {
  const navigate = useNavigate();
  const [turnos, setTurnos] = useState([]);
  const [permisos, setPermisos] = useState(null);

  // Verifica si el usuario está logueado
  useEffect(() => {
    if (!(localStorage.getItem("me") > 0)) {
      navigate('/');
    }
  }, [navigate]);

  // Obtener permisos del usuario actual
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

  // Obtener turnos si tiene permiso
  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const sucursal = localStorage.getItem('sucursal');
        if (!sucursal) {
          console.error('No se encontró la sucursal en el localStorage');
          return;
        }

        const response = await axios.get('http://localhost:8080/getturnosbycod', {
          params: { COD_UNICOM: sucursal },
        });

        if (response.data && Array.isArray(response.data.result)) {
          setTurnos(response.data.result);
        } else {
          console.error('No se encontraron turnos para la sucursal');
          setTurnos([]);
        }
      } catch (error) {
        console.error('Error al obtener turnos:', error);
      }
    };

    // Solo obtener turnos si el permiso "ver_turnos" es true
    if (permisos && permisos.turnero.ver_turnos) {
      fetchTurnos();
    }
  }, [permisos]);

  const handleCajasClick = () => {
    navigate('/boxes');
  };

  const handleConfigClick = () => {
    navigate('/config');
  };

  return (
    <div className="dashboard-page">
      <div className="sidebar">
        <button className="sidebar-button">Turnos</button>
        <button onClick={handleConfigClick} className="sidebar-button">Configuración</button>
        <button onClick={handleCajasClick} className="sidebar-button">
          Asignación de empleados
        </button>
      </div>

      <main className="content">
        <header className="header">
          <h1>Clientes</h1>
          <div className="status-buttons">
            <button className="status-button">Pendiente</button>
            <button className="status-button">En curso</button>
            <button className="status-button">Finalizado</button>
          </div>
        </header>

        <div className="empleado-table-container">
          {/* Mostrar turnos solo si el permiso ver_turnos es true */}
          {permisos && permisos.turnero.ver_turnos ? (
            <table className="empleado-table">
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Cliente</th>
                  <th>Motivo</th>
                  <th>ID</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {turnos.map((turno, index) => (
                  <tr key={index}>
                    <td>{turno.hora}</td>
                    <td>{turno.cliente}</td>
                    <td>{turno.motivo}</td>
                    <td>{turno.id}</td>
                    <td>
                      <div className="action-buttons">
                        {/* Condicionar el botón de "Llamar" según el permiso "llamar_turno" */}
                        {permisos.turnero.llamar_turno ? (
                          <>
                            <button className="action-button">Llamar</button>
                            <button className="action-button action-button-secondary">Finalizar</button>
                          </>
                        ) : (
                          <h6>No tienes permisos para llamar</h6>
                        )}
                        <button className="config-button action">
                          <IoMdSettings />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // Mensaje cuando no tiene permiso para ver turnos
            <h1>No tienes permiso para ver los turnos</h1>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
