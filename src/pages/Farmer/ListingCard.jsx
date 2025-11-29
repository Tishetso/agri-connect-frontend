import React, {useState} from "react";
import "./ListingCard.css";

function ListingCard({ data,deleteListing, openEditModal }) {

    const [viewImage, setViewImage] = useState(null);
  /*  const [editItem, setEditItem] = useState(null);*/

    /*const openEditModal = (item) => {
        setEditItem(item);
        setShowModal(true);
    };

    const deleteListing = (id) => {
        setListings(listings.filter(1 => 1.id !== id));
    }*/

  /*  const editListing = (updatedItem) => {
        setListings(listings.map(1 =>
    1.id === updatedItem.id ? updatedItem : 1
    ));
    };*/

    return (
        <div className="listing-card">
            <h3>{data.product}</h3>

            <p><strong>Quantity:</strong> {data.quantity}</p>
            <p><strong>Price:</strong> R{data.price}</p>
            <span className={`status ${data?.status?.toLowerCase() || ""}`}> </span>


            {/*Image display*/}
            {data.images && data.images.length > 0 && (
                <div className="card-images">
                    {data.images.map((img,index) => (
                    <img key={index} src={URL.createObjectURL(img)} alt="listing" className="card-image" onClick={() => setViewImage(URL.createObjectURL(img))}/>
                    ))}
                </div>
                )}

            {/*Full screen viewer*/}
            {viewImage && (
                <div className="image-viewer-overlay" onClick={() => setViewImage(null)}>
                    <img
                        src={viewImage}
                        alt="Full Size"
                        className="full-image"
                        onClick={(e) => e.stopPropagation()} /> /*/!*!/!*Prevents closing when clicking the image*!/!*!/*/
                    />
                    <button className="close-btn" onClick={() => setViewImage(null)}>x</button>
                    </div>

            )}
            <div className = "card-actions">
                <button className = "edit-btn" onClick={() => openEditModal(data)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteListing(data.id)}>Delete</button>
            </div>
        </div>
    );
}

export default ListingCard;
