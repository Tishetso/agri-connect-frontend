import axios from "axios";

const API_URL = "http://localhost:8080/api/listings";

const getHeaders = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token ? {
        Authorization: `Bearer ${user.token}`
    }: {};
};
//Fetching items
export const fetchMyListings = async () => {
    const res = await axios.get(`${API_URL}/myListings`, { headers : getHeaders() });
    return res.data;

};
//calling create
export const createListing = async (formData) => {
    const res = await axios.post(`${API_URL}/create`, formData, {
        headers: {
            ...getHeaders(),
            "Content-Type" : "multipart/form-data", //prevents Axios from breaking FormData
        },
        transformRequest: [(data) => data], //Dont let Axios touch the FormData
        });
    return res.data;
};
//deleting a list
export const deleteListing = async (id) => {
    await axios.delete(`${API_URL}/${id}`, {headers: getHeaders()});
};

export const updateListing = async (id, formData) => {
    const res = await axios.put(`${API_URL}/${id}`, formData, {
        headers : {
            ...getHeaders(),
            "Content-Type": "multipart/form-data",
        },
        transformRequest: [(data) => data],
        });
    return res.data;
};