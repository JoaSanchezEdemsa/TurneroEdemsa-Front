import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [turnos, setTurnos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [llamados, setLlamados] = useState({});

  useEffect(() => {
    if (!(localStorage.getItem("me") > 0)) {
      navigate('/');
      localStorage.removeItem('llamados');
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

  useEffect(() => {
    const savedLlamados = localStorage.getItem('llamados');
    if (savedLlamados) {
      setLlamados(JSON.parse(savedLlamados));
    }
  }, []);

  const handleCajasClick = () => {
    navigate('/boxes');
  };

  const handleConfigClick = () => {
    navigate('/config');
  };

  const handleLlamarClick = (turnoId) => {
    alert('Se ha llamado al cliente');

    const updatedLlamados = {
      ...llamados,
      [turnoId]: true,
    };
    setLlamados(updatedLlamados);

    localStorage.setItem('llamados', JSON.stringify(updatedLlamados));
  };

  const handleFinalizarClick = (turno) => {
    setSelectedTurno(turno);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTurno(null);
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
          <h1>Turnos</h1>
          <div className="status-buttons">
            <button className='status-button'>Todos</button>
            <button className="status-button">Pendiente</button>
            <button className="status-button">En Curso</button>
            <button className="status-button">Finalizado</button>
          </div>
        </header>
        <div className="empleado-table-container">
          <table className="empleado-table">
            <thead>
              <tr>
                <th>Hora</th>
                <th>Procedencia</th>
                <th>Cliente</th>
                <th>Motivo</th>
                <th>NIC</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {turnos.map((turno, index) => (
                <tr key={index}>
                  <td>{turno.hora}</td>
                  <td>{turno.procedencia}</td>
                  <td>
                    {turno.cliente ? turno.cliente.split(' ').map((parte, idx) => (
                      <React.Fragment key={idx}>
                        {parte}
                        <br />
                      </React.Fragment>
                    )) : '-'}
                  </td>
                  <td>{turno.motivo}</td>
                  <td>
                    {turno.NIC ? turno.NIC.split(',').map((nicPart, idx) => (
                      <React.Fragment key={idx}>
                        {nicPart}
                        <br />
                      </React.Fragment>
                    )) : '-'}
                  </td>
                  <td>{turno.estado}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-button"
                        onClick={() => handleLlamarClick(turno.id)}
                      >
                        Llamar
                      </button>
                      {llamados[turno.id] && (
                        <button
                          className="action-button action-button-secondary"
                          onClick={() => handleFinalizarClick(turno)}
                        >
                          Finalizar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Finalizar Turno</h2>
            <p>¿Está seguro de que desea finalizar el turno de {selectedTurno?.cliente}?</p>
            <div className="modal-options">
              <select className="modal-dropdown">
                <option value="">Seleccione el motivo</option>
                <option value="motivo1">Motivo 1</option>
                <option value="motivo2">Motivo 2</option>
                <option value="motivo3">Motivo 3</option>
              </select>
              <input type="text" className="modal-input" placeholder="Descripción" />
              <input type="number" className="modal-input" placeholder="NIC" pattern="\d*" />
            </div>

            <div className="modal-buttons-horizontal">
              <button className="modal-action-button" onClick={closeModal}>
                Cancelar
              </button>
              <button className="modal-action-button">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
