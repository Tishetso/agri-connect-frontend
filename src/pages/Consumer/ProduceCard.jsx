import React, {useState} from 'react';
import GuestCheckoutModal from './GuestCheckoutModal';
import './ProduceCard.css';
import toast from 'react-hot-toast';
import {useNavigate} from "react-router-dom";

function ProduceCard({ crop, quantity, price, seller, location, status, imageUrls, id, farmerName }) {
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);

    // Get the first image or use a placeholder
    const imageUrl = imageUrls && imageUrls.length > 0
        ? `http://localhost:8080/uploads/${imageUrls[0]}`
        : '/placeholder-produce.png';

    const handleAddToCart = async () => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user || !user.token){
            alert("Please login to add items to cart");
            window.location.href = '/login';
            return;
        }

        setAddingToCart(true);

        try{
            const response = await fetch('http://localhost:8080/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    listingId: id,
                    quantity: 1
                })


            });

            if (!response.ok){
                throw new Error('Failed to add to cart');

            }
            //Success!
            toast.success('Added to cart successfully! 🛒', {
                duration: 4000,
                position: 'top-center', //optional override
            });

        }catch(error){
            console.error('Error adding to cart ', error);
            toast.error('Failed to add to cart. Please try again.',{
                duration:5000,
            });
        }finally{
            setAddingToCart(false);
        }
    };

    /*This ⚠️⚠️⚠️⚠️⚠️⚠️ Be on the look out*/
    const handleOrderClick = () => {
        //Checks if user is logged in
        const user = JSON.parse(localStorage.getItem('user'));

        if (user && user.token){
            //User is logged in - redirect to cart

        }

    };

    const handleCheckoutSuccess = (data) => {
        alert(`Order placed successfully! Order ID: ${data.orderId}`);
    };

    const listingData = {
        id,
        product: crop,
        quantity,
        price: price.replace('R', ''),
        farmerName: farmerName || seller,
        location
    };


    return (
        <>
        <div className="produce-card">
            <div className="produce-image-container">
                <img
                    src={imageUrl}
                    alt={crop}
                    className="produce-image"
                    onError={(e) => {
                        e.target.src = '/placeholder-produce.png';
                    }}
                />
                {status && (
                    <span className={`status-badge ${status.toLowerCase()}`}>
                        {status}
                    </span>
                )}
            </div>

            <div className="produce-details">
                <h3 className="produce-name">{crop}</h3>

                <div className="produce-info">
                    <div className="info-row">
                        <span className="label">Quantity:</span>
                        <span className="value">{quantity}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Price:</span>
                        <span className="value price">{price}</span>
                    </div>
                </div>

                <div className="seller-info">
                    <div className="seller-row">
                        <span className="seller-icon">👤</span>
                        <span className="seller-name">{seller}</span>
                    </div>
                    {location && (
                        <div className="location-row">
                            <span className="location-icon">📍</span>
                            <span className="location-name">{location}</span>
                        </div>
                    )}
                </div>

                <div className="card-actions">
                    {/*<button className="btn-contact">Contact Farmer</button>*/}
                    <button className = "btn-add-cart"
                            onClick={handleAddToCart}
                            disabled={addingToCart}
                            >
                        {addingToCart ? 'Adding...' : 'Add to Cart'}
                    </button>

                    {/*<button className="btn-order">Order Now</button>*/}
                    <button
                        className = "btn-order" onClick={handleOrderClick}>
                        Buy Now
                    </button>
                </div>

            </div>
        </div>

            {showCheckoutModal && (
                <GuestCheckoutModal
                    listing={listingData}
                    onClose={() => setShowCheckoutModal(false)}
                    onSuccess={handleCheckoutSuccess}
                    />
            )}

        </>
    );


}

export default ProduceCard;