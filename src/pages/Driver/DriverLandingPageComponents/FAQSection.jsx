import React from 'react';
import './FAQSection.css';

function FAQSection() {
    const faqs = [
        {
            icon: '💰',
            question: 'How much can I earn?',
            answer: 'Drivers typically earn R10-R50 per delivery depending on distance. Most active drivers complete 5-15 deliveries per day, earning R300-R750 daily.'
        },
        {
            icon: '📅',
            question: 'When do I get paid?',
            answer: 'Earnings are processed weekly and deposited directly to your bank account every Monday for the previous week\'s deliveries.'
        },
        {
            icon: '⏰',
            question: 'Can I choose my own hours?',
            answer: 'Absolutely! You decide when to work. Log in whenever you want and accept deliveries that fit your schedule. No minimum hours required.'
        },
        {
            icon: '🚗',
            question: 'What vehicles are accepted?',
            answer: 'We accept bikes, motorcycles, cars, vans, and trucks. As long as you have valid registration and insurance, you can deliver!'
        },
        {
            icon: '📍',
            question: 'Where can I deliver?',
            answer: 'You can deliver anywhere within your region. The app shows available orders in your area, and you choose which ones to accept.'
        },
        {
            icon: '🛡️',
            question: 'Do I need insurance?',
            answer: 'Yes, you must have valid vehicle insurance. We also provide additional delivery insurance coverage for all trips at no cost to you.'
        }
    ];

    return (
        <section className="faq-section">
            <div className="container">
                <h2 className="section-title">Frequently Asked Questions</h2>

                <div className="faq-grid">
                    {faqs.map((faq, index) => (
                        <div key={index} className="faq-item">
                            <h3>
                                <span className="faq-icon">{faq.icon}</span>
                                {faq.question}
                            </h3>
                            <p>{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FAQSection;