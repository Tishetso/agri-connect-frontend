import React, { useState } from "react";
import "./NewListingModal.css";

function NewListingModal({ closeModal, addListing }) {

    const [formData, setFormData] = useState({
        crop: "",
        quantity: "",
        price: "",
        transport: "Delivery"
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        addListing(formData);
        closeModal();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">

                <h3>Add New Listing</h3>

                <label>Crop</label>
                <input name="crop" onChange={handleChange} />

                <label>Quantity</label>
                <input name="quantity" onChange={handleChange} />

                <label>Price (R)</label>
                <input name="price" type="number" onChange={handleChange} />

                <label>Transport Option</label>
                <select name="transport" onChange={handleChange}>
                    <option>Delivery</option>
                    <option>Collect</option>
                </select>

                <div className="modal-actions">
                    <button className="cancel-btn" onClick={closeModal}>Cancel</button>
                    <button className="save-btn" onClick={handleSubmit}>Save</button>
                </div>

            </div>
        </div>
    );
}

export default NewListingModal;
