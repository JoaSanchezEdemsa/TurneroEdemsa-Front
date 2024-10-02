import React from 'react';
import './Pantalla.css'; 

const Pantalla = () => {
  // Aquí puedes definir los turnos que están por llamar
  const turnosPorLlamar = [
    "A1",
    "B2",
    "C3",
    "D4",
    "E5"
  ];

  return (
    <div className="pantalla-container">
      <header className="pantalla-header">
        <div className="logo">
          <img src="ruta/a/tu/logo.png" alt="Logo" /> {/* Reemplaza con tu logo */}
        </div>
        <div className="turno-actual">
          <h2>Turno: A1</h2> {/* Reemplaza con el turno actual que desees mostrar */}
        </div>
      </header>
      <div className="turnos-llamar">
        <h3>Turnos por Llamar:</h3>
        <ul>
          {turnosPorLlamar.map(turno => (
            <li key={turno}>{turno}</li>
          ))}
        </ul>
      </div>
      <div className="imagen-lateral">
        <img src="ruta/a/tu/imagen.png" alt="Descripción" /> {/* Reemplaza con tu imagen */}
      </div>
    </div>
  );
};

export default Pantalla;
