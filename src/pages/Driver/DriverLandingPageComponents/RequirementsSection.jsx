import React from 'react';
import './RequirementsSection.css';

function RequirementsSection() {
    const requirements = [
        'Valid ID Number',
        'Vehicle (bike, car, van, or truck)',
        'Valid vehicle registration',
        'Smartphone with internet',
        'Proof of ID certified copy',
        'Clean driving record',
        'Selfie'
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