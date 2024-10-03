import React, { useState } from 'react';
import './TurnoPantalla.css';
import { Link } from "react-router-dom";


export default function Sucursal() {
  const [sucursal, setSucursal] = useState('');

  const handleSucursalChange = (e) => {
    setSucursal(e.target.value);
  };

  const handleIniciarClick = () => {
    // Aquí puedes guardar la sucursal en una variable o realizar otra acción
    const seleccionada = sucursal;
    console.log(`Sucursal seleccionada: ${seleccionada}`); // Ejemplo de uso

    // Redirigir a otra página (si es necesario)

  };


  return (
    <div>
      <div className="principal">
      <h1 className="titulo">Sucursal: </h1>
      <select id="sucursal-select" value={sucursal} onChange={handleSucursalChange} required>
          <option value=""disabled selected >Seleccione su sucursal</option>
          <option value="Sucursal Lujan de Cuyo">Sucursal Lujan de Cuyo</option>
          <option value="Sucursal Gueymallen">Sucursal Gueymallen</option>
          <option value="Sucursal Godoy Cruz">Sucursal Godoy Cruz</option>
          <option value="Sucursal San Rafael">Sucursal San Rafael</option>
          <option value="Sucursal Lavalle">Sucursal Lavalle</option>
        </select>
      </div>
      {sucursal && <p>Sucursal seleccionada: {sucursal}</p>}
      <Link to="/pantalla">
      {sucursal && (
        <button onClick={handleIniciarClick}>Iniciar Turnero</button> // Botón "Iniciar" solo aparece si se selecciona una sucursal
      )}
      </Link>

    </div>
  );
}
