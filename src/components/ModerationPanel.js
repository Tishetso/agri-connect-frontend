import React from 'react';

function ModerationPanel() {
    return (
        <div style={{ border: '1px solid #ccc', padding: '12px', borderRadius: '8px' }}>
            <p>Listing flagged: "Pumpkin - 10 units"</p>
            <button style={{ marginRight: '10px' }}>Approve</button>
            <button style={{ backgroundColor: '#e53935', color: 'white' }}>Flag</button>
        </div>
    );
}

export default ModerationPanel;
