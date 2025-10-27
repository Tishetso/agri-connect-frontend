import React from 'react';
import { NavLink } from 'react-router-dom';
import AlertCard from '../../components/AlertCard';
import ListingCard from '../../components/ListingCard';
import ChatbotWidget from '../../components/ChatbotWidget';
import OrderStatusCard from '../../components/OrderStatusCard';
import CommunityPost from '../../components/CommunityPost';
import './FarmerDashboard.css';
import { MdDashboard, MdList, MdNotifications, MdChat, MdSettings, MdLogout } from 'react-icons/md';

function FarmerDashboard() {

    const user = JSON.parse(localStorage.getItem('user'));
    return (
        <div className="dashboard-container" style={{ display: 'flex' }}>
            {/* Sidebar Navigation */}
            <aside className="sidebar">
                <nav>
                    <ul className="nav-list">
                        <li>
                            <NavLink to="/farmer" className={({ isActive }) => isActive ? 'active-link' : ''}>
                                <MdDashboard className="nav-icon" /> Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/farmer/listings">
                                <MdList className="nav-icon" /> My Listings
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/farmer/alerts">
                                <MdNotifications className="nav-icon" /> Alerts
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/farmer/chatroom">
                                <MdChat className="nav-icon" /> Chatroom
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/settings">
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
                    <h2>Welcome back,  {user.name} 👋</h2>
                    <p>You’re logged in from <strong>{user.region}</strong>. Here’s what’s happening in your area today.</p>
                    <p>🌧️ Rain expected in 2 days | 🐛 Armyworm risk nearby</p>
                </header>

                {/* AlertsSection */}
                <section>
                    <h3>AgriAlerts</h3>
                    <AlertCard
                        type="Pest"
                        severity="High"
                        message="Armyworm risk in your area"
                        action="Apply organic pesticide within 48 hours"
                    />
                    <AlertCard
                        type="Weather"
                        severity="Medium"
                        message="Rain expected in 2 days"
                        action="Delay irrigation"
                    />
                </section>

                {/* ProduceSummary */}
                <section>
                    <h3>My Produce</h3>
                    <button style={{ marginBottom: '10px' }}>+ New Listing</button>
                    <ListingCard crop="Tomatoes" quantity="50kg" price="R300" status="Available" />
                    <ListingCard crop="Spinach" quantity="20 bunches" price="R100" status="Sold" />
                </section>

                {/* OrderTracker */}
                <section>
                    <h3>Order Tracker</h3>
                    <OrderStatusCard buyer="GreenGrocer SA" item="Tomatoes" status="In Transit" />
                    <OrderStatusCard buyer="Local Market" item="Spinach" status="Delivered" />
                </section>

                {/* ChatbotWidget */}
                <section>
                    <h3>Ask AgriBot</h3>
                    <ChatbotWidget />
                </section>

                {/* CommunityFeed */}
                <section>
                    <h3>Community Feed</h3>
                    <CommunityPost author="Farmer Lerato" content="Best time to plant maize this season?" />
                    <CommunityPost author="Farmer Sipho" content="Looking to swap pumpkin seeds!" />
                    <button>Join Discussion</button>
                </section>
            </main>
        </div>
    );
}

export default FarmerDashboard;
