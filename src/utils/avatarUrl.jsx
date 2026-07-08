// utils/avatarUrl.js
export function getAvatarUrl(user) {
    if (!user?.avatarUrl) return null;
    if (user.avatarUrl.startsWith('http')) return user.avatarUrl;
    // Strip any accidental leading "uploads/" to avoid double-prefixing
    const filename = user.avatarUrl.replace(/^uploads\//, '');
    return `http://localhost:8080/uploads/${filename}`;
}