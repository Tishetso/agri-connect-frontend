import React, { useState } from "react";
import "./ListingCard.css";

function ListingCard({ data, onDelete, onEdit }) {
    const [viewImage, setViewImage] = useState(null);

    console.log("Image URLs:", data.imageUrls);
    console.log("First image:", data.imageUrls?.[0]);

    // Construct the full image URL from the filename
    const getImageUrl = (filename) => {
        if (!filename) return null;
        // If it's already a full URL, use it as-is
        if (filename.startsWith('http')) return filename;
        // Otherwise, construct the URL
        return `http://localhost:8080/uploads/${filename}`;
    };

    return (
        <div className="listing-card">
            <h3>{data.product}</h3>

            <p><strong>Quantity:</strong> {data.quantity}</p>
            <p><strong>Price:</strong> R{data.price}</p>
            <span className={`status ${data?.status?.toLowerCase() || ""}`}>
                {data.status}
            </span>

            {/* Image display - use imageUrls from backend */}
            {data.imageUrls && data.imageUrls.length > 0 && (
                <div className="card-images">
                    {data.imageUrls.map((filename, index) => {
                        const imageUrl = getImageUrl(filename);
                        return (
                            <img
                                key={index}
                                src={imageUrl}
                                alt={`${data.product} ${index + 1}`}
                                className="card-image"
                                onClick={() => setViewImage(imageUrl)}
                                onError={(e) => {
                                    console.error("Failed to load image:", imageUrl);
                                    e.target.src = "/placeholder.png"; // Optional fallback
                                }}
                            />
                        );
                    })}
                </div>
            )}

            {/* Full screen viewer */}
            {viewImage && (
                <div className="image-viewer-overlay" onClick={() => setViewImage(null)}>
                    <img
                        src={viewImage}
                        alt="Full Size"
                        className="full-image"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button className="close-btn" onClick={() => setViewImage(null)}>×</button>
                </div>
            )}

            <div className="card-actions">
                <button className="edit-btn" onClick={() => onEdit(data)}>Edit</button>
                <button className="delete-btn" disabled onClick={() => onDelete(data.id)}>Delete</button>
            </div>
        </div>
    );
}

export default ListingCard;