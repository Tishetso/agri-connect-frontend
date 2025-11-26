import React, { useState } from "react";
import "./NewListingModal.css";

function NewListingModal({ closeModal, addListing }) {

    const [formData, setFormData] = useState({
        product: "",
        quantity: "",
        price: "",
        images:[]

    });

    const [previewUrls, setPreviewUrls] = useState([]); //image preview


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    //handle image upload //with preview
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        //limit to 3 images
        if(files.length > 3){
            alert("You can upload a maximum of 3 images");
            return;
        }

        //creating preview Urls
        const previews = files.map(file => URL.createObjectURL(file));



        setFormData({
            ...formData,
            images:files,
        });

        setPreviewUrls(previews);
    };

    const handleSubmit = () => {
        if(formData.images.length === 0){
            alert("Please upload at least 1 image.");
            return;
        }

        addListing(formData);
        closeModal();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">

                <h3>Add New Listing</h3>

                <label>Product</label>
                <input name="product" onChange={handleChange} />

                <label>Quantity</label>
                <input name="quantity" onChange={handleChange} />

                <label>Price (R)</label>
                <input name="price" type="number" onChange={handleChange} />

                 {/*Image upload*/}
                <label>Upload Images (Max 3)</label>
                <input type="file" accept="image/*" multiple onChange={handleImageChange}/>

                {/*Thumbnail preview*/}
                {previewUrls.length > 0 && (
                    <div className="preview-container">
                        {previewUrls.map((url, index) => (
                            <div key={index} className="preview-image-wrapper">
                                <img src={url} alt="preview" className="preview-image"/>
                            </div>
                        ))}
                    </div>
                )}


                {/*Show selected image names
                {formData.images.length > 0 && (
                    <div className="image-preview-list">
                        {formData.images.map((img, index) => (
                            <p key={index}>{img.name}</p>
                        ))}
                    </div>
                )}*/}

                <div className="modal-actions">
                    <button className="cancel-btn" onClick={closeModal}>Cancel</button>
                    <button className="save-btn" onClick={handleSubmit}>Save</button>
                </div>

            </div>
        </div>
    );
}

export default NewListingModal;
