// src/utils/requestJson.js
export const requestJson = async (url, options = {}) => {
    const res = await fetch(url, options);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data.error || data.message || 'Request failed');
    }

    return data;
};