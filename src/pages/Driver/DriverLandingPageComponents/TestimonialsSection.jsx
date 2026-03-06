import React from 'react';
import './TestimonialsSection.css';

function TestimonialsSection() {
    const testimonials = [
        {
            rating: 5,
            text: 'I make R600 a day working just 6 hours. The app is super easy to use and the support team is always helpful. Best side hustle ever!',
            author: {
                name: 'Thabo Maputle',
                meta: 'Driver since Jan 2024 · Johannesburg',
                avatar: '👤'
            }
        },
        {
            rating: 5,
            text: 'Perfect for students like me. I drive between classes and on weekends. The flexibility is unmatched and I\'m helping local farmers too!',
            author: {
                name: 'Lerato Khumalo',
                meta: 'Driver since Mar 2024 · Pretoria',
                avatar: '👤'
            }
        },
        {
            rating: 5,
            text: 'After losing my job, AgriConnect gave me a way to provide for my family. Now I earn more than my old salary with better work-life balance.',
            author: {
                name: 'Sipho Ndlovu',
                meta: 'Driver since Nov 2023 · Durban',
                avatar: '👤'
            }
        }
    ];

    return (
        <section className="testimonials-section">
            <div className="container">
                <h2 className="section-title">What Our Drivers Say</h2>

                <div className="testimonials-grid">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="testimonial-card">
                            <div className="testimonial-rating">
                                {'⭐'.repeat(testimonial.rating)}
                            </div>
                            <p className="testimonial-text">{testimonial.text}</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">{testimonial.author.avatar}</div>
                                <div className="author-info">
                                    <div className="author-name">{testimonial.author.name}</div>
                                    <div className="author-meta">{testimonial.author.meta}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TestimonialsSection;