const API_URL = "http://localhost:8080/api/listings";

const getToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token;
};

export const fetchMyListings = async () => {
    const token = getToken();
    const res = await fetch(`${API_URL}/myListings`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to fetch listings");
    return res.json();
};

export const createListing = async (formData) => {
    const token = getToken();
    const res = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            // DO NOT set Content-Type AT ALL
            // DO NOT set any other headers
        },
        body: formData,  // This is the key — body must be FormData
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("Server error response:", errorText);
        throw new Error(`Failed: ${res.status} - ${errorText || "No response body"}`);
    }

    return res.json();
};

export const updateListing = async (id, formData) => {
    const token = getToken();
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed: ${res.status} - ${errorText}`);
    }
    return res.json();
};

export const deleteListing = async (id) => {
    const token = getToken();
    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to delete");
};