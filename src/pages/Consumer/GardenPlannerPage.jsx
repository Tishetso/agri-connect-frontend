import React from 'react';
import GardenPlannerWidget from '../../components/GardenPlannerWidget';
import './GardenPlannerPage.css';

function GardenPlannerPage() {
    return (
        <div className="garden-planner-page">
            <header className="page-header">
                <h2>🌱 Garden Planner</h2>
                <p>Plan and track your home garden with personalized recommendations</p>
            </header>

            <section className="planner-section">
                <h3>My Garden</h3>
                <GardenPlannerWidget />
            </section>

            <section className="tips-section">
                <h3>Seasonal Tips</h3>
                <div className="tips-grid">
                    <div className="tip-card">
                        <h4>🌦️ Current Season</h4>
                        <p>Great time to plant spinach, lettuce, and other leafy greens</p>
                    </div>
                    <div className="tip-card">
                        <h4>💧 Watering Schedule</h4>
                        <p>Water early morning or late evening to minimize evaporation</p>
                    </div>
                    <div className="tip-card">
                        <h4>🐛 Pest Control</h4>
                        <p>Use companion planting to naturally deter pests</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default GardenPlannerPage;