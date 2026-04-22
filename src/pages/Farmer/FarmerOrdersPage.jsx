import React, {useEffect, useState} from "react";
import toast from 'react-hot-toast';
import {confirmAction} from '../../utils/confirm';
import './FarmerOrdersPage.css';

function FarmerOrdersPage(){
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('pending');

    // ← new modal state
    const [showDriverModal, setShowDriverModal] = useState(false);
    const [pendingOrderId, setPendingOrderId] = useState(null);
    const [availableDrivers, setAvailableDrivers] = useState([]);
    const [selectedDriverId, setSelectedDriverId] = useState(null);
    const [assigningDriver, setAssigningDriver] = useState(false);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await fetch('http://localhost:8080/api/orders/farmer', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (!response.ok) throw new Error("Failed to fetch orders");
            setOrders(await response.json());
            setError(null);
        } catch(err) {
            setError('Failed to load orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ← opens modal and fetches available drivers
    const openDriverModal = async (orderId) => {
        setPendingOrderId(orderId);
        setSelectedDriverId(null);
        setShowDriverModal(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const res = await fetch('http://localhost:8080/api/driver/available-orders', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            // fetch all drivers who are available
            const driversRes = await fetch('http://localhost:8080/api/driver/available-drivers', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (driversRes.ok) {
                setAvailableDrivers(await driversRes.json());
            }
        } catch(err) {
            toast.error('Failed to load drivers');
        }
    };

    // ← confirm order + assign driver in one step
    const confirmWithDriver = async () => {
        if (!selectedDriverId) {
            toast.error('Please select a driver first');
            return;
        }
        setAssigningDriver(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));

            // 1. Confirm the order
            const confirmRes = await fetch(`http://localhost:8080/api/orders/${pendingOrderId}/confirm`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (!confirmRes.ok) throw new Error('Failed to confirm order');

            // 2. Assign the driver
            const assignRes = await fetch(`http://localhost:8080/api/driver/assign/${pendingOrderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ driverId: selectedDriverId })
            });
            if (!assignRes.ok) throw new Error('Failed to assign driver');

            toast.success('Order confirmed and driver assigned!');
            setShowDriverModal(false);
            fetchOrders();
        } catch(err) {
            toast.error(err.message);
        } finally {
            setAssigningDriver(false);
        }
    };

    const updateOrderStatus = async(orderId, newStatus) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({status: newStatus})
            });
            if (!response.ok) throw new Error("Failed to update order status");
            toast.success(`Order marked as ${newStatus}`);
            fetchOrders();
        } catch(err) {
            toast.error('Failed to update order status.');
        }
    };

    const rejectOrder = async (orderId) => {
        const confirmed = await confirmAction({
            title: 'Reject this order?',
            text: 'The customer will be notified. This action cannot be undone.',
            confirmButtonText: 'Yes, reject',
            icon: 'warning',
        });
        if (!confirmed) return;
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({status: 'cancelled'})
            });
            toast.success('Order rejected.');
            fetchOrders();
        } catch(err) {
            toast.error('Failed to reject order.');
        }
    };

    const pendingOrders = orders.filter(o => o.status === 'Pending');
    const activeOrders = orders.filter(o => ['Confirmed', 'In Transit'].includes(o.status));
    const completedOrders = orders.filter(o => ['Delivered','Cancelled'].includes(o.status));
    const getOrdersToDisplay = () => {
        if (activeTab === 'pending') return pendingOrders;
        if (activeTab === 'active') return activeOrders;
        return completedOrders;
    };

    if (loading) return <div className="farmer-orders-page"><div className="loading-state">Loading orders...</div></div>;
    if (error) return <div className="farmer-orders-page"><div className="error-state">{error}</div></div>;

    return (
        <div className="farmer-orders-page">
            <header className="page-header">
                <h2>📦 Manage Orders</h2>
                <p>Review and process customer orders</p>
            </header>

            <div className="tab-container">
                <button className={`tab ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
                    Pending ({pendingOrders.length})
                </button>
                <button className={`tab ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>
                    Active ({activeOrders.length})
                </button>
                <button className={`tab ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>
                    Completed ({completedOrders.length})
                </button>
            </div>

            <div className="orders-container">
                {getOrdersToDisplay().length === 0 ? (
                    <div className="empty-state"><p>No {activeTab} orders</p></div>
                ) : (
                    getOrdersToDisplay().map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div className="order-info">
                                    <h3>Order #{order.id}</h3>
                                    <p className="order-date">{new Date(order.createdAt).toLocaleString()}</p>
                                </div>
                                <span className={`status-badge ${order.status.toLowerCase().replace(' ','-')}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="customer-info">
                                <h4>Customer: {order.consumerName}</h4>
                                <p>📍 {order.deliveryAddress}</p>
                                <p>📞 {order.contactNumber}</p>
                                {order.deliveryNotes && <p className="delivery-notes">📝 {order.deliveryNotes}</p>}
                            </div>

                            <div className="order-items">
                                <h4>Items:</h4>
                                <ul>
                                    {order.items.map(item => (
                                        <li key={item.id}>{item.productName} x {item.quantity} — R{item.subtotal.toFixed(2)}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="order-summary">
                                <div className="summary-row"><span>Subtotal:</span><span>R{order.totalPrice.toFixed(2)}</span></div>
                                <div className="summary-row"><span>Delivery fee:</span><span>R{order.deliveryFee.toFixed(2)}</span></div>
                                <div className="summary-row total"><strong>Total:</strong><strong>R{order.grandTotal.toFixed(2)}</strong></div>
                                <p className="payment-info">Payment: {order.paymentMethod} ({order.paymentStatus})</p>
                            </div>

                            <div className="order-actions">
                                {order.status === 'Pending' && (
                                    <>
                                        {/* ← changed: opens modal instead of direct confirm */}
                                        <button className="btn-confirm" onClick={() => openDriverModal(order.id)}>
                                            ✓ Confirm Order
                                        </button>
                                        <button className="btn-reject" onClick={() => rejectOrder(order.id)}>
                                            ✗ Reject
                                        </button>
                                    </>
                                )}
                                {order.status === 'Confirmed' && (
                                    <button className="btn-transit" onClick={() => updateOrderStatus(order.id, 'In Transit')}>
                                        🚚 Mark as In Transit
                                    </button>
                                )}
                                {order.status === 'In Transit' && (
                                    <button className="btn-deliver" onClick={() => updateOrderStatus(order.id, 'Delivered')}>
                                        ✓ Mark as Delivered
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ← Driver Assignment Modal */}
            {showDriverModal && (
                <div className="modal-overlay" onClick={() => setShowDriverModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Assign a driver — Order #{pendingOrderId}</h3>
                            <button className="modal-close" onClick={() => setShowDriverModal(false)}>✕</button>
                        </div>
                        <p className="modal-subtitle">Select an available driver to confirm this order.</p>

                        <div className="driver-list">
                            {availableDrivers.length === 0 ? (
                                <p className="no-drivers">No available drivers at the moment.</p>
                            ) : (
                                availableDrivers.map(driver => (
                                    <div
                                        key={driver.id}
                                        className={`driver-card ${selectedDriverId === driver.id ? 'selected' : ''} ${!driver.isAvailable ? 'offline' : ''}`}
                                        onClick={() => driver.isAvailable && setSelectedDriverId(driver.id)}
                                    >
                                        <div className="driver-info">
                                            <p className="driver-name">{driver.name} {driver.surname}</p>
                                            <p className="driver-meta">
                                                {driver.vehicleType} · {driver.rating?.toFixed(1)} stars · {driver.totalDeliveries} deliveries
                                            </p>
                                        </div>
                                        <span className={`availability-badge ${driver.isAvailable ? 'available' : 'offline'}`}>
                                            {driver.isAvailable ? 'Available' : 'Offline'}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowDriverModal(false)}>Cancel</button>
                            <button
                                className="btn-confirm"
                                onClick={confirmWithDriver}
                                disabled={!selectedDriverId || assigningDriver}
                            >
                                {assigningDriver ? 'Assigning...' : 'Confirm & Assign'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FarmerOrdersPage;