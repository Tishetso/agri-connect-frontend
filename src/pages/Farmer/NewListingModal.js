import React, {useEffect, useState} from "react";
import "./NewListingModal.css";
import {createListing} from "src/api/listingApi"
/*import { createListing } from "../../api/listingApi";*/
function NewListingModal({ closeModal, addListing, editListing, itemToEdit }) {

    const [formData, setFormData] = useState({
        id: null,
        product: "",
        quantity: "",
        price: "",
        images:[]

    });

    const [previewUrls, setPreviewUrls] = useState([]); //image preview

    //Pre-fill data when editing
    useEffect(() => {
        if(itemToEdit){
            setFormData({
                id: itemToEdit.id,
                product: itemToEdit.product,
                quantity: itemToEdit.quantity,
                price: itemToEdit.price,
                images: itemToEdit.images || []
            });

            if (itemToEdit.imageUrls){
                setPreviewUrls(itemToEdit.imageUrls.map(url => `http://localhost:8080/${url}`));
            }

           /* //convert file objects to preview urls
            if (itemToEdit.images && itemToEdit.images.length > 0 ) {
                const urls = itemToEdit.images.map(img => URL.createObjectURL(img));
                setPreviewUrls(urls);
            }*/


        }
    }, [itemToEdit]);

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

    /*//adding a useEffect for edit listings
    useEffect(() => {
        if (itemToEdit) {
            setFormData(itemToEdit);
            if (itemToEdit.images) {
                const previews = itemToEdit.images.map(img =>
                    typeof img === "string"
                        ? img
                        : URL.createObjectURL(img)
                );
                setPreviewUrls(previews);
            }
        }
    }, [itemToEdit]);*/

    const handleSubmit = async () => {
        if(formData.images.length === 0 && !itemToEdit){
            alert("Please upload at least 1 image.");
            return;
        }

       /* if(itemToEdit){
            editListing(formData)
        }else{
            addListing(formData);
        }*/
        try{
            if(itemToEdit){
                editListing(formData);
            }else{
                //Create a listing on backend
                const savedListing = await createListing(formData);

                //frontend updates with fresh backend data
                addListing(savedListing);
            }

            closeModal();

        }catch(error){
            console.error(error);
            alert("Error saving listing");
        }


    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">

                <h3>{itemToEdit ? "Edit Listing" : "Add New Listing"}</h3>

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




                <div className="modal-actions">
                    <button className="cancel-btn" onClick={closeModal}>Cancel</button>
                    <button className="save-btn" onClick={handleSubmit}>{itemToEdit ? "Save Changes" : "Save"}</button>
                </div>

            </div>
        </div>
    );
}

export default NewListingModal;
