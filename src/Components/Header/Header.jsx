// Header.jsx
import React from 'react';
import './Header.css'; // Importamos el CSS específico para el Header

const Header = () => {
  const handleLogout = () => {
    // Eliminar los items de localStorage
    localStorage.removeItem('me');
    localStorage.removeItem('sucursal');
    // Recargar la página o redirigir a la página de inicio
    window.location.reload();
  };

  return (
    <header className="App-header"> {/* Aplicamos la clase App-header para un estilo consistente */}
      <h1 className="header-title">Turnero</h1>
      <button className="header-button" onClick={handleLogout}>
        Salir
      </button>
    </header>
  );
};

export default Header;
