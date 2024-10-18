import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoMdSettings } from "react-icons/io"; // Importa el ícono aquí

const Dashboard = () => {
  const navigate = useNavigate();
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    if (!(localStorage.getItem("me") > 0)) {
      navigate('/');
    }
  }, [navigate]);

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
    fetchTurnos();
  }, []);

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
                      <button className="action-button">Llamar</button>
                      <button className="action-button action-button-secondary">Finalizar</button>
                      <button className="config-button action">
                        <IoMdSettings />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

