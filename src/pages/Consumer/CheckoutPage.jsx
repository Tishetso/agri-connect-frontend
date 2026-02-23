import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Checkout.css';
import toast from 'react-hot-toast';

function CheckoutPage() {
    const { cartId } = useParams();
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [saveInfo, setSaveInfo] = useState(true); //toggle to save delivery address
    const [formData, setFormData] = useState({
        deliveryAddress: '',
        contactNumber: '',
        deliveryNotes: '',
        paymentMethod: 'cash'
    });

    //Load saved delivery info on mount
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user){
            setFormData(prev => ({
                ...prev,
                deliveryAddress: user.savedDeliveryAddress || '',
                contactNumber: user.savedContactNumber || '',
                deliveryNotes: user.savedDeliveryNotes || '',
            }));
        }
    }, []);

    useEffect(() => {
        fetchCartDetails();
    }, [cartId]);

    const fetchCartDetails = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user'));

            const response = await fetch('http://localhost:8080/api/cart', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cart');
            }

            const carts = await response.json();
            const selectedCart = carts.find(c => c.id === parseInt(cartId));

            if (!selectedCart) {
                toast.error('Cart not found');
                navigate('/consumer/cart');
                return;
            }

            setCart(selectedCart);
        } catch (err) {
            console.error('Error fetching cart:', err);
            toast.error('Failed to load checkout. Please try again.');
            navigate('/consumer/cart');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const user = JSON.parse(localStorage.getItem('user'));

            const orderData = {
                cartId: cart.id,
                deliveryAddress: formData.deliveryAddress,
                contactNumber: formData.contactNumber,
                deliveryNotes: formData.deliveryNotes,
                paymentMethod: formData.paymentMethod,
                saveDeliveryInfo: saveInfo //send this to backend
            };

            const response = await fetch('http://localhost:8080/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to place order');
            }

            const order = await response.json();

            //update localStorage with saved info (for immediate use)
            if(saveInfo){
                const updatedUser = {
                    ...user,
                    savedDeliveryAddress: formData.deliveryAddress,
                    savedContactNumber: formData.contactNumber,
                    savedDeliveryNotes: formData.deliveryNotes
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            toast.success('Order placed successfully!');
            navigate('/consumer/orders');
        } catch (err) {
            console.error('Error placing order:', err);
            toast.error(err.message || 'Failed to place order. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="checkout-page">
                <div className="loading-state">Loading checkout...</div>
            </div>
        );
    }

    if (!cart) {
        return null;
    }

    return (
        <div className="checkout-page">
            <header className="page-header">
                <h2>🛒 Checkout</h2>
            </header>

            <div className = "from"><p>Complete your order from {cart.farmerName}</p></div>
            <div className="checkout-container">
                {/* Order Summary */}
                <div className="order-summary-section">
                    <h3>Order Summary</h3>
                    <div className="farmer-details">
                        <h4>{cart.farmerName}</h4>
                        <p>📍 {cart.farmerRegion}</p>
                    </div>

                    <div className="items-list">
                        {cart.items.map(item => (
                            <div key={item.id} className="summary-item">
                                <div className="item-info">
                                    <img
                                        src={item.imageUrls && item.imageUrls.length > 0
                                            ? `http://localhost:8080/uploads/${item.imageUrls[0]}`
                                            : '/placeholder-produce.png'
                                        }
                                        alt={item.productName}
                                        onError={(e) => e.target.src = '/placeholder-produce.png'}
                                    />
                                    <div>
                                        <h5>{item.productName}</h5>
                                        <p>R{item.pricePerUnit.toFixed(2)} × {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="item-total">R{item.subtotal.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="summary-totals">
                        <div className="total-row">
                            <span>Subtotal:</span>
                            <span>R{cart.totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="total-row">
                            <span>Delivery Fee:</span>
                            <span>R10.00</span>
                        </div>
                        <div className="total-row grand-total">
                            <strong>Total:</strong>
                            <strong>R{(cart.totalPrice + 10).toFixed(2)}</strong>
                        </div>
                    </div>
                </div>

                {/* Checkout Form */}
                <div className="checkout-form-section">
                    <h3>Delivery Information</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="deliveryAddress">Delivery Address *</label>
                            <textarea
                                id="deliveryAddress"
                                name="deliveryAddress"
                                value={formData.deliveryAddress}
                                onChange={handleChange}
                                required
                                rows="3"
                                placeholder="Enter your full delivery address"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="contactNumber">Contact Number *</label>
                            <input
                                type="tel"
                                id="contactNumber"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                required
                                placeholder="+27 123 456 789"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="deliveryNotes">Delivery Notes (Recommended)</label>
                            <textarea
                                id="deliveryNotes"
                                name="deliveryNotes"
                                value={formData.deliveryNotes}
                                onChange={handleChange}
                                rows="2"
                                placeholder="Any special instructions for delivery"
                                required
                            />
                        </div>

                        <div className = "checkbox-group">
                            <label className = "checkbox-label">
                                <input type = "checkbox" checked={saveInfo} onChange={(e) => setSaveInfo(e.target.checked)}/>
                                <span>💾 Save delivery information for future orders</span>
                            </label>
                            <p className="checkbox-hint">
                                Your delivery address and contact will be pre-filled next time
                            </p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="paymentMethod">Payment Method *</label>
                            <select
                                id="paymentMethod"
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                required
                            >
                                <option value="cash">Cash on Delivery</option>
                                <option value="eft">Bank Transfer (EFT)</option>
                                <option value="card">Credit/Debit Card</option>
                            </select>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={() => navigate('/consumer/cart')}
                            >
                                Back to Cart
                            </button>
                            <button
                                type="submit"
                                className="btn-submit"
                                disabled={submitting}
                            >
                                {submitting ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;