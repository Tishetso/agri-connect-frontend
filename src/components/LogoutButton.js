import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear auth tokens or session data here
        localStorage.clear(); // or sessionStorage.clear()
        navigate('/'); // Redirect to login or landing page
    };

    return (
        <button
            onClick={handleLogout}
            style={{
                backgroundColor: '#e53935',
                color: 'white',
                padding: '8px 12px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '20px'
            }}
        >
            Logout
        </button>
    );
}

export default LogoutButton;
