export async function createListing(formData){
    const data = new FormData();

    data.append("product", formData.product);
    data.append("quantity", formData.quantity);
    data.append("price", formData.price);

    formData.images.forEach(file => {
        data.append("images", file); //Must match @RequestPart("images")
    });

    const response = await fetch("http://localhost:8080/api/listings/create",{
        method: "POST",
        body: data
    });

    if (!response.ok){
        throw new Error("Failed to create listing");
    }

    return await response.json(); //backend return the saved listing
}