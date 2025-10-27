import React from 'react';

function AlertCard({ type, message, action }) {
    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <strong>{type} Alert:</strong> {message}
            <p><em>Action:</em> {action}</p>
        </div>
    );
}

export default AlertCard;
