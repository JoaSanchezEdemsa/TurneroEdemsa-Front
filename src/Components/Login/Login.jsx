import { useEffect } from 'react';

const Login = () => {
    useEffect(() => {
        if (!(localStorage.getItem("me") > 0)) {
            window.location.href = 'https://accounts.edemsa.local?from=http://turnero:3000';
        } else {
            window.location.href = '/dashboard'; 
        }
    }, []);
    
    return null; 
};

export default Login;
