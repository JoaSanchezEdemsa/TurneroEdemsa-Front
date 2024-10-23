import React, { useEffect, useState } from 'react';
import './Header.css'; 
import perfil from '../Img/perfil.png';

const Header = () => {
  const [userName, setUserName] = useState('');
  const [currentSucursal, setCurrentSucursal] = useState('');

  useEffect(() => {

    const user = localStorage.getItem('usuario');
    if (user) {
      setUserName(user); 
    }

    const sucursal = localStorage.getItem('sucursalNombre');
    if (sucursal) {
      setCurrentSucursal(sucursal);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('me');
    localStorage.removeItem('sucursal');
    localStorage.removeItem('usuario');
    localStorage.removeItem('sucursalNombre');
    localStorage.removeItem('modo_de_renderizado_botones')
    window.location.reload();
  };

  return (
    <header className="App-header">
      <div className="header-left">
        <h1 className="title">Turnero</h1> 
      </div>
      <div className="header-right"> 
        <span className="sucursal-info">Sucursal actual: {currentSucursal || 'No asignada'}</span>
      </div>
      <div className="header-right"> 
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
