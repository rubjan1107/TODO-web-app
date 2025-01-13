import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';  

const Navbar = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const userData = localStorage.getItem('userData');
            if (userData) {
                const { username } = JSON.parse(userData);
                setUsername(username);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        navigate('/login'); 
    };

    return (
        <div className="navbar">
            <h1 className="navbar-title">To-Do Application</h1>
            
            {/* Display username and logout button if logged in */}
            {username ? (
                <div className="navbar-user-info">
                    <span className="navbar-username">Welcome {username}!</span>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
            ) : null}
        </div>
    );
};

export default Navbar;
