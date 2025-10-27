import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutHandler() {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear session or auth tokens
        localStorage.clear(); // or sessionStorage.clear()
        navigate('/'); // Redirect to login or landing page
    }, [navigate]);

    return null;
}

export default LogoutHandler;