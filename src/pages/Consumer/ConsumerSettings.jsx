import React, { useState, useEffect, useRef } from 'react';
import './ConsumerSettings.css';
import toast from "react-hot-toast";

const BASE_URL = 'http://localhost:8080';

function Avatar({ src, initials, size = 80 }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: '50%', overflow: 'hidden',
            background: '#e8f0fe', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0, border: '3px solid #c5d3f5',
        }}>
            {src ? (
                <img src={src} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
                <span style={{ fontSize: size * 0.35, fontWeight: 600, color: '#3b5bdb', letterSpacing: '-0.5px' }}>
                    {initials}
                </span>
            )}
        </div>
    );
}

function getInitials(name, surname) {
    return `${name?.[0] ?? ''}${surname?.[0] ?? ''}`.toUpperCase();
}

function formatDate(isoString) {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
}

function ReadOnlyField({ label, value, badge }) {
    return (
        <div className="form-group">
            <label>
                {label}
                {badge && <span className="field-source">{badge}</span>}
            </label>
            <div className="field-readonly">{value || '—'}</div>
        </div>
    );
}

// Build full image URL from stored filename
function buildAvatarUrl(filename) {
    if (!filename) return null;
    // If it's already a full URL (http...), use as-is
    if (filename.startsWith('http')) return filename;
    return `${BASE_URL}/uploads/${filename}`;
}

function ConsumerSettings() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '', surname: '', region: '', phone: '',
        notifications: true, emailUpdates: true,
    });
    const [avatarSrc, setAvatarSrc] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            setFormData({
                name:          parsed.name    ?? '',
                surname:       parsed.surname ?? '',
                region:        parsed.region  ?? '',
                phone:         parsed.phone   ?? '',
                notifications: true,
                emailUpdates:  true,
            });
            // Load persisted avatar from DB (filename stored at login)
            setAvatarSrc(buildAvatarUrl(parsed.avatarUrl));
        }
        setLoading(false);
    }, []);

    // Helper — call this whenever localStorage user changes
    const syncUserEvent = () => window.dispatchEvent(new Event('userUpdated'));

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    // ── Avatar upload ─────────────────────────────────────────────────────────
    const applyAvatarFile = async (file) => {
        if (!file || !file.type.startsWith('image/')) return;

        // Show preview immediately
        setAvatarSrc(URL.createObjectURL(file));
        setUploadingAvatar(true);

        try {
            const token = localStorage.getItem('token');
            const form = new FormData();
            form.append('avatar', file);

            const res = await fetch(`${BASE_URL}/api/users/avatar`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: form,
            });

            if (res.ok) {
                const data = await res.json();
                // Update localStorage with new filename so it persists across sessions
                const updated = { ...user, avatarUrl: data.avatarUrl };
                localStorage.setItem('user', JSON.stringify(updated));
                setUser(updated);
                setAvatarSrc(buildAvatarUrl(data.avatarUrl));
                syncUserEvent(); //syncs profiles avatars between components
                toast.success('Profile photo updated');
            } else {
                toast.error('Failed to upload photo');
                // Revert preview to previous avatar
                setAvatarSrc(buildAvatarUrl(user?.avatarUrl));
            }
        } catch {
            toast.error('Network error uploading photo');
            setAvatarSrc(buildAvatarUrl(user?.avatarUrl));
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        applyAvatarFile(e.dataTransfer.files[0]);
    };

    const handleRemoveAvatar = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${BASE_URL}/api/users/avatar`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (res.ok) {
                const updated = { ...user, avatarUrl: '' };
                localStorage.setItem('user', JSON.stringify(updated));
                setUser(updated);
                setAvatarSrc(null);
                syncUserEvent();
                if (fileInputRef.current) fileInputRef.current.value = '';
                toast.success('Profile photo removed');
            } else {
                toast.error('Failed to remove photo');
            }
        } catch {
            toast.error('Network error removing photo');
        }
    };

    // ── Profile save ──────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name:    formData.name,
                    surname: formData.surname,
                    region:  formData.region,
                    phone:   formData.phone,
                }),
            });

            if (response.ok) {
                const updated = { ...user, ...formData };
                localStorage.setItem('user', JSON.stringify(updated));
                setUser(updated);
                toast.success('Settings saved!');
            } else {
                toast.error('Failed to save settings');
            }
        } catch {
            toast.error('Network error. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="consumer-settings"><p>Loading...</p></div>;
    if (!user)   return <div className="consumer-settings"><p>You are not logged in.</p></div>;

    return (
        <div className="consumer-settings">
            <header className="page-header">
                <h2>⚙️ Settings</h2>
                <p>Manage your account and preferences</p>
            </header>

            <form className="settings-form" onSubmit={handleSubmit}>

                {/* ── Personal Information ── */}
                <section className="settings-section">
                    <h3>Personal Information</h3>

                    <div className="avatar-row">
                        <div style={{ position: 'relative' }}>
                            <Avatar src={avatarSrc} initials={getInitials(formData.name, formData.surname)} size={80} />
                            {uploadingAvatar && (
                                <div style={{
                                    position: 'absolute', inset: 0, borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.7)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 12, color: '#3b5bdb', fontWeight: 600,
                                }}>
                                    Uploading...
                                </div>
                            )}
                        </div>
                        <div className="avatar-actions">
                            <div
                                className={`avatar-drop-zone${isDragging ? ' dragging' : ''}`}
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                role="button" tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                                aria-label="Upload profile photo"
                            >
                                <span className="drop-icon">📷</span>
                                <span>{uploadingAvatar ? 'Uploading...' : 'Click or drag to upload photo'}</span>
                                <span className="drop-hint">JPG, PNG, or WebP · Max 5 MB</span>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => applyAvatarFile(e.target.files[0])}
                                style={{ display: 'none' }}
                            />
                            {avatarSrc && !uploadingAvatar && (
                                <button type="button" className="btn-remove-avatar" onClick={handleRemoveAvatar}>
                                    Remove photo
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name">First Name</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="surname">Surname</label>
                            <input type="text" id="surname" name="surname" value={formData.surname} onChange={handleChange} />
                        </div>
                    </div>

                    <ReadOnlyField label="Email Address" value={user.email} badge="from your account" />
                    <ReadOnlyField label="Role" value={user.role} />
                    <ReadOnlyField label="Account Status" value={user.status} />
                    <ReadOnlyField label="Member Since" value={formatDate(user.createdAt)} />
                </section>

                {/* ── Contact & Delivery ── */}
                <section className="settings-section">
                    <h3>Contact &amp; Delivery</h3>

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel" id="phone" name="phone"
                            placeholder="+27 82 000 0000"
                            value={formData.phone} onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="region">Address / Region</label>
                        <input
                            type="text" id="region" name="region"
                            placeholder="e.g. Soshanguve East, Pretoria"
                            value={formData.region} onChange={handleChange}
                        />
                    </div>
                </section>

                {/* ── Account Actions ── */}
                <section className="settings-section">
                    <h3>Account Actions</h3>
                    <div className="action-buttons">
                        <button type="button" className="btn-secondary">Change Password</button>
                        <button type="button" className="btn-danger">Delete Account</button>
                    </div>
                </section>

                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" className="btn-secondary">Cancel</button>
                </div>

            </form>
        </div>
    );
}

export default ConsumerSettings;