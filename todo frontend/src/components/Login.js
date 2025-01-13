import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import Navbar from './Navbar';
import { Fragment } from 'react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', {
                username,
                password,
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userData', JSON.stringify({ username })); // Save username
            navigate('/tasks');
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <Fragment>
            <Navbar/>
            
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h1>Login</h1>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div></Fragment>
    );
};

export default Login;
