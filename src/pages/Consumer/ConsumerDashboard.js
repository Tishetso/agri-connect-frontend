import React from 'react';
import ProduceCard from '../../components/ProduceCard';
import OrderStatusCard from '../../components/OrderStatusCard';
import GardenPlannerWidget from '../../components/GardenPlannerWidget';
import CommunityPost from '../../components/CommunityPost';
import './ConsumerDashboard.css';

function ConsumerDashboard() {
    return (
        <>
            {/* TopBar */}
            <header style={{ marginBottom: '20px' }}>
                <h2>Welcome, Consumer 🛒</h2>
                <p>🌦️ Weather: Mild conditions | 🌱 Tip: Great week to plant spinach</p>
            </header>

            {/* Marketplace */}
            <section>
                <h3>Browse Produce</h3>
                <ProduceCard crop="Tomatoes" quantity="50kg" price="R300" seller="Farmer Thabo" />
                <ProduceCard crop="Pumpkin" quantity="10 units" price="R150" seller="Farmer Naledi" />
            </section>

            {/* Order Tracker */}
            <section>
                <h3>My Orders</h3>
                <OrderStatusCard item="Tomatoes" seller="Farmer Thabo" status="Confirmed" />
                <OrderStatusCard item="Pumpkin" seller="Farmer Naledi" status="Delivered" />
            </section>

            {/* Garden Planner */}
            <section>
                <h3>Garden Planner</h3>
                <GardenPlannerWidget />
            </section>

            {/* Community Feed */}
            <section>
                <h3>Community Feed</h3>
                <CommunityPost author="Gardener Zanele" content="Tips for container gardening?" />
                <CommunityPost author="NGO Ubuntu" content="Looking for surplus produce donations." />
                <button>Join Discussion</button>
            </section>
        </>
    );
}

export default ConsumerDashboard;