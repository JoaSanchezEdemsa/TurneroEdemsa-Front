import React, { useState, useEffect } from 'react';

const LoginWithToken = () => {
  const [me, setMe] = useState(null); // Estado para almacenar la información del empleado
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token'); // Obtener el token del parámetro de la URL

        if (!token) {
          throw new Error('No se encontró el token');
        }

        const response = await fetch(`http://turnero:8080/login?token=${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Verifica el estado HTTP
        if (!response.ok) {
          throw new Error('Error en la solicitud'); // Captura errores de estado
        }

        const data = await response.json();
        setMe(data); // Asigna el resultado a 'me', que es el empleadoData

      } catch (err) {
        setError(err.message); // Guarda el mensaje de error
      }
    };

    fetchData();
  }, []); // Se ejecuta una vez al montar el componente

  return (
    <div>
      <h1>Información del Empleado</h1>
      {error && <p>Error: {error}</p>} {/* Muestra el error si existe */}
      {me && (
        <ul>
          {/* Si 'me' es un objeto, puedes iterar sobre sus propiedades */}
          {Object.entries(me).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {JSON.stringify(value)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LoginWithToken;
