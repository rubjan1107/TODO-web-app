import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css'; 
import Navbar from './Navbar';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setSuccess('');
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register/', {
                username,
                password,
            });
            setSuccess(response.data.message || 'Registration successful! Redirecting to the main page...');
            setError('');
            navigate('/Login');
        } catch (err) {
            setError('Registration failed. Try again.');
            setSuccess('');
        }
    };

    return (
        <div className="register-container">
            <Navbar />
            <form className="register-form" onSubmit={handleRegister}>
                <h1>Register</h1>
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
                <div>
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
                {success && <p className="success-message">{success}</p>}
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default Register;
