import React, { useState, useEffect } from "react";
import ListingCard from "./ListingCard";
import NewListingModal from "./NewListingModal";
import "./ListingsPage.css";
import { fetchMyListings, deleteListing as deleteListingApi } from "../../api/listingApi";

function ListingsPage() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);

    useEffect(() => {
        loadMyListings();
    }, []);

    const loadMyListings = async () => {

        try {
            setLoading(true);
            const data = await fetchMyListings();
            console.log("Image URLs:", data.imageUrls);
            console.log("First image:", data.imageUrls?.[0]);
            console.log('==========================');
            console.log(localStorage.getItem("user"));
            console.log(JSON.parse(localStorage.getItem("user")));
            console.log('==========================');
            setListings(data);
        } catch (err) {
            console.error("Failed to load listings: ", err);
            alert("Could not load your listings. Are you logged in?");
        } finally {
            setLoading(false);
        }

    };

    // Just update state - modal handles API call
    const addListing = (newListing) => {
        setListings(prev => [...prev, newListing]);
        setShowModal(false);
    };

    // Handling delete
    const handleDeleteListing = async (id) => {
        if (!window.confirm("Delete this listing?")) return;

        try {
            await deleteListingApi(id);
            setListings(prev => prev.filter(l => l.id !== id));
        } catch (err) {
            alert("Failed to delete listing");
        }
    };

    const editListing = (item) => {
        setEditItem(item);
        setShowModal(true);
    };

    // Just update state - modal handles API call
    const updateListing = (updatedListing) => {
        setListings(prev => prev.map(l => (l.id === updatedListing.id ? updatedListing : l)));
        setShowModal(false);
        setEditItem(null);
    };

    if (loading) {
        return <div className="loading">Loading your listings...</div>;
    }

    return (
        <div className="listings-page">
            <div className="listings-header">
                <h2>My Produce Listings ({listings.length})</h2>
                <button className="add-btn" onClick={() => setShowModal(true)}>
                    + New Listing
                </button>
            </div>
            <p className = "no-change">You cannot delete, rather edit then change that particular item <br/>click the image to zoom</p>

            {listings.length === 0 ? (
                <div className="empty-state">
                    <p>No listings yet. Create your first one!</p>
                </div>
            ) : (
                <div className="listings-grid">
                    {listings.map(item => (
                        <ListingCard
                            key={item.id}
                            data={item}
                            onDelete={handleDeleteListing}
                            onEdit={editListing}
                        />
                    ))}
                </div>
            )}

            {showModal && (
                <NewListingModal
                    closeModal={() => {
                        setShowModal(false);
                        setEditItem(null);
                    }}
                    addListing={addListing}
                    editListing={updateListing}  // ← Changed prop name to match function
                    itemToEdit={editItem}
                />
            )}
        </div>
    );
}

export default ListingsPage;