import React from 'react';

function ListingCard({ crop, quantity, price, status }) {
    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <strong>{crop}</strong> - {quantity} @ {price} ({status})
        </div>
    );
}

export default ListingCard;
