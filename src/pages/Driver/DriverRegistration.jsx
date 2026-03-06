import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DriverRegistration.css';
import toast from 'react-hot-toast';

function DriverRegistration() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        vehicleType: 'bike',
        licenseNumber: '',
        vehicleRegistration: '',
        phoneNumber: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const user = JSON.parse(localStorage.getItem('user'));

            const response = await fetch('http://localhost:8080/api/driver/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                toast.success('Registration submitted! Awaiting admin verification.');
                setTimeout(() => {
                    navigate('/driver/dashboard');
                }, 2000);
            } else {
                const error = await response.json();
                toast.error(error.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Error registering driver:', error);
            toast.error('Failed to submit registration. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="driver-registration">
            <div className="registration-container">
                <header className="registration-header">
                    <h1>🚚 Become a Delivery Driver</h1>
                    <p>Join AgriConnect and start earning by delivering fresh produce</p>
                </header>

                {/* Benefits Section */}
                <section className="benefits-section">
                    <h2>Why Drive with AgriConnect?</h2>
                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <span className="benefit-icon">💰</span>
                            <h3>Earn More</h3>
                            <p>Competitive rates with weekly payouts</p>
                        </div>
                        <div className="benefit-card">
                            <span className="benefit-icon">⏰</span>
                            <h3>Flexible Hours</h3>
                            <p>Work when you want, control your schedule</p>
                        </div>
                        <div className="benefit-card">
                            <span className="benefit-icon">📱</span>
                            <h3>Easy to Use</h3>
                            <p>Simple app, instant order notifications</p>
                        </div>
                        <div className="benefit-card">
                            <span className="benefit-icon">🌱</span>
                            <h3>Make Impact</h3>
                            <p>Support local farmers and communities</p>
                        </div>
                    </div>
                </section>

                {/* Registration Form */}
                <section className="form-section">
                    <h2>Driver Information</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="vehicleType">Vehicle Type *</label>
                            <select
                                id="vehicleType"
                                name="vehicleType"
                                value={formData.vehicleType}
                                onChange={handleChange}
                                required
                            >
                                <option value="bike">Bike/Motorcycle</option>
                                <option value="car">Car</option>
                                <option value="van">Van</option>
                                <option value="truck">Truck</option>
                            </select>
                            <small>Select the vehicle you'll use for deliveries</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="licenseNumber">Driver's License Number *</label>
                            <input
                                type="text"
                                id="licenseNumber"
                                name="licenseNumber"
                                value={formData.licenseNumber}
                                onChange={handleChange}
                                required
                                placeholder="e.g., 12345678"
                            />
                            <small>Your valid driver's license number</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="vehicleRegistration">Vehicle Registration Number *</label>
                            <input
                                type="text"
                                id="vehicleRegistration"
                                name="vehicleRegistration"
                                value={formData.vehicleRegistration}
                                onChange={handleChange}
                                required
                                placeholder="e.g., ABC 123 GP"
                            />
                            <small>Your vehicle's registration/license plate number</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="phoneNumber">Contact Phone Number *</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                placeholder="+27 123 456 789"
                            />
                            <small>For delivery coordination and support</small>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="terms-section">
                            <h3>Requirements</h3>
                            <ul>
                                <li>✅ Valid driver's license</li>
                                <li>✅ Registered vehicle with valid insurance</li>
                                <li>✅ Smartphone with internet access</li>
                                <li>✅ Clean driving record</li>
                                <li>✅ Age 18 or older</li>
                            </ul>
                        </div>

                        <div className="info-box">
                            <p>
                                ℹ️ Your application will be reviewed by our team.
                                We'll verify your documents and notify you within 2-3 business days.
                            </p>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-submit"
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                </section>

                {/* FAQ Section */}
                <section className="faq-section">
                    <h2>Frequently Asked Questions</h2>

                    <div className="faq-item">
                        <h3>How much can I earn?</h3>
                        <p>
                            Drivers typically earn R10-R50 per delivery depending on distance.
                            Most drivers complete 5-15 deliveries per day.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3>When do I get paid?</h3>
                        <p>
                            Earnings are processed weekly and deposited directly to your bank account every Monday.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3>What areas can I deliver to?</h3>
                        <p>
                            You can deliver anywhere within your region. The app will show you available orders in your area.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3>Do I need insurance?</h3>
                        <p>
                            Yes, you must have valid vehicle insurance. We also provide additional delivery insurance coverage.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default DriverRegistration;