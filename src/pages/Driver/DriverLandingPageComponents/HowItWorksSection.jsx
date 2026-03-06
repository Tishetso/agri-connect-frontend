import React from 'react';
import './HowItWorksSection.css';

function HowItWorksSection() {
    const steps = [
        {
            number: 1,
            title: 'Apply Online',
            description: 'Fill out our quick 5-minute application form with your details and vehicle information.',
            icon: '📝'
        },
        {
            number: 2,
            title: 'Get Verified',
            description: 'We\'ll review your documents and verify your information within 2-3 business days.',
            icon: '✅'
        },
        {
            number: 3,
            title: 'Start Earning',
            description: 'Download the app, go online, and start accepting delivery requests immediately!',
            icon: '💸'
        }
    ];

    return (
        <section className="how-it-works-section">
            <div className="container">
                <h2 className="section-title">How It Works</h2>
                <p className="section-subtitle">Start earning in 3 simple steps</p>

                <div className="steps-container">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.number}>
                            <div className="step-card">
                                <div className="step-number">{step.number}</div>
                                <div className="step-content">
                                    <h3>{step.title}</h3>
                                    <p>{step.description}</p>
                                </div>
                                <div className="step-icon">{step.icon}</div>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="step-arrow">→</div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HowItWorksSection;