import React, { useState, useEffect } from 'react';
import './DriverDashboard.css';
import toast from 'react-hot-toast';

function DriverDashboard() {
    const [driver, setDriver] = useState(null);
    const [availableOrders, setAvailableOrders] = useState([]);
    const [myDeliveries, setMyDeliveries] = useState([]);
    const [earnings, setEarnings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('available'); // available, active, completed

    useEffect(() => {
        fetchDriverData();
    }, []);

    const fetchDriverData = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user'));

            // Fetch driver profile
            const profileRes = await fetch('http://localhost:8080/api/driver/profile', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            if (profileRes.ok) {
                const driverData = await profileRes.json();
                setDriver(driverData);
            }

            // Fetch available orders
            const ordersRes = await fetch('http://localhost:8080/api/driver/available-orders', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            if (ordersRes.ok) {
                const ordersData = await ordersRes.json();
                setAvailableOrders(ordersData);
            }

            // Fetch my deliveries
            const myDeliveriesRes = await fetch('http://localhost:8080/api/driver/my-deliveries', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            if (myDeliveriesRes.ok) {
                const deliveriesData = await myDeliveriesRes.json();
                setMyDeliveries(deliveriesData);
            }

            // Fetch earnings
            const earningsRes = await fetch('http://localhost:8080/api/driver/earnings', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            if (earningsRes.ok) {
                const earningsData = await earningsRes.json();
                setEarnings(earningsData);
            }

        } catch (error) {
            console.error('Error fetching driver data:', error);
            toast.error('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const toggleAvailability = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const newStatus = !driver.isAvailable;

            const response = await fetch('http://localhost:8080/api/driver/availability', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ available: newStatus })
            });

            if (response.ok) {
                const updatedDriver = await response.json();
                setDriver(updatedDriver);
                toast.success(newStatus ? 'You are now available for deliveries' : 'You are now offline');
            }
        } catch (error) {
            console.error('Error toggling availability:', error);
            toast.error('Failed to update availability');
        }
    };

    const acceptOrder = async (orderId) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));

            const response = await fetch(`http://localhost:8080/api/driver/accept/${orderId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.ok) {
                toast.success('Order accepted!');
                fetchDriverData(); // Refresh data
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to accept order');
            }
        } catch (error) {
            console.error('Error accepting order:', error);
            toast.error('Failed to accept order');
        }
    };

    const updateStatus = async (orderId, status) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));

            const response = await fetch(`http://localhost:8080/api/driver/update-status/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                toast.success('Status updated!');
                fetchDriverData();
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    if (loading) {
        return (
            <div className="driver-dashboard">
                <div className="loading-state">Loading dashboard...</div>
            </div>
        );
    }

    if (!driver) {
        return (
            <div className="driver-dashboard">
                <div className="not-registered">
                    <h2>🚚 Become a Delivery Driver</h2>
                    <p>Register to start earning by delivering fresh produce</p>
                    <button onClick={() => window.location.href = '/driver/register'}>
                        Register Now
                    </button>
                </div>
            </div>
        );
    }

    const activeDeliveries = myDeliveries.filter(d =>
        d.deliveryStatus === 'ASSIGNED' || d.deliveryStatus === 'PICKED_UP' || d.deliveryStatus === 'IN_TRANSIT'
    );

    const completedDeliveries = myDeliveries.filter(d => d.deliveryStatus === 'DELIVERED');

    return (
        <div className="driver-dashboard">
            {/* Header */}
            <header className="driver-header">
                <div className="driver-info">
                    <h1>🚚 Driver Dashboard</h1>
                    <p>Welcome back, {driver.user.name}!</p>
                </div>

                <div className="availability-toggle">
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={driver.isAvailable}
                            onChange={toggleAvailability}
                        />
                        <span className="slider"></span>
                    </label>
                    <span className={`status-text ${driver.isAvailable ? 'online' : 'offline'}`}>
                        {driver.isAvailable ? '🟢 Online' : '🔴 Offline'}
                    </span>
                </div>
            </header>

            {/* Stats Cards */}
            <section className="stats-section">
                <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-details">
                        <h3>R{earnings?.totalEarnings?.toFixed(2) || '0.00'}</h3>
                        <p>Total Earnings</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-details">
                        <h3>{earnings?.totalDeliveries || 0}</h3>
                        <p>Completed Deliveries</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-details">
                        <h3>{driver.rating?.toFixed(1) || '0.0'}</h3>
                        <p>Rating</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🚗</div>
                    <div className="stat-details">
                        <h3>{activeDeliveries.length}</h3>
                        <p>Active Deliveries</p>
                    </div>
                </div>
            </section>

            {/* Tabs */}
            <section className="tabs-section">
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'available' ? 'active' : ''}`}
                        onClick={() => setActiveTab('available')}
                    >
                        Available Orders ({availableOrders.length})
                    </button>
                    <button
                        className={`tab ${activeTab === 'active' ? 'active' : ''}`}
                        onClick={() => setActiveTab('active')}
                    >
                        Active Deliveries ({activeDeliveries.length})
                    </button>
                    <button
                        className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        Completed ({completedDeliveries.length})
                    </button>
                </div>

                {/* Available Orders Tab */}
                {activeTab === 'available' && (
                    <div className="orders-list">
                        {availableOrders.length > 0 ? (
                            availableOrders.map(order => (
                                <div key={order.id} className="order-card">
                                    <div className="order-header">
                                        <h3>Order #{order.id}</h3>
                                        <span className="delivery-fee">R{order.deliveryFee?.toFixed(2)}</span>
                                    </div>

                                    <div className="order-details">
                                        <div className="detail-row">
                                            <span className="label">📍 Pickup:</span>
                                            <span>{order.pickupAddress || 'Farmer location'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">🏠 Delivery:</span>
                                            <span>{order.deliveryAddress}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">📦 Items:</span>
                                            <span>{order.itemCount || order.items?.length} items</span>
                                        </div>
                                    </div>

                                    <button
                                        className="btn-accept"
                                        onClick={() => acceptOrder(order.id)}
                                        disabled={!driver.isAvailable}
                                    >
                                        {driver.isAvailable ? 'Accept Order' : 'Go online to accept'}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <p>No available orders at the moment</p>
                                <p>Check back soon or enable notifications</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Active Deliveries Tab */}
                {activeTab === 'active' && (
                    <div className="orders-list">
                        {activeDeliveries.length > 0 ? (
                            activeDeliveries.map(order => (
                                <div key={order.id} className="order-card active">
                                    <div className="order-header">
                                        <h3>Order #{order.id}</h3>
                                        <span className={`status-badge ${order.deliveryStatus.toLowerCase()}`}>
                                            {order.deliveryStatus}
                                        </span>
                                    </div>

                                    <div className="order-details">
                                        <div className="detail-row">
                                            <span className="label">📍 Pickup:</span>
                                            <span>{order.pickupAddress || 'Farmer location'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">🏠 Delivery:</span>
                                            <span>{order.deliveryAddress}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">📞 Contact:</span>
                                            <span>{order.contactNumber}</span>
                                        </div>
                                    </div>

                                    <div className="status-actions">
                                        {order.deliveryStatus === 'ASSIGNED' && (
                                            <button
                                                className="btn-status"
                                                onClick={() => updateStatus(order.id, 'PICKED_UP')}
                                            >
                                                Mark as Picked Up
                                            </button>
                                        )}
                                        {order.deliveryStatus === 'PICKED_UP' && (
                                            <button
                                                className="btn-status"
                                                onClick={() => updateStatus(order.id, 'IN_TRANSIT')}
                                            >
                                                Start Delivery
                                            </button>
                                        )}
                                        {order.deliveryStatus === 'IN_TRANSIT' && (
                                            <button
                                                className="btn-status success"
                                                onClick={() => updateStatus(order.id, 'DELIVERED')}
                                            >
                                                Mark as Delivered
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <p>No active deliveries</p>
                                <p>Accept an order to get started</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Completed Tab */}
                {activeTab === 'completed' && (
                    <div className="orders-list">
                        {completedDeliveries.length > 0 ? (
                            completedDeliveries.map(order => (
                                <div key={order.id} className="order-card completed">
                                    <div className="order-header">
                                        <h3>Order #{order.id}</h3>
                                        <span className="earning">+R{order.deliveryFee?.toFixed(2)}</span>
                                    </div>

                                    <div className="order-details">
                                        <div className="detail-row">
                                            <span className="label">📅 Delivered:</span>
                                            <span>{new Date(order.deliveryTime).toLocaleString()}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">📍 Location:</span>
                                            <span>{order.deliveryAddress}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <p>No completed deliveries yet</p>
                                <p>Start delivering to build your history</p>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}

export default DriverDashboard;