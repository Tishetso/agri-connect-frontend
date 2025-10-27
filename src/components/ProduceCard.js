import React from 'react';

function ProduceCard({ crop, quantity, price, seller }) {
    return (
        <div style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <h4>{crop}</h4>
            <p><strong>Quantity:</strong> {quantity}</p>
            <p><strong>Price:</strong> {price}</p>
            <p><strong>Seller:</strong> {seller}</p>
            <button style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '8px 12px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
            }}>
                Order Now
            </button>
        </div>
    );
}

export default ProduceCard;
