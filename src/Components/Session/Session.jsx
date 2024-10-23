import React, { useState, useEffect } from 'react';
import './Session.css';

const Session = () => {
  const [me, setMe] = useState(0);

  const getUsuario = async () => {



  }

  useEffect(() => {
    setMe(localStorage.getItem("nick"));
  }, []); 

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
