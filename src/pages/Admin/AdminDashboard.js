import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import toast from 'react-hot-toast';

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalFarmers: 0,
        totalConsumers: 0,
        totalDrivers: 0,
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
            const token = localStorage.getItem('token');

            // Fetch analytics/stats
           /* const statsResponse = await fetch('http://localhost:8080/api/admin/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });*/
            // Fetch user stats from the same endpoint as AdminUsers
            const usersRes = await fetch('http://localhost:8080/api/admin/users?size=1&page=0', {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Fetch recent listings
            const listingsResponse = await fetch('http://localhost:8080/api/admin/listings/recent', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Fetch recent orders
            const ordersResponse = await fetch('http://localhost:8080/api/admin/orders/recent', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (usersRes.ok) {
                const usersData = await usersRes.json();
                setStats(prev => ({
                    ...prev,
                    totalUsers: usersData.totalUsers ?? usersData.total ?? 0,
                    totalFarmers: usersData.totalFarmers ?? 0,
                    totalConsumers: usersData.totalConsumers ?? 0,
                    totalDrivers: usersData.totalDrivers ?? 0,
                    totalAdmins: usersData.totalAdmins ?? 0,
                }));
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
                        <div className="stat-icon">🚚</div>
                        <div className="stat-details">
                            <h3>{stats.totalDrivers}</h3>
                            <p>Drivers</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🛡️</div>
                        <div className="stat-details">
                            <h3>{stats.totalAdmins}</h3>
                            <p>Admin</p>
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
                            <h3>R{(stats.totalRevenue ?? 0).toFixed(2)}</h3>
                            <p>Total Revenue</p>
                        </div>
                    </div>
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
                        onClick={() => window.location.href = '/admin/drivers'}
                    >
                        <span className="action-icon">🚚</span>
                        <span>Verify Drivers</span>
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