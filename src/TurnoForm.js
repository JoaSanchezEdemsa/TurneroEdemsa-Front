// import React, { useState } from 'react';

// const TurnoForm = () => {
//   const [nombre, setNombre] = useState('');
//   const [apellido, setApellido] = useState('');
//   const [dni, setDni] = useState('');
//   const [especificacion, setEspecificacion] = useState('');
//   const [turno, setTurno] = useState(null);

//   // Variables para manejar la generación de turnos
//   const [letraIndex, setLetraIndex] = useState(0); // Índice para las letras
//   const [numeroTurno, setNumeroTurno] = useState(0); // Número del turno

//   const letras = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     // Generar el turno
//     const nuevoTurno = generarTurno();
//     setTurno(nuevoTurno);
    
//     // Incrementar el número del turno
//     if (numeroTurno < 99) {
//       setNumeroTurno(numeroTurno + 1);
//     } else {
//       setNumeroTurno(0);
//       if (letraIndex < letras.length - 1) {
//         setLetraIndex(letraIndex + 1);
//       } else {
//         // Reiniciar lógica si se llega al límite de letras
//         setLetraIndex(0);
//       }
//     }
//   };

//   const generarTurno = () => {
//     const letra1 = letras[Math.floor(letraIndex / 26)];
//     const letra2 = letras[letraIndex % 26];
//     const numero = String(numeroTurno).padStart(2, '0'); // Asegurarse de que el número tenga 2 dígitos
//     return `${letra1}${letra2}${numero}`;
//   };

//   if (turno) {
//     return (
//       <div>
//         <h2>Tu turno: {turno}</h2>
//         <p>Nombre y Apellido: {nombre} {apellido}</p>
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label>Nombre y Apellido:</label>
//         <input 
//           type="text" 
//           value={nombre} 
//           onChange={(e) => setNombre(e.target.value)} 
//           required 
//         />
//       </div>
//       <div>
//         <label>DNI:</label>
//         <input 
//           type="text" 
//           value={dni} 
//           onChange={(e) => setDni(e.target.value)} 
//           required 
//         />
//       </div>
//       <div>
//         <label>Especificación:</label>
//         <select 
//           value={especificacion} 
//           onChange={(e) => setEspecificacion(e.target.value)} 
//           required 
//         >
//           <option value="">Seleccione...</option>
//           <option value="opcion1">Opción 1</option>
//           <option value="opcion2">Opción 2</option>
//           <option value="opcion3">Opción 3</option>
//         </select>
//       </div>
//       <button type="submit">Sacar Turno</button>
//     </form>
//   );
// };

// export default TurnoForm;
