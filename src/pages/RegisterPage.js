import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './RegisterPage.css';

function RegisterPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const defaultRole = new URLSearchParams(location.search).get('role') || '';
    const emailRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        confirmPassword: '',
        idNumber: '',
        role: defaultRole,
        region: '',
        phone: '',
        coordinates: { lat: '', lng: '' }
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        idNumber: '',
        region: '',
        phone: '',
        general: ''
    });

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
    const validateIdNumber = (id) => /^\d{13}$/.test(id);
    const validatePhone = (phone) => /^(\+27|0)[6-8][0-9]{8}$/.test(phone.replace(/\s/g, ''));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        let message = '';

        if (name === 'email') {
            if (!validateEmail(value)) message = 'Email not valid';
        }
        if (name === 'password') {
            if (!validatePassword(value))
                message = 'Must be 8+ chars, include uppercase, lowercase, number & symbol';
        }
        if (name === 'confirmPassword') {
            if (value !== formData.password) message = 'Passwords do not match';
        }
        if (name === 'idNumber') {
            if (!/^\d*$/.test(value)) {
                message = 'Only numbers allowed';
            } else if (value.length > 0 && value.length < 13) {
                message = 'ID number must be exactly 13 digits';
            } else if (value.length === 13 && !validateIdNumber(value)) {
                message = 'Invalid ID number format';
            }
        }
        if (name === 'phone' && value.length > 0) {
            if (!validatePhone(value)) message = 'Enter a valid SA number e.g. 082 345 6789';
        }

        setErrors(prev => ({ ...prev, [name]: message, general: '' }));
    };

    const getLocation = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            setFormData(prev => ({
                ...prev,
                coordinates: { lat: latitude, lng: longitude }
            }));
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(prev => ({ ...prev, general: '' }));

        if (
            !validateEmail(formData.email) ||
            !validatePassword(formData.password) ||
            formData.password !== formData.confirmPassword ||
            !validateIdNumber(formData.idNumber)
        ) {
            setErrors(prev => ({
                ...prev,
                general: 'Please correct highlighted fields before submitting.'
            }));
            return;
        }

        if (!formData.region || !formData.region.trim()) {
            setErrors(prev => ({ ...prev, region: 'Store address is required' }));
            return;
        }

        if (formData.phone && !validatePhone(formData.phone)) {
            setErrors(prev => ({ ...prev, phone: 'Enter a valid SA number e.g. 082 345 6789' }));
            return;
        }

        if (!formData.coordinates.lat || !formData.coordinates.lng) {
            setErrors(prev => ({
                ...prev,
                general: 'Please use the "Use My Location" button to confirm your location'
            }));
            return;
        }

        try {
            const payload = {
                name:      formData.name,
                surname:   formData.surname,
                email:     formData.email,
                password:  formData.password,
                idNumber:  formData.idNumber,
                role:      formData.role,
                region:    formData.region,
                phone:     formData.phone,
                latitude:  formData.coordinates.lat,
                longitude: formData.coordinates.lng,
            };

            const res = await fetch('http://localhost:8080/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                navigate('/login');
            } else if (res.status === 409) {
                setErrors(prev => ({ ...prev, email: 'Email already exists' }));
                emailRef.current?.focus();
            } else {
                const error = await res.text();
                setErrors(prev => ({ ...prev, general: 'Registration failed: ' + error }));
            }
        } catch (err) {
            console.error(err);
            setErrors(prev => ({ ...prev, general: 'Server error. Please try again.' }));
        }
    };

    return (
        <div className="register-page-wrapper">
            <div className="register-container">
                <h2>Create Your Account</h2>
                <form onSubmit={handleSubmit}>

                    <label>Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                    <label>Surname</label>
                    <input type="text" name="surname" value={formData.surname} onChange={handleChange} required />

                    <label>Email</label>
                    <input
                        type="email" name="email" value={formData.email}
                        onChange={handleChange} ref={emailRef} required
                        className={errors.email ? 'error-input' : ''}
                    />
                    {errors.email && <span className="error">{errors.email}</span>}

                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    {errors.password && <span className="error">{errors.password}</span>}

                    <label>Confirm Password</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                    {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}

                    <label>ID Number</label>
                    <input
                        type="text" name="idNumber" value={formData.idNumber}
                        onChange={handleChange} placeholder="e.g. 8001015009087"
                        maxLength={13} required
                    />
                    {errors.idNumber && <span className="error">{errors.idNumber}</span>}

                    <label>Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} required>
                        <option value="">Select Role</option>
                        <option value="farmer">Farmer</option>
                        <option value="consumer">Consumer</option>
                    </select>

                    <label>Contacts </label>
                    <input
                        type="tel" name="phone" value={formData.phone}
                        onChange={handleChange}
                        placeholder="+27 82 000 0000"
                        className={errors.phone ? 'error-input' : ''}
                    />
                    {errors.phone && <span className="error">{errors.phone}</span>}

                    <label>Address</label>
                    <textarea
                        className="txt-area" name="region" value={formData.region}
                        onChange={handleChange}
                        placeholder="e.g. Soshanguve East XX ext 4 8889"
                        rows={2}
                    />
                    {errors.region && <span className="error">{errors.region}</span>}

                    <button type="button" onClick={getLocation}>📍 Use My Location</button>

                    {formData.coordinates.lat ? (
                        <p>Location captured ✅</p>
                    ) : (
                        errors.general && <span className="error general">{errors.general}</span>
                    )}

                    <button type="submit" className="submit-btn">Register</button>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;