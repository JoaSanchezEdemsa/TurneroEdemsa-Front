// Header.jsx
import React, { useEffect, useState } from 'react';
import './Header.css'; // Importamos el CSS específico para el Header
import perfil from '../Img/perfil.png'; // Importamos la imagen del perfil

const Header = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Obtener el nombre del usuario desde localStorage
    const user = localStorage.getItem('me');
    if (user) {
      setUserName(user); // Guardamos el nombre del usuario en el estado
    }
  }, []);

  const handleLogout = () => {
    // Eliminar los items de localStorage
    localStorage.removeItem('me');
    localStorage.removeItem('sucursal');
    // Recargar la página o redirigir a la página de inicio
    window.location.reload();
  };

  return (
    <header className="App-header">
      <div className="header-left">
        <h1 className="title">Turnero</h1> {/* Título a la izquierda */}
      </div>
      <div className="header-right"> {/* Imagen y nombre del usuario a la derecha */}
        <img src={perfil} alt="User Avatar" className="user-avatar" />
        <span className="user-name">{userName || 'Usuario'}</span>
        <button className="header-button" onClick={handleLogout}>
          Salir
        </button>
      </div>
    </header>
  );
};

export default Header;
