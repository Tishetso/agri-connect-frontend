import {useEffect, useState} from "react";
import './Cart.css';
import {confirmAction} from '../../utils/confirm';
import {confirmActionDelete} from "../../utils/confirmActionDelete";
import toast from 'react-hot-toast';

function CartPage(){
    const[carts, setCarts] = useState([]);
    const [Loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => { //on mount
        fetchCarts()
    }, []);

    const fetchCarts = async () => {
        try{
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user'));

            const response = await fetch('http://localhost:8080/api/cart', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!response.ok){
                throw new Error('Failed to fetch carts');
            }

            const data = await response.json(); //conversion to json
            setCarts(data);
            setError(null);
        }catch (err){
            console.error('Error fetching carts:', err);
            setError('Failed to load your carts. Please try again.');
        }finally{
            setLoading(false);
        }
    };

    const updateQuantity = async (cartItemId, newQuantity) => {
        try{
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await fetch(`http://localhost:8080/api/cart/item/${cartItemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({quantity: newQuantity})
            });

            if (!response.ok){
                throw new Error ('Failed to update quantity')
            }

            //Refresh carts
            fetchCarts();
        }catch(err){
            console.error('Error updating quantity', err);
            alert('Failed to update quantity')
        }
    };

    const removeItem = async (cartItemId) => {

        const confirmed = await confirmActionDelete({
                title:'Remove this item',
            text:'This item will be permanently removed from your cart.',
            confirmButtonText: 'Yes, remove it',
            cancelButtonText: 'Keep it',
            icon: 'warning',

        });

        if(!confirmed) return;

        try{
            const user = JSON.parse(localStorage.getItem('user'));

            const response = await fetch(`http://localhost:8080/api/cart/item/${cartItemId}`, {
                method: 'DELETE',
                headers:{
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!response.ok){
                throw new Error('Failed to remove item');
            }

            //success delete
            toast.success('Item removed from cart');

            //Refresh carts

            fetchCarts();
        }catch(err){
            console.error('Error removing item', err);
           toast.error(err.message || 'Failed to remove item. Please try again.');
        }
    };


    const clearCart = async (cartId) => {

    const confirmed = await confirmAction({
        title:'Clear entire cart?',
        text:'This cannot be undone. ALL items will be removed.',
        confirmButtonText: 'Yes, clear it',
        icon: 'warning',
    });

    if (!confirmed) return;

        try{
            const user = JSON.parse(localStorage.getItem('user'));

            const response = await fetch(`http://localhost:8080/api/cart/${cartId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!response.ok){
                throw new Error('Failed to clear cart');
            }

            //success- show toast
            toast.success('Cart cleared successfully');

            //refresh carts
            fetchCarts();
        }catch(err){
            console.error('Error clearing cart', err);
            toast.error('Failed to clear cart. Please try again.');
        }
    };

    //To be implemented

   /* const handleCheckout = (cart) => {
        // Navigate to checkout page (to be implemented)
        alert(`Checkout for ${cart.farmerName}'s cart - Total: R${cart.totalPrice.toFixed(2)}`);
    }*/

    if (Loading){
        return(
            <div className="cart-page">
                <header className="page-header">
                    <h2>🛒 My Shopping Carts</h2>
                </header>
                <div className="loading-state"> Loading your carts...</div>
            </div>
        );
    }

    if (error){
        return(
            <div className="cart-page">
                <header className="page-header">
                    <h2>🛒 My Shopping Carts</h2>
                </header>
                <div className="erro-state">{error}</div>
            </div>
        );
    }

    if (carts.length === 0) {
        return(
            <div className="cart-page">
                <header className = "page-header">
                    <h2>🛒 My Shopping Carts</h2>
                </header>
                <div className = "empty-cart">
                    <p>Your cart is empty</p>
                    <a href = "/consumer/marketplace" className = "btn-browse">Browse Marketplace</a>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <header className="page-header">
                <h2>🛒 My Shopping Carts</h2>

            </header>
            <div className = "cart-msg">
            <p>{carts.length === 1 ? "You have 1 cart from:" : `You have ${carts.length} carts from different farmers`}</p>
            </div>

            <div className="carts-container">
                {carts.map(cart => (
                    <div key={cart.id} className="cart-card">
                        <div className="cart-header">
                            <div className="farmer-info">
                                <h3>Farmer name: <br/>{cart.farmerName}</h3>
                                <p className="farmer-location">Region 📍 {cart.farmerRegion}</p>
                            </div>
                            <button
                                className="btn-clear-cart"
                                onClick={() => clearCart(cart.id)}
                            >
                                Clear Cart
                            </button>
                        </div>

                        <div className="cart-items">
                            {cart.items.map(item => (
                                <div key={item.id} className="cart-item">
                                    <div className="item-image">
                                        <img
                                            src={item.imageUrls && item.imageUrls.length > 0
                                                ? `http://localhost:8080/uploads/${item.imageUrls[0]}`
                                                : '/placeholder-produce.png'
                                            }
                                            alt={item.productName}
                                            onError={(e) => e.target.src = '/placeholder-produce.png'}
                                        />
                                    </div>

                                    <div className="item-details">
                                        <h4>{item.productName}</h4>
                                        <p className="item-price">R{item.pricePerUnit.toFixed(2)} per unit</p>
                                    </div>

                                    <div className="item-quantity">
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="qty-value">{item.quantity}</span>
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="item-subtotal">
                                        <p>R{item.subtotal.toFixed(2)}</p>
                                    </div>

                                    <button
                                        className="btn-remove"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-footer">
                            <div className="cart-summary">
                                <p className="total-items">{cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'}</p>
                                <p className="total-price">Total: <strong>R{cart.totalPrice.toFixed(2)}</strong></p>
                            </div>
                            <button
                                className="btn-checkout"
                                /*onClick={() => handleCheckout(cart)}*/
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CartPage;