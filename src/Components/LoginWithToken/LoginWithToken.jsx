import React, {useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginWithToken = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token'); // Obtener el token de la URL

        if (!token) {
          throw new Error('No se encontró el token');
        }

        // Hacer la solicitud con el token
        const response = await axios.get('http://turnero:8080/login', {
          params: { token }, 
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Verificar si la respuesta fue exitosa y los datos son correctos
        if (!response.data.success || response.data.result === false) {
          throw new Error('No se encontraron datos para el token proporcionado');
        }
                
        localStorage.setItem('me', response.data.result.nick); // Almacenar en el localStorage

        // Verifica si el objeto 'response.data.result' tiene datos válidos
      if (response.data.result && response.data.result.usuarioOPEN) {
          // Si el objeto tiene el atributo COD_UNICOM, lo almacenas en localStorage
          localStorage.setItem('sucursal', response.data.result.usuarioOPEN.COD_UNICOM);
        } else {
              localStorage.setItem('sucursal', null); // Almacena un valor por defecto si no hay datos
        }


        navigate('/dashboard'); // Navegar a la página de inicio

      } catch (err) {
        return "error";
      }
    };

    fetchData(); // Solo dispara una vez

  }, []); // Vacío significa que se ejecuta solo una vez al montar

  return (""
  );
};

export default LoginWithToken;
