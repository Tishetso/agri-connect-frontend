import React, { useState } from "react";
import ListingCard from "./ListingCard";
import NewListingModal from "./NewListingModal";
import "./ListingsPage.css";

function ListingsPage() {

    const [listings, setListings] = useState([
        { id: 1, crop: "Tomatoes", quantity: "50kg", price: 300, status: "Available", transport: "Delivery" },
        { id: 2, crop: "Spinach", quantity: "20 bunches", price: 100, status: "Sold", transport: "Collect" },
        { id: 3, crop: "Spinach", quantity: "20 bunches", price: 100, status: "Available", transport: "Collect" },
        { id: 4, crop: "Spinach", quantity: "20 bunches", price: 100, status: "Available", transport: "Collect" }
    ]);

    const [showModal, setShowModal] = useState(false);

    const addListing = (newItem) => {
        setListings([...listings, { id: listings.length + 1, ...newItem }]);
    };

    return (
        <div className="listings-page">

            <div className="listings-header">
                <h2>My Produce Listings</h2>
                <button className="add-btn" onClick={() => setShowModal(true)}>
                    + New Listing
                </button>
            </div>

            <div className="listings-grid">
                {listings.map(item => (
                    <ListingCard key={item.id} data={item} />
                ))}
            </div>

            {showModal && (
                <NewListingModal
                    closeModal={() => setShowModal(false)}
                    addListing={addListing}
                />
            )}
        </div>
    );
}

export default ListingsPage;
