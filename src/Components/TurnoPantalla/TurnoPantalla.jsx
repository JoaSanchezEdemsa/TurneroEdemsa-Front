import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 


const TurnoForm = () => {
  const [sucursal, setSucursal] = useState('');
  const navigate = useNavigate();

  const handleSucursalChange = (e) => {
    setSucursal(e.target.value);
  };

  const handleIniciarClick = () => {
    navigate('/pantalla'); 
  };

  return (
    <div>
      <div>
        <label>Sucursal:</label>
        <select 
          value={sucursal} 
          onChange={handleSucursalChange} 
          required 
        >
          <option value="">Seleccione...</option>
          <option value="Sucursal Lujan de Cuyo">Sucursal Lujan de Cuyo</option>
          <option value="Sucursal Gueymallen">Sucursal Gueymallen</option>
          <option value="Sucursal Godoy Cruz">Sucursal Godoy Cruz</option>
          <option value="Sucursal San Rafael">Sucursal San Rafael</option>
          <option value="Sucursal Lavalle">Sucursal Lavalle</option>
        </select>
      </div>
      {sucursal && <p>Sucursal seleccionada: {sucursal}</p>}
      <button onClick={handleIniciarClick}>Iniciar</button> 
    </div>
  );
};

export default TurnoForm;
