import React from 'react';
import './BenefitsSection.css';

function BenefitsSection() {
    const benefits = [
        {
            icon: '💰',
            title: 'Great Earnings',
            description: 'Earn R10-R50 per delivery with guaranteed weekly payouts directly to your bank account.'
        },
        {
            icon: '⏰',
            title: 'Flexible Schedule',
            description: 'Work when you want. Morning, afternoon, or evening - you\'re in control of your time.'
        },
        {
            icon: '📱',
            title: 'Easy to Use App',
            description: 'Simple interface, instant notifications, and GPS navigation built right in.'
        },
        {
            icon: '🌱',
            title: 'Make an Impact',
            description: 'Support local farmers and bring fresh, healthy produce to your community.'
        },
        {
            icon: '🛡️',
            title: 'Insurance Covered',
            description: 'Delivery insurance provided by AgriConnect for all your trips.'
        },
        {
            icon: '📞',
            title: '24/7 Support',
            description: 'Our driver support team is always available to help you succeed.'
        }
    ];

    return (
        <section className="benefits-section">
            <div className="container">
                <h2 className="section-title">Why Drive with AgriConnect?</h2>
                <p className="section-subtitle">
                    Join hundreds of drivers earning money on their own schedule
                </p>

                <div className="benefits-grid">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="benefit-card">
                            <div className="benefit-icon">{benefit.icon}</div>
                            <h3>{benefit.title}</h3>
                            <p>{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default BenefitsSection;