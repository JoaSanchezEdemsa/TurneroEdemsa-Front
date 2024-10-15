import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Components/Dashboard/Dashboard'; // Asegúrate de que la ruta sea correcta
import CajaEmpleados from './Components/CajaEmpleados/CajaEmpleados';
import Session from './Components/Session/Session';
import LoginWithToken from './Components/LoginWithToken/LoginWithToken';  
import Login from './Components/Login/Login';
function App() {
  return (
    <Router>
      
          <Routes>
            <Route path="/boxes" element={<CajaEmpleados />} /> 
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/session" element={<Session />} />
            <Route path="/loginwithtoken" element={<LoginWithToken/>}/>
            <Route path="/login" element={<Login/>}/>
          </Routes>
      
    </Router>
  );
}

export default App;
