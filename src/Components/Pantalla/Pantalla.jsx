import React, { useState } from 'react';
import './Pantalla.css';

const Turnos = () => {
    const [turnoActual, setTurnoActual] = useState('Turno 1');
    const [turnosEnEspera, setTurnosEnEspera] = useState(['Turno 2', 'Turno 3', 'Turno 4']);

    return (
        <div className="container">
            <header className="header">
                <h1>Gestión de Turnos</h1>
            </header>
            <div className="turno-actual">
                <div className="columna">
                    <h2>Turno</h2>
                    <p>{turnoActual}</p>
                </div>
                <div className="columna">
                    <h2>Box</h2>
                    <p>Box 1</p>
                </div>
            </div>
            <div className="turnos-espera">
                <h2>Turnos en Espera</h2>
                <ul>
                    {turnosEnEspera.map((turno, index) => (
                        <li key={index}>{turno}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Turnos;
