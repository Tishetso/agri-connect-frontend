import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

function WelcomePage() {
    const navigate = useNavigate();

    return (
        <div className="welcome-wrapper">
            {/* Navbar */}
            <nav className="navbar">
                <h1 className="logo">🌾 AgriConnect</h1>
                <ul className="nav-links">
                    <li><a href="#how-it-works">How It Works</a></li>
                    <li><a href="#for-who">Who We Serve</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#contact">Contact</a></li>
                    <li>
                        <button
                            onClick={() => navigate('/driver/landing')}
                            className="driver-cta-btn"
                        >
                            🚚 Drive & Earn
                        </button>
                    </li>
                    <li>
                        <button onClick={() => navigate('/login')} className="nav-btn">
                            Login
                        </button>
                    </li>
                </ul>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>🌾 Fresh Local Produce, Delivered to Your Door</h1>
                    <p className="hero-subtitle">
                        AgriConnect is the marketplace connecting local farmers with consumers,
                        powered by our reliable delivery network bringing fresh produce straight to you.
                    </p>
                    <div className="hero-buttons">
                        <button onClick={() => navigate('/register')} className="cta-btn primary">
                            Get Started
                        </button>
                        <button onClick={() => navigate('/marketplace')} className="cta-btn secondary">
                            Browse Marketplace
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="hero-stats">
                        <div className="stat">
                            <div className="stat-number">500+</div>
                            <div className="stat-label">Local Farmers</div>
                        </div>
                        <div className="stat">
                            <div className="stat-number">2000+</div>
                            <div className="stat-label">Happy Consumers</div>
                        </div>
                        <div className="stat">
                            <div className="stat-number">100+</div>
                            <div className="stat-label">Active Drivers</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What We Do Section */}
            <section className="what-we-do">
                <div className="container">
                    <h2 className="section-title">What is AgriConnect?</h2>
                    <p className="section-intro">
                        AgriConnect is a marketplace and delivery platform that brings together
                        farmers, consumers, and delivery drivers to create a seamless local food system.
                    </p>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🛒</div>
                            <h3>Online Marketplace</h3>
                            <p>
                                Browse fresh produce from local farmers in one convenient place.
                                Compare prices, see what's in season, and shop with confidence.
                            </p>
                        </div>

                        <div className="feature-card highlight">
                            <div className="feature-icon">🚚</div>
                            <h3>Reliable Delivery Network</h3>
                            <p>
                                Our network of verified drivers ensures your produce gets from
                                farm to table quickly and safely. Track your delivery in real-time.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">📱</div>
                            <h3>Easy Platform</h3>
                            <p>
                                Simple to use for everyone - whether you're selling, buying,
                                or delivering. No complicated processes, just great service.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">💚</div>
                            <h3>Support Local Economy</h3>
                            <p>
                                Keep money in your community. Farmers get fair prices,
                                consumers get fresh food, and drivers earn good income.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Delivery Advantage Section - NEW! */}
            <section className="delivery-advantage">
                <div className="container">
                    <h2 className="section-title">Why Delivery Makes All the Difference</h2>
                    <p className="section-intro">
                        Without delivery, farmers can only sell to people who can travel to them.
                        With AgriConnect's delivery network, farmers reach everyone in their region.
                    </p>

                    <div className="advantage-grid">
                        <div className="advantage-card">
                            <div className="advantage-number">1</div>
                            <h3>For Farmers: Reach More Customers</h3>
                            <p>
                                Sell to customers across your entire region, not just those
                                who can drive to your farm. Our drivers handle all the logistics.
                            </p>
                        </div>

                        <div className="advantage-card">
                            <div className="advantage-number">2</div>
                            <h3>For Consumers: Convenience</h3>
                            <p>
                                Get farm-fresh produce without leaving home. No more driving
                                to multiple farms - everything comes to you.
                            </p>
                        </div>

                        <div className="advantage-card">
                            <div className="advantage-number">3</div>
                            <h3>For Drivers: Earn Income</h3>
                            <p>
                                Flexible work helping your community. Earn money delivering
                                fresh food to your neighbors on your own schedule.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="how-it-works">
                <div className="container">
                    <h2 className="section-title">How AgriConnect Works</h2>

                    <div className="how-it-works-grid">
                        {/* For Consumers */}
                        <div className="how-card">
                            <div className="how-icon consumer">🛒</div>
                            <h3>For Consumers</h3>
                            <ol className="how-steps">
                                <li>Browse fresh produce from local farmers</li>
                                <li>Add items to your cart and checkout</li>
                                <li>Choose delivery time and location</li>
                                <li>Our driver delivers fresh produce to your door</li>
                                <li>Enjoy farm-fresh food at home</li>
                            </ol>
                            <button onClick={() => navigate('/marketplace')} className="how-btn">
                                Start Shopping
                            </button>
                        </div>

                        {/* For Farmers */}
                        <div className="how-card">
                            <div className="how-icon farmer">🌾</div>
                            <h3>For Farmers</h3>
                            <ol className="how-steps">
                                <li>List your produce with photos and prices</li>
                                <li>Receive orders through the platform</li>
                                <li>Prepare orders for pickup</li>
                                <li>Our drivers pick up and deliver to customers</li>
                            </ol>
                            <button onClick={() => navigate('/register')} className="how-btn">
                                Sell Your Produce
                            </button>
                        </div>

                        {/* For Drivers */}
                        <div className="how-card">
                            <div className="how-icon driver">🚗</div>
                            <h3>For Drivers</h3>
                            <ol className="how-steps">
                                <li>Sign up and get verified as a driver</li>
                                <li>Accept delivery requests in your area</li>
                                <li>Pick up produce from local farmers</li>
                                <li>Deliver to consumers using the app</li>
                                <li>Earn per delivery, paid weekly</li>
                            </ol>
                            <button onClick={() => navigate('/driver/landing')} className="how-btn">
                                Start Driving
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Who We Serve */}
            <section id="for-who" className="for-who">
                <div className="container">
                    <h2 className="section-title">Who We Serve</h2>

                    <div className="serve-grid">
                        <div className="serve-card">
                            <h3>🛒 Consumers</h3>
                            <p>
                                Shop fresh produce from local farmers without leaving home.
                                We handle the marketplace and delivery so you can enjoy farm-fresh food.
                            </p>
                            <ul className="serve-benefits">
                                <li>✅ Fresh produce delivered to your door</li>
                                <li>✅ Browse multiple farmers in one place</li>
                                <li>✅ Convenient online ordering</li>
                                <li>✅ Support your local farmers</li>
                            </ul>
                        </div>

                        <div className="serve-card">
                            <h3>🌾 Farmers</h3>
                            <p>
                                Focus on farming - we handle the marketplace and delivery logistics.
                                Reach more customers without worrying about transportation.
                            </p>
                            <ul className="serve-benefits">
                                <li>✅ Sell to customers across your region</li>
                                <li>✅ No need for your own delivery vehicles</li>
                                <li>✅ Simple online platform</li>
                            </ul>
                        </div>

                        <div className="serve-card">
                            <h3>🚚 Drivers</h3>
                            <p>
                                You're the backbone of our platform! Earn money connecting
                                farmers with consumers on your own flexible schedule.
                            </p>
                            <ul className="serve-benefits">
                                <li>✅ Flexible working hours</li>
                                <li>✅ Earn per delivery</li>
                                <li>✅ Weekly payouts</li>
                                <li>✅ Essential service for your community</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>



            {/* Why Choose Us */}
            <section className="why-us">
                <div className="container">
                    <h2 className="section-title">Why Choose AgriConnect?</h2>

                    <div className="why-grid">
                        <div className="why-item">
                            <div className="why-icon">🚚</div>
                            <h4>Reliable Delivery</h4>
                            <p>Our verified driver network ensures your produce arrives fresh and on time</p>
                        </div>

                        <div className="why-item">
                            <div className="why-icon">🌱</div>
                            <h4>100% Local</h4>
                            <p>All produce comes from verified local farmers in your region</p>
                        </div>

                        <div className="why-item">
                            <div className="why-icon">💰</div>
                            <h4>Fair Pricing</h4>
                            <p>Transparent pricing with a small platform fee to keep things running</p>
                        </div>

                        <div className="why-item">
                            <div className="why-icon">🔒</div>
                            <h4>Secure Payments</h4>
                            <p>Safe and secure payment processing for all transactions</p>
                        </div>

                        <div className="why-item">
                            <div className="why-icon">📱</div>
                            <h4>Easy Platform</h4>
                            <p>Simple to use for farmers, consumers, and drivers alike</p>
                        </div>

                        <div className="why-item">
                            <div className="why-icon">🤝</div>
                            <h4>Community Driven</h4>
                            <p>Building stronger local food economies one delivery at a time</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Us */}
            <section id="about" className="about">
                <div className="container">
                    <h3>About AgriConnect</h3>
                    <p>
                        AgriConnect was built to solve a critical problem: farmers have great
                        produce but struggle to reach customers, and consumers want fresh local
                        food but can't easily access it.
                    </p>
                    <p>
                        We created a platform that brings them together with a reliable delivery
                        network. Farmers can focus on farming, consumers get convenient access
                        to fresh food, and drivers earn income connecting the two.
                    </p>
                    <p>
                        <strong>Our delivery network is the backbone of everything we do.</strong> Without
                        reliable drivers, none of this works. That's why we prioritize fair pay,
                        flexible schedules, and support for our driver community.
                    </p>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="cta-banner">
                <div className="container">
                    <h2>Ready to Get Started?</h2>
                    <p>Join our marketplace as a farmer, consumer, or driver</p>
                    <div className="cta-buttons">
                        <button onClick={() => navigate('/register')} className="cta-btn-large primary">
                            Sign Up Now
                        </button>
                        <button onClick={() => navigate('/marketplace')} className="cta-btn-large secondary">
                            Browse Marketplace
                        </button>
                        <button onClick={() => navigate('/driver/landing')} className="cta-btn-large driver">
                            Become a Driver
                        </button>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section id="contact" className="contact">
                <div className="container">
                    <h3>Contact Us</h3>
                    <p>Have questions? We're here to help!</p>
                    <div className="contact-info">
                        <div className="contact-item">
                            <span className="contact-icon">📧</span>
                            <div>
                                <strong>Email</strong>
                                <p>support@agriconnect.org</p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <span className="contact-icon">📞</span>
                            <div>
                                <strong>Phone</strong>
                                <p>+27 12 345 6789</p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <span className="contact-icon">⏰</span>
                            <div>
                                <strong>Hours</strong>
                                <p>Mon-Sat: 8am - 6pm</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h4>🌾 AgriConnect</h4>
                        <p>A marketplace and delivery platform connecting local farmers with consumers.</p>
                    </div>

                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <a href="#how-it-works">How It Works</a>
                        <a href="#for-who">Who We Serve</a>
                        <a href="#about">About Us</a>
                        <a href="/marketplace">Marketplace</a>
                    </div>

                    <div className="footer-section">
                        <h4>Get Started</h4>
                        <a href="/register">Sign Up</a>
                        <a href="/login">Login</a>
                        <a href="/driver/landing">Become a Driver</a>
                    </div>

                    <div className="footer-section">
                        <h4>Contact</h4>
                        <p>support@agriconnect.org</p>
                        <p>+27 12 345 6789</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2025 AgriConnect. Powered by community, delivered with care.</p>
                </div>
            </footer>
        </div>
    );
}

export default WelcomePage;