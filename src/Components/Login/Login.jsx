import { useEffect } from 'react';

const Login = () => {
    useEffect(() => {
        // Verificar el localStorage al montar el componente
        if (!(localStorage.getItem("me") > 0)) {
            // Redirigir a la URL externa
            window.location.href = 'https://accounts.edemsa.local?from=http://turnero:3000';
        } else {
            // Navegar a la ruta interna
            window.location.href = '/dashboard'; // O usa navigate si tienes rutas internas que deseas manejar
        }
    }, []);
    
    return null; // O puedes devolver un loading spinner mientras rediriges
};

export default Login;
