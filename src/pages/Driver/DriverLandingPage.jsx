import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DriverLandingPage.css';
import toast from 'react-hot-toast';

// Import components
import BenefitsSection from './DriverLandingPageComponents/BenefitsSection';
import HowItWorksSection from './DriverLandingPageComponents/HowItWorksSection';
import TestimonialsSection from './DriverLandingPageComponents/TestimonialsSection';
import RequirementsSection from './DriverLandingPageComponents/RequirementsSection';
import FAQSection from './DriverLandingPageComponents/FAQSection';

function DriverLandingPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        vehicleType: 'bike',
        city: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleQuickApply = async (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            localStorage.setItem('driverApplication', JSON.stringify(formData));
            toast.success('Please create an account first!');
            navigate('/register');
            return;
        }

        navigate('/driver/register');
    };

    return (
        <div className="driver-landing">
            {/* Header */}
            <header className="landing-header">
                <div className="header-container">
                    <div className="logo">
                        <h2>🌾 AgriConnect</h2>
                    </div>
                    <div className="header-actions">
                        <a href="/login" className="link-login">Already a driver? Sign in</a>
                        <a href="/" className="link-home">← Back to Home</a>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <span>🎉 Now Hiring Drivers in Your Area</span>
                        </div>
                        <h1 className="hero-title">
                            Earn <span className="highlight">R500+</span> Per Day
                            <br />Delivering Fresh Produce
                        </h1>
                        <p className="hero-subtitle">
                            Join AgriConnect and be your own boss. Flexible hours, weekly payouts,
                            and make a real impact supporting local farmers.
                        </p>

                        <div className="hero-stats">
                            <div className="stat-item">
                                <div className="stat-number">R10-R50</div>
                                <div className="stat-label">Per Delivery</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">5-15</div>
                                <div className="stat-label">Deliveries/Day</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">Weekly</div>
                                <div className="stat-label">Payouts</div>
                            </div>
                        </div>

                        <a href="#apply" className="btn-hero-cta">
                            Apply Now - It's Free! →
                        </a>

                        <p className="hero-note">
                            ✓ No signup fees  ✓ 2-day verification  ✓ Start earning immediately
                        </p>
                    </div>

                    <div className="hero-image">
                        <div className="image-placeholder">
                            <div className="placeholder-content">
                                <div className="driver-illustration">🚗💨</div>
                                <div className="floating-card card-1">
                                    <div className="card-icon">✅</div>
                                    <div className="card-text">Order Accepted</div>
                                </div>
                                <div className="floating-card card-2">
                                    <div className="card-icon">💰</div>
                                    <div className="card-text">+R45 Earned</div>
                                </div>
                                <div className="floating-card card-3">
                                    <div className="card-icon">⭐</div>
                                    <div className="card-text">5.0 Rating</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Component Sections */}
            <BenefitsSection />
            <HowItWorksSection />
            <TestimonialsSection />
            <RequirementsSection />

            {/* Application Form Section */}
            <section id="apply" className="application-section">
                <div className="container">
                    <div className="application-container">
                        <div className="application-info">
                            <h2>Ready to Start Earning?</h2>
                            <p>Join AgriConnect today and start delivering tomorrow!</p>

                            <div className="info-points">
                                <div className="info-point">
                                    <span className="point-icon">🚀</span>
                                    <span>Quick 5-minute application</span>
                                </div>
                                <div className="info-point">
                                    <span className="point-icon">⚡</span>
                                    <span>Approval in 2-3 days</span>
                                </div>
                                <div className="info-point">
                                    <span className="point-icon">💳</span>
                                    <span>No signup or monthly fees</span>
                                </div>
                                <div className="info-point">
                                    <span className="point-icon">🎁</span>
                                    <span>R100 bonus after first 5 deliveries</span>
                                </div>
                            </div>
                        </div>

                        <div className="application-form">
                            <form onSubmit={handleQuickApply}>
                                <h3>Apply Now</h3>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name *"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address *"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number *"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <select
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
                                </div>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City *"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn-submit" disabled={loading}>
                                    {loading ? 'Processing...' : 'Get Started →'}
                                </button>

                                <p className="form-note">
                                    By applying, you agree to our Terms of Service and Privacy Policy
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <FAQSection />

            {/* Final CTA Section */}
            <section className="final-cta-section">
                <div className="container">
                    <div className="final-cta-content">
                        <h2>Start Your Journey Today</h2>
                        <p>Join thousands of drivers earning money on their own terms</p>
                        <a href="#apply" className="btn-final-cta">Apply Now - It's Free!</a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-left">
                            <p>© 2026 AgriConnect. All rights reserved.</p>
                        </div>
                        <div className="footer-right">
                            <a href="/terms">Terms of Service</a>
                            <a href="/privacy">Privacy Policy</a>
                            <a href="/contact">Contact Us</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default DriverLandingPage;