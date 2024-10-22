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
  const [filteredTurnos, setFilteredTurnos] = useState([]);
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
        const sortedTurnos = sortTurnos(response.data.result);
        setTurnos(sortedTurnos);
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
        handleReloadClick();
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
        handleReloadClick();
        setSelectedMotivo('');
        setNicValue('');
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

  const isTurnoCompletado = (turno) => {
    return turno.atendido_by && turno.atendido_at && turno.finalizado_by && turno.finalizado_at;
  };

  const isTurnoAtendidoPeroNoFinalizado = (turno) => {
    return turno.atendido_by && turno.atendido_at && !turno.finalizado_by && !turno.finalizado_at;
  };

  const sortTurnos = (turnos) => {
    return turnos
      .sort((a, b) => {
        if (a.estado === 'finalizado' && b.estado !== 'finalizado') {
          return 1;
        } else if (a.estado !== 'finalizado' && b.estado === 'finalizado') {
          return -1;
        }
        const formatter = new Intl.DateTimeFormat('es-AR', {          //EL FORMATTER SI LO ESTÁ USANDO, ES UN BUG//
          hour: 'numeric',
          minute: 'numeric',
          timeZone: 'America/Argentina/Mendoza',
          hour12: false
        });

        const parseTime = (hora) => {
          const [hours, minutes] = hora.split(':');
          return new Date(1970, 0, 1, hours, minutes);
        };

        const horaA = parseTime(a.hora);
        const horaB = parseTime(b.hora);

        return horaA - horaB;
      });
  };

  const applyFilter = (turnos) => {
    const renderMode = localStorage.getItem("modo_de_renderizado_botones");
    let filtered = turnos;

    switch (renderMode) {
      case "2": 
        filtered = turnos.filter(t => !t.finalizado_by && !t.finalizado_at && !t.atendido_by && !t.atendido_at);
        break;
      case "3": 
        filtered = turnos.filter(t => !t.finalizado_by && !t.finalizado_at && t.atendido_by && t.atendido_at);
        break;
      case "4": 
        filtered = turnos.filter(t => t.finalizado_by && t.finalizado_at && t.atendido_by && t.atendido_at);
        break;
      default: 
        filtered = turnos;
        break;
    }

    setFilteredTurnos(filtered);
  };

  const handleTodosClick = () => {
    localStorage.setItem("modo_de_renderizado_botones", "1");
    applyFilter(turnos);
  };

  const handlePendientesClick = () => {
    localStorage.setItem("modo_de_renderizado_botones", "2");
    applyFilter(turnos);
  };

  const handleEnCursoClick = () => {
    localStorage.setItem("modo_de_renderizado_botones", "3");
    applyFilter(turnos);
  };

  const handleFinalizadosClick = () => {
    localStorage.setItem("modo_de_renderizado_botones", "4");
    applyFilter(turnos);
  };

  const getRowStyle = (turno) => {
    if (turno.finalizado_by && turno.finalizado_at) {
      return { color: 'grey' }; 
    }
    if (!turno.finalizado_by && !turno.finalizado_at && !turno.atendido_by && !turno.atendido_at) {
      return { fontWeight: 'bold' }; 
    }
    return {}; 
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
          <button className="header-button" onClick={handleTodosClick}>Todos</button>
          <button className="header-button" onClick={handlePendientesClick}>Pendientes</button>
          <button className="header-button" onClick={handleEnCursoClick}>En curso</button>
          <button className="header-button" onClick={handleFinalizadosClick}>Finalizados</button>
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
            {filteredTurnos.map((turno, index) => (
              <tr key={index} style={getRowStyle(turno)}>
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
                      {isTurnoCompletado(turno) ? (
                        <>
                          <span>-</span>
                        </>
                      ) : isTurnoAtendidoPeroNoFinalizado(turno) ? (
                        <>
                          <button
                            className="action-button"
                            onClick={() => handleLlamarClick(turno.id)}
                          >
                            Llamar
                          </button>
                          <button
                            className="action-button action-button-secondary"
                            onClick={() => handleFinalizarClick(turno)}
                          >
                            Finalizar
                          </button>
                        </>
                      ) : (
                        <>
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
                        </>
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
              <button className="modal-action-button" onClick={() => {
                handleReloadClick();
                closeModal();
              }}>
                Cancelar
              </button>
              <button className="modal-action-button" onClick={() => {
                handleReloadClick();
                handleConfirmarClick();
              }}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
