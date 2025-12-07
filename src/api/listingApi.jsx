import axios from "axios";

export const createListing = async (data) =>{
    const stored =(localStorage.getItem("user"));
    if (!stored) throw new Error("Not logged in");

    const user = JSON.parse(stored);
    const token = user?.token || user?.user?.token;



    if(!token){
        throw new Error("User not logged in");
    }
    console.log("Token being sent:", token);

    const response = await axios.post(
        "http://localhost:8080/api/listings/create",
        data,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            },
        }
    );

    return response.data;
}


/*;

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
}*/
