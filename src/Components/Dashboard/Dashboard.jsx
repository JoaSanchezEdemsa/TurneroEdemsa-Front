import React, { useState, useEffect, useRef } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSyncAlt } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const [turnos, setTurnos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [llamados, setLlamados] = useState({});
  const [motivos, setMotivos] = useState([]);
  const [selectedMotivo, setSelectedMotivo] = useState('');
  const [nicValue, setNicValue] = useState('');
  const refreshTimeoutRef = useRef(null);


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

  useEffect(() => {
    if (!(localStorage.getItem("me") > 0)) {
      navigate('/');
      localStorage.removeItem('llamados');
    }
    fetchTurnos();
    refreshTimeoutRef.current = setInterval(fetchTurnos, 180000);
    return () => clearInterval(refreshTimeoutRef.current);
  }, [navigate]);

  const handleReloadClick = () => {
    fetchTurnos();
  };

  const handleCajasClick = () => {
    navigate('/boxes');
  };

  const handleConfigClick = () => {
    navigate('/config');
  };

  const handleMotivoChange = (event) => {
    setSelectedMotivo(event.target.value);
  };

  const handleNicChange = (event) => {
    setNicValue(event.target.value);
  };

  const handleLlamarClick = async (turnoId) => {
    const nick = localStorage.getItem('me');
    if (!nick) {
      console.error('No se encontró el nick en el localStorage');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/getstatusturno', {
        id: turnoId,
        NICK: nick,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data) {
        alert('Se ha llamado al cliente');
      }

      const updatedLlamados = {
        ...llamados,
        [turnoId]: true,
      };
      setLlamados(updatedLlamados);
      localStorage.setItem('llamados', JSON.stringify(updatedLlamados));
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }
  };

  const fetchMotivos = async () => {
    try {
      const response = await axios.post('http://localhost:8080/getmotivosopen');
      if (response.data) {
        setMotivos(response.data.result);
      }
    } catch (error) {
      console.error('Error al obtener los motivos:', error);
    }
  };

  const handleConfirmarClick = async () => {
    const nick = localStorage.getItem('me');
    if (!nick) {
      console.error('No se encontró el nick en el localStorage');
      return;
    }

    if (!selectedMotivo || !nicValue) {
      alert('Debe seleccionar un motivo y llenar el NIC.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/getstatusturnofinalizado', {
        id: selectedTurno.id,
        NICK: nick,
        NIC: nicValue,
        CODIGO: selectedMotivo
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data) {
        alert('El turno ha sido finalizado exitosamente');
        closeModal();
      }
    } catch (error) {
      console.error('Error al finalizar el turno:', error);
    }
  };


  const handleFinalizarClick = (turno) => {
    setSelectedTurno(turno);
    setIsModalOpen(true);
    fetchMotivos();
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
          <FaSyncAlt className="reload-icon" onClick={handleReloadClick} title="Recargar" />
          <div className="button-group">
            <button className="header-button">Todos</button>
            <button className="header-button">Pendientes</button>
            <button className="header-button">En curso</button>
            <button className="header-button">Finalizados</button>
          </div>
        </header>
        <div className="empleado-table-container">
          <table className="empleado-table">
            <thead>
              <tr>
                <th>Hora</th>
                <th>Cliente | Motivo</th>
                <th>Procedencia</th>
                <th>NIC</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {turnos.map((turno, index) => (
                <tr key={index}>
                  <td>{turno.hora}</td>
                  <td>
                    {turno.cliente}
                    <br />
                    {turno.motivo ? turno.motivo : '-'}
                  </td>
                  <td>{turno.procedencia}</td>
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
              <select className="modal-dropdown" value={selectedMotivo} onChange={handleMotivoChange}>
                <option value="" required>Seleccione el motivo</option>
                {motivos.map((motivo, index) => (
                  <option key={index} value={motivo.CODIGO}>{motivo.MOTIVO}</option>
                ))}
              </select>
              <textarea className="modal-input" placeholder="Descripción" rows="3" required></textarea>
              <input type="number" className="modal-input" placeholder="NIC" value={nicValue} onChange={handleNicChange} pattern="\d*" required />
            </div>

            <div className="modal-buttons-horizontal">
              <button className="modal-action-button" onClick={closeModal}>
                Cancelar
              </button>
              <button className="modal-action-button" onClick={handleConfirmarClick}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
