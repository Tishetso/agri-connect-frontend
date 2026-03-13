import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DriverRegistration.css';
import toast from 'react-hot-toast';
//import {isValidSouthAfricanID} from "../../utils/Validation";

function DriverRegistration() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        idNumber: '',
        email: '',
        phoneNumber: '',     // ← only one phone field
        address: '',
        vehicleType: 'bicycle',
        licenseNumber: '',
        vehicleRegistration: '',
        coordinates: { lat: '', lng: ''}, //added coordinates
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            // Clear license & reg when switching to bicycle
            if (name === 'vehicleType' && value === 'bicycle') {
                newData.licenseNumber = '';
                newData.vehicleRegistration = '';
            }

            return newData;
        });
    };



    // ✅ Get current location
    const getLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setFormData(prev => ({
                    ...prev,
                    coordinates: { lat: pos.coords.latitude, lng: pos.coords.longitude }
                }));
                toast.success('Location captured! ✅');
            },
            (error) => toast.error('Location access denied or unavailable.'),
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleSubmit = async (e) => {
        setErrors(prev => ({}));
        e.preventDefault();
        setLoading(true);

        /*if (!isValidSouthAfricanID(formData.idNumber)){
            toast.error('Please enter a valid South African ID Number');
            return;
        }*/

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            setLoading(false);
            return;
        }
        if (formData.password.length < 8) {
            toast.error('Password must be at least 8 characters');
            setLoading(false);
            return;
        }

        // ✅ Validate coordinates
        if (!formData.coordinates.lat || !formData.coordinates.lng) {
            setErrors(prev => ({ ...prev, general: 'Please use the "Use My Location" button to confirm your location' }));
            toast.error('Please capture your location first');
            setLoading(false);
            return;
        }

        try {


            const payload = {
                name: formData.name,
                surname: formData.surname,
                idNumber: formData.idNumber,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                vehicleType: formData.vehicleType,
                licenseNumber: formData.vehicleType === 'bicycle' ? 'N/A' : formData.licenseNumber,
                vehicleRegistration: formData.vehicleType === 'bicycle' ? 'BICYCLE' : formData.vehicleRegistration,
                latitude: formData.coordinates.lat, //send flat
                longitude: formData.coordinates.lng, //send flat
                password: formData.password
            };

            console.log('Full payload:', payload);

            const response = await fetch('http://localhost:8080/api/driver/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            const responseText = await response.text();
            console.log('Response:', response.status, responseText);

            if (response.ok) {
                toast.success('Registration submitted! Awaiting admin verification.');
                setTimeout(() => navigate('/driver/login'), 2000);
            } else {
                let errorMsg = 'Registration failed';
                try {
                    const err = JSON.parse(responseText);
                    errorMsg = err.error || err.message || errorMsg;
                } catch {
                    errorMsg = responseText || response.statusText || errorMsg;
                }
                toast.error(errorMsg);
            }
        } catch (err) {
            console.error('Registration error:', err);
            toast.error('Failed to submit. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const isMotorized = ['motorcycle', 'car', 'van', 'truck'].includes(formData.vehicleType);

    return (
        <div className="driver-registration">
            <div className="registration-container">
                <header className="registration-header">
                    <h1>🚚 Become a Delivery Driver</h1>
                    <p>Join AgriConnect and start earning by delivering fresh produce</p>
                </header>

                <div className="application-form">
                    <form onSubmit={handleSubmit}>
                        <h2>Driver Application</h2>

                        {/* Personal Details */}
                        <div className="form-group">
                            <label>First Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Surname *</label>
                            <input
                                type="text"
                                name="surname"
                                value={formData.surname}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>ID Number *</label>
                            <input
                                type="text"
                                name="idNumber"
                                value={formData.idNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password *</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Minimum 8 characters"
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm Password *</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number (for contact & deliveries) *</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                placeholder="+27 123 456 789"
                            />
                            <small>We'll use this number for delivery coordination and updates</small>
                        </div>

                        <div className="form-group">
                            <label>Physical Address *</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Soshanguve West LK Ext 11 Dumileko 2025"
                            />
                        </div>

                        <div className="form-group">
                            <label>Location Coordinates *</label>
                            <button
                                type="button"
                                onClick={getLocation}
                                className="location-btn"
                                disabled={loading || formData.coordinates.lat}
                            >
                                📍 Use My Location
                            </button>
                            {formData.coordinates.lat ? (
                                <p className="success">Location captured ✅<br/>
                                   {/* Lat: {formData.coordinates.lat}, Lng: {formData.coordinates.lng}*/}
                                </p>
                            ) : (
                                errors.general && <span className="error general">{errors.general}</span>
                            )}
                            <small>Your delivery area will be based on this location</small>
                        </div>



                        {/* Vehicle Section */}
                        <div className="form-group">
                            <label>Vehicle Type *</label>
                            <select
                                name="vehicleType"
                                value={formData.vehicleType}
                                onChange={handleChange}
                                required
                            >
                                <option value="bicycle">Bicycle</option>
                                <option value="motorcycle">Motorcycle</option>
                                <option value="car">Car</option>
                                <option value="van">Van</option>
                                <option value="truck">Truck</option>
                            </select>
                            <small>Select the vehicle you'll use for deliveries</small>
                        </div>

                        {isMotorized && (
                            <>
                                <div className="form-group">
                                    <label>Driver's License Number *</label>
                                    <input
                                        type="text"
                                        name="licenseNumber"
                                        value={formData.licenseNumber}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. 12345678"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Vehicle Registration Number *</label>
                                    <input
                                        type="text"
                                        name="vehicleRegistration"
                                        value={formData.vehicleRegistration}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. ABC 123 GP"
                                    />
                                </div>
                            </>
                        )}

                        {/* Requirements */}
                        <div className="terms-section">
                            <h3>Requirements for {formData.vehicleType === 'bicycle' ? 'Bicycle' : 'Motorized'} Drivers</h3>
                            <ul>
                                {formData.vehicleType === 'bicycle' ? (
                                    <>
                                        <li>✅ Valid ID Number</li>
                                        <li>✅ Reliable bicycle in good condition</li>
                                        <li>✅ Smartphone with internet access</li>
                                        <li>✅ Ability to carry up to 15kg</li>
                                        <li>✅ Helmet (for safety)</li>
                                        <li>✅ Selfie</li>
                                    </>
                                ) : (
                                    <>
                                        <li>✅ Valid driver's license</li>
                                        <li>✅ Registered vehicle with valid insurance</li>
                                        <li>✅ Smartphone with internet access</li>
                                        <li>✅ Clean driving record</li>
                                        <li>✅ Age 18 or older</li>
                                        <li>✅ Selfie</li>
                                    </>
                                )}
                            </ul>
                        </div>

                        <div className="info-box">
                            <p>ℹ️ Your application will be reviewed by our team. We'll verify your documents and notify you within 2-3 business days.</p>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={() => navigate(-1)}
                                disabled={loading}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn-submit"

                            >
                                {'Submit Application'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DriverRegistration;