import React, {useEffect, useState} from "react";
import toast from 'react-hot-toast';
import {confirmAction} from '../../utils/confirm';
import './FarmerOrdersPage.css';

function FarmerOrdersPage(){
    //hooks
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('pending'); //pending, active, completed

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try{
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user'));

            const response = await fetch('http://localhost:8080/api/orders/farmer', {
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if(!response.ok){
                throw new Error("Failed to fetch orders");
            }

            const data = await response.json();
            setOrders(data);
            setError(null);
        }catch(err){
            console.error('Error fetching orders:', err);
            setError('Failed to load orders. Please try again.');
        }finally{
            setLoading(false);
        }
    };

    const confirmOrder = async (orderId) => {
        const confirmed = await confirmAction({
            title: 'Confirm this order?',
            text:'The customer will be notified that you accepted their order.',
            confirmButtonText: 'Yes, confirm',
            icon: 'question',
        });

        if(!confirmed) return;

        try{
            const user = JSON.parse(localStorage.getItem('user'));

            const response = await fetch (`http://localhost:8080/api/orders/${orderId}/confirm`, {
                method: 'PUT',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${user.token}`
                }
            });

            if (!response.ok){
                throw new Error('Failed to confirm order');
            }
            toast.success('Order confirmed! Customer notified.');
            fetchOrders();
        }catch(err){
            console.error('Error confirming order:', err);
            toast.error('Failed to confirm order. Please try again.');
        }
    };

    const updateOrderStatus = async(orderId, newStatus) => {
        try{
            const user = JSON.parse(localStorage.getItem('user'));

            const response = await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${user.token}`
                },
                body: JSON.stringify({status: newStatus})
            });

            if (!response.ok){
                throw new Error("Failed to update order status");
            }

            toast.success(`Order marked as ${newStatus}`);
            fetchOrders();
        }catch(err){
            console.error('Error updating order:', err);
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

        try{
            const user = JSON.parse(localStorage.getItem('user'));

            const response = await fetch (`http://localhost:8080/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({status: 'cancelled'})
            });

            if (!response.ok){
                throw new Error('Failed to reject order');
            }

            toast.success('Order rejected. Customer notified.');
            fetchOrders();
        }catch(err){
            console.error('Error rejecting order:', err);
            toast.error('Failed to reject order.');
        }
    };

    //Filter order by status
    const pendingOrders = orders.filter(order => order.status === 'Pending');
    const activeOrders = orders.filter(order => ['Confirmed', 'In Transit'].includes(order.status));
    const completedOrders = orders.filter(order => ['Delivered','Cancelled'].includes(order.status));

    const getOrdersToDisplay = () => {
        switch (activeTab) {
            case 'pending':
                return pendingOrders;
            case 'active':
                return activeOrders;
            case 'completed':
                return completedOrders;
            default:
                return [];
        }
    };

    if (loading){
        return (
            <div className = "farmer-orders-page">
                <header className = "page-header">
                    <h2>📦 Manage Orders</h2>
                </header>
                <div className = "loading-state">Loading orders...</div>
            </div>
        );
    }

    if(error){
        return(
            <div className = "farmer-orders-page">
                <header className = "page-header">
                    <h2>📦 Manage Orders</h2>
                </header>
                <div className = "error-state">{error}</div>
            </div>
        );
    }

    return(
        <div className = "farmer-orders-page">
            <header className = "page-header">
                <h2>📦 Manage Orders</h2>
                <p>Review and process customer orders</p>
            </header>

            {/*Tabs*/}
            <div className = "tab-container">
                <button
                    className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                    >
                    Pending ({pendingOrders.length})
                </button>
                <button
                    className={`tab ${activeTab === 'active' ? 'active' : ''}`}
                    onClick={() => setActiveTab('active')}
                >
                    Active ({activeOrders.length}
                </button>
                <button
                    className={`tab ${activeTab === 'completed' ? 'active': ''}`}
                    onClick={() => setActiveTab('completed')}
                >
                    Completed ({completedOrders.length})
                </button>
            </div>

            {/*Order List*/}
            <div className = "orders-container">
                {getOrdersToDisplay().length === 0 ? (
                    <div className="empty-state">
                        <p>No {activeTab} orders</p>
                    </div>
                ) : (
                    getOrdersToDisplay().map(order => (
                        <div key={order.id} className="order-card">
                            <div className = "order-header">
                                <div className = "order-info">
                                    <h3>Order #{order.id}</h3>
                                    <p className = "order-date">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <span className={`status-badge ${order.status.toLowerCase().replace(' ','-')}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className = "customer-info">
                                <h4>Customer: {order.consumerName}</h4>
                                <p>📍 {order.deliveryAddress}</p>
                                <p>📞 {order.contactNumber}</p>
                                {order.deliveryNotes && (
                                    <p className = "delivery-notes">📝 Note: {order.deliveryNotes}</p>
                                    )}
                            </div>

                            <div className = "order-items">
                                <h4>Items:</h4>
                                <ul>
                                    {order.items.map(item => (
                                        <li key={item.id}>
                                            {item.productName} x {item.quantity} - R{item.subtotal.toFixed(2)}
                                        </li>
                                        ))}
                                </ul>
                            </div>

                            <div className = "order-summary">
                                <div className = "summary-row">
                                    <span>Subtotal:</span>
                                    <span>R{order.totalPrice.toFixed(2)}</span>
                                </div>
                                <div className = "summary-row">
                                    <span>DeliveryFee:</span>
                                    <span>R{order.deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className = "summary-row total">
                                    <strong>Total:</strong>
                                    <strong>R{order.grandTotal.toFixed(2)}</strong>
                                </div>
                                <p className = "payment-info">Payment: {order.paymentMethod} ({order.paymentStatus})</p>
                            </div>

                            {/*Action buttons*/}
                            <div className = "order-actions">
                                {order.status === 'Pending' && (
                                    <>
                                        <button
                                            className = "btn-confirm"
                                            onClick={() => confirmOrder (order.id)}
                                            >
                                            ✓ Confirm Order
                                        </button>
                                        <button
                                            className = "btn-reject"
                                            onClick={() => rejectOrder(order.id)}
                                            >
                                            ✗ Reject
                                        </button>
                                    </>
                                    )}

                                {order.status === 'Confirmed' && (
                                    <button
                                        className = "btn-transit"
                                        onClick={() => updateOrderStatus(order.id, 'In Transit')}
                                        >
                                        🚚 Mark as In Transit
                                    </button>
                                )}

                                {order.status === 'In Transit' && (
                                    <button
                                        className = "btn-deliver"
                                        onClick={() => updateOrderStatus(order.id, 'Delivered')}
                                        >
                                        ✓ Mark as Delivered
                                    </button>
                                    )}
                            </div>


                            </div>
                    ))
                )}
            </div>

        </div>
    );



}

export default FarmerOrdersPage;













