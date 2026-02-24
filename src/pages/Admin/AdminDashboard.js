import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import toast from 'react-hot-toast';

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalFarmers: 0,
        totalConsumers: 0,
        totalListings: 0,
        activeListings: 0,
        pendingListings: 0,
        totalOrders: 0,
        totalRevenue: 0
    });
    const [recentListings, setRecentListings] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user'));

            // Fetch analytics/stats
            const statsResponse = await fetch('http://localhost:8080/api/admin/stats', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            // Fetch recent listings
            const listingsResponse = await fetch('http://localhost:8080/api/admin/listings/recent', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            // Fetch recent orders
            const ordersResponse = await fetch('http://localhost:8080/api/admin/orders/recent', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                setStats(statsData);
            }

            if (listingsResponse.ok) {
                const listingsData = await listingsResponse.json();
                setRecentListings(listingsData);
            }

            if (ordersResponse.ok) {
                const ordersData = await ordersResponse.json();
                setRecentOrders(ordersData);
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="loading-state">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <header className="admin-header">
                <div className="header-content">
                    <div>
                        <h1>Admin Dashboard 🧑‍💼</h1>
                        <p>Monitor platform activity, manage users, and oversee operations</p>
                    </div>
                    <button onClick={handleLogout} className="btn-logout">
                        Logout
                    </button>
                </div>
            </header>

            {/* Analytics Stats */}
            <section className="stats-section">
                <h2>📊 Platform Overview</h2>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-details">
                            <h3>{stats.totalUsers}</h3>
                            <p>Total Users</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">🌾</div>
                        <div className="stat-details">
                            <h3>{stats.totalFarmers}</h3>
                            <p>Farmers</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">🛒</div>
                        <div className="stat-details">
                            <h3>{stats.totalConsumers}</h3>
                            <p>Consumers</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">📦</div>
                        <div className="stat-details">
                            <h3>{stats.totalListings}</h3>
                            <p>Total Listings</p>
                        </div>
                    </div>

                    <div className="stat-card highlight">
                        <div className="stat-icon">✅</div>
                        <div className="stat-details">
                            <h3>{stats.activeListings}</h3>
                            <p>Active Listings</p>
                        </div>
                    </div>

                    <div className="stat-card warning">
                        <div className="stat-icon">⏳</div>
                        <div className="stat-details">
                            <h3>{stats.pendingListings}</h3>
                            <p>Pending Review</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">📋</div>
                        <div className="stat-details">
                            <h3>{stats.totalOrders}</h3>
                            <p>Total Orders</p>
                        </div>
                    </div>

                    <div className="stat-card success">
                        <div className="stat-icon">💰</div>
                        <div className="stat-details">
                            <h3>R{stats.totalRevenue.toFixed(2)}</h3>
                            <p>Total Revenue</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent Listings */}
            <section className="listings-section">
                <div className="section-header">
                    <h2>📦 Recent Listings</h2>
                    <button
                        className="btn-view-all"
                        onClick={() => window.location.href = '/admin/listings'}
                    >
                        View All
                    </button>
                </div>

                <div className="listings-table">
                    <table>
                        <thead>
                        <tr>
                            <th>Product</th>
                            <th>Farmer</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recentListings.length > 0 ? (
                            recentListings.map(listing => (
                                <tr key={listing.id}>
                                    <td>
                                        <div className="product-cell">
                                            <img
                                                src={listing.imageUrls?.[0]
                                                    ? `http://localhost:8080/uploads/${listing.imageUrls[0]}`
                                                    : '/placeholder-produce.png'
                                                }
                                                alt={listing.product}
                                                onError={(e) => e.target.src = '/placeholder-produce.png'}
                                            />
                                            <span>{listing.product}</span>
                                        </div>
                                    </td>
                                    <td>{listing.farmerName}</td>
                                    <td>{listing.quantity}</td>
                                    <td>R{listing.price}</td>
                                    <td>
                                            <span className={`status-badge ${listing.status.toLowerCase()}`}>
                                                {listing.status}
                                            </span>
                                    </td>
                                    <td>{new Date(listing.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center' }}>
                                    No recent listings
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Recent Orders */}
            <section className="orders-section">
                <div className="section-header">
                    <h2>📋 Recent Orders</h2>
                    <button
                        className="btn-view-all"
                        onClick={() => window.location.href = '/admin/orders'}
                    >
                        View All
                    </button>
                </div>

                <div className="orders-table">
                    <table>
                        <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Consumer</th>
                            <th>Farmer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recentOrders.length > 0 ? (
                            recentOrders.map(order => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{order.consumerName}</td>
                                    <td>{order.farmerName}</td>
                                    <td>{order.itemCount} items</td>
                                    <td>R{order.totalAmount.toFixed(2)}</td>
                                    <td>
                                            <span className={`status-badge ${order.status.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center' }}>
                                    No recent orders
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="quick-actions">
                <h2>⚡ Quick Actions</h2>
                <div className="actions-grid">
                    <button
                        className="action-btn"
                        onClick={() => window.location.href = '/admin/users'}
                    >
                        <span className="action-icon">👥</span>
                        <span>Manage Users</span>
                    </button>

                    <button
                        className="action-btn"
                        onClick={() => window.location.href = '/admin/listings'}
                    >
                        <span className="action-icon">📦</span>
                        <span>Manage Listings</span>
                    </button>

                    <button
                        className="action-btn"
                        onClick={() => window.location.href = '/admin/orders'}
                    >
                        <span className="action-icon">📋</span>
                        <span>Manage Orders</span>
                    </button>

                    <button
                        className="action-btn"
                        onClick={() => window.location.href = '/admin/reports'}
                    >
                        <span className="action-icon">📊</span>
                        <span>View Reports</span>
                    </button>
                </div>
            </section>
        </div>
    );
}

export default AdminDashboard;