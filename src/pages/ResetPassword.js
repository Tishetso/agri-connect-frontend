import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
/*import './ResetPassword.css'; // optional styling*/

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        newPassword: '',
        confirmPassword: '',
        general: ''
    });

    // ✅ Password strength validator
    const validatePassword = (password) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        let message = '';

        if (name === 'newPassword') {
            if (!validatePassword(value)) {
                message = 'Must be 8+ chars, include uppercase, lowercase, number & symbol';
            }
        }

        if (name === 'confirmPassword') {
            if (value !== formData.newPassword) {
                message = 'Passwords do not match';
            }
        }

        setErrors(prev => ({ ...prev, [name]: message, general: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(prev => ({ ...prev, general: '' }));

        if (
            !validatePassword(formData.newPassword) ||
            formData.newPassword !== formData.confirmPassword
        ) {
            setErrors(prev => ({
                ...prev,
                general: 'Please correct highlighted fields before submitting.'
            }));
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: formData.newPassword })
            });

            const data = await res.text();
            if (res.ok) {
                setErrors({ newPassword: '', confirmPassword: '', general: 'Password reset successful!' });
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setErrors(prev => ({ ...prev, general: data }));
            }
        } catch (err) {
            console.error(err);
            setErrors(prev => ({ ...prev, general: 'Server error. Try again.' }));
        }
    };

    return (
        <div className="reset-container">
            <h2>Reset Your Password</h2>
            <form onSubmit={handleSubmit}>
                <label>New Password</label>
                <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                />
                {errors.newPassword && <span className="error">{errors.newPassword}</span>}

                <label>Confirm Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
                {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}

                {errors.general && <span className="error general">{errors.general}</span>}

                <button type="submit" className="submit-btn">Reset Password</button>
            </form>
        </div>
    );
}

export default ResetPassword;
