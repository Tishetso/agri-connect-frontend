import React, { useEffect, useState } from "react";
import "./NewListingModal.css";
import { createListing, updateListing } from "../../api/listingApi";

function NewListingModal({ closeModal, addListing, editListing, itemToEdit }) {
    const [formData, setFormData] = useState({
        id: null,
        product: "",
        quantity: "",
        price: "",
        images: [], // File objects only (new uploads)
    });

    const [previewUrls, setPreviewUrls] = useState([]);

    // Pre-fill when editing
    useEffect(() => {
        if (itemToEdit) {
            setFormData({
                id: itemToEdit.id,
                product: itemToEdit.product || "",
                quantity: itemToEdit.quantity || "",
                price: itemToEdit.price || "",
                images: [], // We don't store old File objects — only previews
            });

            // Show existing images from server
            if (itemToEdit.imageUrls && itemToEdit.imageUrls.length > 0) {
                const fullUrls = itemToEdit.imageUrls.map(
                    (filename) => `http://localhost:8080/${filename}`
                );
                setPreviewUrls(fullUrls);
            }
        } else {
            // Reset for new listing
            setFormData({ id: null, product: "", quantity: "", price: "", images: [] });
            setPreviewUrls([]);
        }
    }, [itemToEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const MAX_WIDTH = 1200;
                    let width = img.width;
                    let height = img.height;

                    if (width > MAX_WIDTH) {
                        height = (MAX_WIDTH / width) * height;
                        width = MAX_WIDTH;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            resolve(
                                new File([blob], file.name, {
                                    type: "image/jpeg",
                                    lastModified: Date.now(),
                                })
                            );
                        },
                        "image/jpeg",
                        0.8
                    );
                };
            };
        });
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 3) {
            alert("Max 3 images");
            return;
        }

        // Compress and store only the compressed File objects
        const compressed = await Promise.all(files.map(compressImage));
        setFormData(prev => ({ ...prev, images: compressed }));

        // Preview URLs from compressed files
        const previews = compressed.map(f => URL.createObjectURL(f));
        setPreviewUrls(previews);
    };

    const handleSubmit = async () => {
        if (formData.images.length === 0 && !itemToEdit) {
            alert("Please upload at least 1 image.");
            return;
        }

        try {
            const data = new FormData();
            data.append("product", formData.product);
            data.append("quantity", formData.quantity);
            data.append("price", Number(formData.price));

            // DEBUG: Check what is in formData.images
            console.log("Images in formData:", formData.images);
            formData.images.forEach((file, index) => {
                console.log(`Image ${index}:`, file.name, file.size, file.type, file instanceof File);
            });


            // ONLY APPEND NEW FILES (File objects)
            formData.images.forEach((file) => {
                data.append("images", file);  // file is already compressed File object
            });

            // DEBUG: Check FormData contents
            for (let pair of data.entries()) {
                console.log(pair[0] + ':', pair[1]);
            }

            let savedListing;
            if (itemToEdit) {
                savedListing = await updateListing(itemToEdit.id, data);
            } else {
                savedListing = await createListing(data);
            }

            addListing(savedListing);
            closeModal();
        } catch (error) {
            console.error("SAVE ERROR:", error);
            alert("Error saving listing");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{itemToEdit ? "Edit Listing" : "Add New Listing"}</h3>

                <label>Product</label>
                <input name="product" value={formData.product} onChange={handleChange} />

                <label>Quantity</label>
                <input name="quantity" value={formData.quantity} onChange={handleChange} />

                <label>Price (R)</label>
                <input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                />

                <label>Upload Images (Max 3)</label>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} />

                {/* Preview: shows old + new images */}
                {previewUrls.length > 0 && (
                    <div className="preview-container">
                        {previewUrls.map((url, index) => (
                            <div key={index} className="preview-image-wrapper">
                                <img src={url} alt={`preview ${index}`} className="preview-image" />
                            </div>
                        ))}
                    </div>
                )}

                <div className="modal-actions">
                    <button className="cancel-btn" onClick={closeModal}>Cancel</button>
                    <button className="save-btn" onClick={handleSubmit}>
                        {itemToEdit ? "Save Changes" : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NewListingModal;