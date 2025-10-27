import React from 'react';

function GardenPlannerWidget() {
    const tasks = [
        { id: 1, task: 'Water spinach bed', done: false },
        { id: 2, task: 'Add compost to tomatoes', done: true },
        { id: 3, task: 'Harvest lettuce', done: false },
    ];

    return (
        <div style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '12px',
            backgroundColor: '#f9f9f9'
        }}>
            <h4>🌱 Garden Planner</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {tasks.map((item) => (
                    <li key={item.id} style={{ marginBottom: '8px' }}>
                        <input type="checkbox" checked={item.done} readOnly />
                        <span style={{ marginLeft: '8px', textDecoration: item.done ? 'line-through' : 'none' }}>
              {item.task}
            </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GardenPlannerWidget;
