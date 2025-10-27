import React from 'react';

function OrderStatusCard({ buyer, item, status }) {
    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <strong>Order:</strong> {item} for {buyer} - <em>{status}</em>
        </div>
    );
}

export default OrderStatusCard;
