import React, { useState } from 'react';
import './ForgotPassword.css'; // ✅ External CSS

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // ✅ Spinner state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start spinner
        try {
            const res = await fetch('http://localhost:8080/api/request-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            let data;
            try {
                data = await res.json();
            } catch {
                data = await res.text();
            }

            if (res.ok) {
                setMessage('Reset link sent! Check your inbox.');
            } else {
                const errorMessage = typeof data === 'string' ? data : data.error || 'Unknown error';
                setMessage(errorMessage);
            }
        } catch (err) {
            console.error(err);
            setMessage('Server error. Try again.');
        } finally {
            setLoading(false); // Stop spinner
        }
    };

    return (
        <div className="forgot-container">
            <h2 className="forgot-title">Forgot Password</h2>
            <form onSubmit={handleSubmit} className="forgot-form">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="forgot-input"
                />
                <button type="submit" className="forgot-button" disabled={loading}>
                    {loading ? <div className="spinner"></div> : 'Send Reset Link'}
                </button>
            </form>
            {message && (
                <p className={`forgot-message ${message.includes('sent') ? 'success' : 'error'}`}>
                    {message}
                </p>
            )}
        </div>
    );
}

export default ForgotPassword;
