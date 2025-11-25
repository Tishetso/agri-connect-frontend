import React from "react";
import "./ListingCard.css";

function ListingCard({ data }) {

    return (
        <div className="listing-card">
            <h3>{data.crop}</h3>
            <p><strong>Quantity:</strong> {data.quantity}</p>
            <p><strong>Price:</strong> R{data.price}</p>
            <p><strong>Transport:</strong> {data.transport}</p>
            <span className={`status ${data.status.toLowerCase()}`}>
                {data.status}
            </span>
        </div>
    );
}

export default ListingCard;
