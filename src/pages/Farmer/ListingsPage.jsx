import React, { useState, useEffect } from "react";
import ListingCard from "./ListingCard";
import NewListingModal from "./NewListingModal";
import "./ListingsPage.css";
import { createListing, fetchMyListings, deleteListing } from "../../api/listingApi";

function ListingsPage() {

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);

    //load current user's listing on mount
    useEffect(() => {
        loadMyListings();
    }, []);

    const loadMyListings = async () => {
        try{
            setLoading(true);
            const data = await fetchMyListings(); //api call function imported //returns listings of the logged in user
            setListings(data);
        }catch (err){
            console.error("Failed to load listings: ", err);
            alert("Could not load your listings. Are your logged in?");
        }finally{
            setLoading(false);
        }
    }

    const addListing = async (formData) => {
        try{
            const savedListing = await createListing(formData); //this the api call
            setListings(prev => [...prev, savedListing]);
            setShowModal(false);
        }catch (err){
            alert("Failed to create a listing.");
            console.error(err);

        }
    };

    //handling delete
    const deleteListing = async (id) => {
        if (!window.confirm("delete this listing?")) return;

        try{
            await deleteListing(id);//=> l l
            setListings( prev => prev.filter(l => l.id !== id));
        }catch (err){
            alert("failed to delete listing");
        }
    };

    const editListing = (item) => {
        setEditItem(item);
        setShowModal(true);
    };


    //update a listing
    const updateListing = async (updatedData) => {
        try{
            const updated = await updateListing(updatedData.id, updatedData.formData);
            setListings(prev => prev.map( l => (l.id ===updated.id ? updated : l)));
            setShowModal(false);
            setEditItem(null);
        }catch(err){
            alert("Failed to update listing");
        }
    };

    if (loading)
        return <div className = "loading">Loading your listings...</div>;

    //open modal for editing
 /*   const openEditModal = (item) => {
        setEditItem(item);
        setShowModal(true);
    }*/


    return (
        <div className="listings-page">

            <div className="listings-header">
                <h2>My Produce Listings({listings.length})</h2>
                <button className="add-btn" onClick={() => setShowModal(true)}>
                    + New Listing
                </button>
            </div>



            {listings.length === 0 ? (
                <div className="empty-state">
                    <p>No listings yet. Create your first one!</p>
                </div>
            ): (
                <div className="listings-grid">
                    {listings.map(item => (
                        <ListingCard
                        key={item.id}
                        data={item}
                        onDelete={deleteListing}
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
                    updateListing={updateListing}
                    itemToEdit={editItem}
                />
            )}
        </div>
    );
}

export default ListingsPage;
