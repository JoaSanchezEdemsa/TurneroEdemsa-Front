import React, {useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginWithToken = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token'); 

        if (!token) {
          throw new Error('No se encontró el token');
        }

        const response = await axios.get('http://turnero:8080/login', {
          params: { token }, 
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.data.success || response.data.result === false) {
          throw new Error('No se encontraron datos para el token proporcionado');
        }
                
        localStorage.setItem('me', response.data.result.nick); 
        localStorage.setItem('usuario', response.data.result.USUARIO);

      if (response.data.result && response.data.result.usuarioOPEN) {
          localStorage.setItem('sucursal', response.data.result.usuarioOPEN.COD_UNICOM);
          localStorage.setItem('sucursalNombre', response.data.result.usuarioOPEN.NOM_UNICOM);

        } else {
              localStorage.setItem('sucursal', null); 
        }

        navigate('/dashboard');

      } catch (err) {
        return "error";
      }
    };

    fetchData(); 

  }, []); 

  return (""
  );
};

export default LoginWithToken;
