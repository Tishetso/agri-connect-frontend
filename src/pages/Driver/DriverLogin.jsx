import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DriverLogin.css';
import toast from 'react-hot-toast';

function DriverLogin() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/driver/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const responseText = await response.text();
            console.log('Login response:', response.status, responseText);

            if (response.ok) {
                let data;
                try {
                    data = JSON.parse(responseText);
                } catch {
                    data = {};
                }

                // Store driver session
                localStorage.setItem('user', JSON.stringify({
                    token: data.token,
                    email: formData.email,
                    name: data.name || '',
                    id: data.id || '',
                    role: 'driver',
                    isAvailable: data.isAvailable ?? false,
                }));

                toast.success(`Welcome back${data.name ? ', ' + data.name : ''}! 🚚`);
                setTimeout(() => navigate('/driver/dashboard'), 1500);
            } else {
                let errorMsg = 'Login failed';
                try {
                    const err = JSON.parse(responseText);
                    errorMsg = err.error || err.message || errorMsg;
                } catch {
                    errorMsg = responseText || response.statusText || errorMsg;
                }
                toast.error(errorMsg);
            }
        } catch (err) {
            console.error('Login error:', err);
            toast.error('Unable to connect. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="driver-login">
            <div className="login-card">
                <div className="login-brand">
                    <span className="brand-icon">🚚</span>
                    <h1>AgriConnect</h1>
                    <p>Driver Portal</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <h2>Sign In</h2>
                    <p className="login-subtitle">Access your delivery dashboard</p>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-login"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="spinner-text">
                                <span className="spinner" /> Signing in...
                            </span>
                        ) : 'Sign In'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Not registered yet?{' '}
                        <button
                            className="link-btn"
                            onClick={() => navigate('/driver/register')}
                        >
                            Apply to become a driver
                        </button>
                    </p>
                    <p>
                        <button
                            className="link-btn secondary"
                            onClick={() => navigate('/driver/landing')}
                        >
                            ← Back to main site
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default DriverLogin;