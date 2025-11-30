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
    const [editItem, setEditItem] = useState(null);

    //add listing
    const addListing = (newItem) => {//hardcorded status
        setListings([...listings, { id: listings.length + 1 , status:newItem.status || "Available", ...newItem }]);
    };
    // Delete listing
    const deleteListing = (id) => {
        setListings(listings.filter(l => l.id !== id));
    };
    //open modal for editing
    const openEditModal = (item) => {
        setEditItem(item);
        setShowModal(true);
    }

    //save edit
    const editListing = (updatedItem) => {
        setListings(listings.map(l =>
            l.id === updatedItem.id ? updatedItem : l
        ));
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
                    <ListingCard
                        key={item.id}
                        data={item}
                        deleteListing={deleteListing}
                        openEditModal={openEditModal}/>
                ))}
            </div>

            {showModal && (
                <NewListingModal
                    closeModal={() => {
                        setShowModal(false);
                        setEditItem(null);
                }}
                    addListing={addListing}
                    editListing={editListing}
                    itemToEdit={editItem}
                />
            )}
        </div>
    );
}

export default ListingsPage;
