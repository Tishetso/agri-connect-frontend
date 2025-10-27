import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

function WelcomePage() {
    const navigate = useNavigate();

    return (
        <div className="welcome-wrapper">
            {/* Navbar */}
            <nav className="navbar">
                <h1 className="logo">AgriLink</h1>
                <ul className="nav-links">
                    <li><a href="#about">About</a></li>
                    <li><a href="#contact">Contact</a></li>
                    <li><button onClick={() => navigate('/login')} className="nav-btn">Login</button></li>
                </ul>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <h2>🌾 Empowering Local Food Systems</h2>
                <p>Connect farmers and consumers through smart, inclusive technology.</p>
                <button onClick={() => navigate('/register')} className="cta-btn">Get Started</button>
            </section>

            {/* About Us */}
            <section id="about" className="about">
                <h3>About Us</h3>
                <p>
                    AgriConnect is a community-driven platform designed to strengthen food security and climate resilience.
                    We help farmers share produce, consumers access fresh goods, and communities thrive through transparent, location-aware trading.
                </p>
            </section>

            {/* Contact */}
            <section id="contact" className="contact">
                <h3>Contact</h3>
                <p>Email: support@agriconnect.org</p>
                <p>Phone: +27 12 345 6789</p>
            </section>

            {/* Footer */}
            <footer className="footer">
                <p>© 2025 AgriConnect. Built for community impact.</p>
            </footer>
        </div>
    );
}

export default WelcomePage;
