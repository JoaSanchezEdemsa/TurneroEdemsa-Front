
import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();


  useEffect(() => {
    // Verificar el localStorage al montar el componente
    if (!(localStorage.getItem("me") > 0)) {
      navigate('/');
    }
  }, [navigate]);
  
  const empleados = [
    { hora: "10:10", nombre: "Pepito Hongito", DNI: "45034923", id: "300009" },
    { hora: "10:20", nombre: "Pepito Hongito", DNI: "45034923", id: "300009" },
    { hora: "10:30", nombre: "Pepito Hongito", DNI: "45034923", id: "300009" },
    // Añade más datos según sea necesario
  ];

  const handleCajasClick = () => {
    navigate('/boxes');
  };

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <button className="sidebar-button">Turnos</button>
        <button className="sidebar-button">Configuración</button>
        <button onClick={handleCajasClick} className="sidebar-button">
          Asignación de empleados
        </button>
      </aside>

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
                <th>Nombre</th>
                <th>DNI</th>
                <th>ID</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((empleado, index) => (
                <tr key={index}>
                  <td>{empleado.hora}</td>
                  <td>{empleado.nombre}</td>
                  <td>{empleado.DNI}</td>
                  <td>{empleado.id}</td>
                  <td><button className="action-button">Acción</button></td>
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
