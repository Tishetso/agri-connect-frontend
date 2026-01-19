import React from 'react';
import './ProduceCard.css';

function ProduceCard({ crop, quantity, price, seller, location, status, imageUrls }) {
    // Get the first image or use a placeholder
    const imageUrl = imageUrls && imageUrls.length > 0
        ? `http://localhost:8080/uploads/${imageUrls[0]}`
        : '/placeholder-produce.png';

    return (
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
                    <button className="btn-contact">Contact Farmer</button>
                    <button className="btn-order">Order Now</button>
                </div>
            </div>
        </div>
    );
}

export default ProduceCard;