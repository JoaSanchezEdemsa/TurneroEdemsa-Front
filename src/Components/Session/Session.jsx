import React, { useState, useEffect } from 'react';
import './Session.css';

const Session = () => {
  const [me, setMe] = useState(0);

  const getUsuario = async () => {



  }

  useEffect(() => {
    // Simulación de carga de datos (puedes reemplazar esto con una llamada a una API)
    setMe(localStorage.getItem("nick"));
  }, []); // El array vacío asegura que esto solo se ejecute una vez al montar el componente

  return (
    <div>
      <h1>Hola</h1>
      <ul>
   
          {me}

      </ul>
    </div>
  );
};

export default Session;
