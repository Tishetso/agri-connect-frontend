import React from 'react';
import './RequirementsSection.css';

function RequirementsSection() {
    const requirements = [
        'Valid driver\'s license',
        'Vehicle (bike, car, van, or truck)',
        'Valid vehicle registration & insurance',
        'Smartphone with internet',
        'Must be 18 years or older',
        'Clean driving record'
    ];

    return (
        <section className="requirements-section">
            <div className="container">
                <h2 className="section-title">What You Need</h2>

                <div className="requirements-grid">
                    {requirements.map((requirement, index) => (
                        <div key={index} className="requirement-item">
                            <div className="req-icon">✓</div>
                            <div className="req-text">{requirement}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default RequirementsSection;