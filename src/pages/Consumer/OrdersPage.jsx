import React, { useState, useEffect } from 'react';
import './OrdersPage.css';
import toast from 'react-hot-toast';
import { confirmAction } from '../../utils/confirm';

function OrdersPage() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user'));

            const response = await fetch('http://localhost:8080/api/orders', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            setOrders(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (orderId) => {
        const confirmed = await confirmAction({
            title: 'Cancel this order?',
            text: 'This action cannot be undone. The farmer will be notified.',
            confirmButtonText: 'Yes, cancel it',
            icon: 'warning',
        });

        if (!confirmed) return;

        try {
            const user = JSON.parse(localStorage.getItem('user'));

            const response = await fetch(`http://localhost:8080/api/orders/${orderId}/cancel`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ reason: 'Cancelled by customer' })
            });

            if (!response.ok) {
                throw new Error('Failed to cancel order');
            }

            toast.success('Order cancelled successfully');
            fetchOrders(); // Refresh orders
        } catch (err) {
            console.error('Error cancelling order:', err);
            toast.error('Failed to cancel order. Please try again.');
        }
    };

    // Helper function to get status class name
    const getStatusClassName = (status) => {
        return status.toLowerCase().replace(/\s+/g, '-');
    };

    // Separate active and completed orders
    const activeOrders = orders.filter(order =>
        ['Pending', 'Confirmed', 'In Transit'].includes(order.status)
    );
    const completedOrders = orders.filter(order =>
        ['Delivered', 'Cancelled'].includes(order.status)
    );

    if (loading) {
        return (
            <div className="orders-page">
                <header className="page-header">
                    <h2>🛒 My Orders</h2>
                </header>
                <div className="loading-state">Loading your orders...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="orders-page">
                <header className="page-header">
                    <h2>🛒 My Orders</h2>
                </header>
                <div className="error-state">{error}</div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="orders-page">
                <header className="page-header">
                    <h2>🛒 My Orders</h2>
                    <p>Track your orders and order history</p>
                </header>
                <div className="empty-orders">
                    <p>You haven't placed any orders yet</p>
                    <a href="/consumer" className="btn-browse">Browse Marketplace</a>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <header className="page-header">
                <h2>🛒 My Orders</h2>
                <p>Track your orders and order history</p>
            </header>

            {activeOrders.length > 0 && (
                <section className="active-orders">
                    <h3>Active Orders ({activeOrders.length})</h3>
                    <div className="orders-list">
                        {activeOrders.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div className="order-info">
                                        <h4>Order #{order.id}</h4>
                                        <p className="order-date">
                                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`status-badge ${getStatusClassName(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="order-details">
                                    <div className="farmer-info">
                                        <p><strong>Farmer:</strong> {order.farmerName}</p>
                                        <p><strong>Location:</strong> {order.farmerRegion}</p>
                                    </div>

                                    <div className="items-summary">
                                        <p><strong>Items:</strong></p>
                                        <ul>
                                            {order.items.map(item => (
                                                <li key={item.id}>
                                                    {item.productName} × {item.quantity} - R{item.subtotal.toFixed(2)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="order-total">
                                        <p><strong>Total:</strong> R{order.grandTotal.toFixed(2)}</p>
                                        <p className="payment-method">Payment: {order.paymentMethod}</p>
                                    </div>
                                </div>

                                <div className="order-actions">
                                    {order.status === 'Pending' && (
                                        <button
                                            className="btn-cancel"
                                            onClick={() => cancelOrder(order.id)}
                                        >
                                            Cancel Order
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {completedOrders.length > 0 && (
                <section className="completed-orders">
                    <h3>Order History ({completedOrders.length})</h3>
                    <div className="orders-list">
                        {completedOrders.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div className="order-info">
                                        <h4>Order #{order.id}</h4>
                                        <p className="order-date">
                                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                                        </p>

                                    </div>
                                    <span className={`status-badge ${getStatusClassName(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="order-details">
                                    <div className="farmer-info">
                                        <p><strong>Farmer:</strong> {order.farmerName}</p>
                                    </div>

                                    <div className="items-summary">
                                        <p><strong>Items:</strong></p>
                                        <ul>
                                            {order.items.map(item => (
                                                <li key={item.id}>
                                                    {item.productName} × {item.quantity}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="order-total">
                                        <p><strong>Total:</strong> R{order.grandTotal.toFixed(2)}</p>
                                    </div>

                                    {/* Additional status info */}
                                    {order.status === 'Delivered' && order.deliveredAt && (
                                        <p className="delivered-date">
                                            Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                                        </p>
                                    )}

                                    {order.status === 'Cancelled' && order.cancellationReason && (
                                        <p className="cancellation-reason">
                                            Reason: {order.cancellationReason}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default OrdersPage;