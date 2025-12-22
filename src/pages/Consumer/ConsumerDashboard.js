import React from 'react';
import { NavLink } from 'react-router-dom';
import ProduceCard from '../../components/ProduceCard';
import OrderStatusCard from '../../components/OrderStatusCard';
import GardenPlannerWidget from '../../components/GardenPlannerWidget';
import CommunityPost from '../../components/CommunityPost';
import { MdStore, MdLocalFlorist, MdShoppingCart, MdChat, MdSettings, MdLogout } from 'react-icons/md';
import './ConsumerDashboard.css';

function ConsumerDashboard() {
    return (
        <div className="dashboard-container" style={{ display: 'flex' }}>
            {/* Sidebar Navigation */}
            <aside className="sidebar">
                <nav>
                    <ul className="nav-list">
                        <li>
                            <NavLink to="/consumer" className={({ isActive }) => isActive ? 'active-link' : ''}>
                                <MdStore className="nav-icon" /> Marketplace
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/consumer/garden">
                                <MdLocalFlorist className="nav-icon" /> Garden Planner
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/consumer/orders">
                                <MdShoppingCart className="nav-icon" /> My Orders
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/consumer/chatroom">
                                <MdChat className="nav-icon" /> Chatroom
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/consumer/settings">
                                <MdSettings className="nav-icon" /> Settings
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/logout">
                                <MdLogout className="nav-icon" /> Logout
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Panel */}
            <main style={{ flex: 1, padding: '20px' }}>
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
            </main>
        </div>
    );
}

export default ConsumerDashboard;
