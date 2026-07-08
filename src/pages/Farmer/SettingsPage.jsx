import React, { useState, useEffect, useRef } from 'react';
import './SettingsPage.css';
import toast from 'react-hot-toast';

const BASE_URL = 'http://localhost:8080';

function Avatar({ src, initials, size = 80 }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: '50%', overflow: 'hidden',
            background: '#e6f4ea', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0, border: '3px solid #a8d5b5',
        }}>
            {src ? (
                <img src={src} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
                <span style={{ fontSize: size * 0.35, fontWeight: 600, color: '#2d6a4f', letterSpacing: '-0.5px' }}>
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

function buildAvatarUrl(filename) {
    if (!filename) return null;
    if (filename.startsWith('http')) return filename;
    return `${BASE_URL}/uploads/${filename}`;
}

// Crop type options relevant to SA farmers
const CROP_TYPES = [
    'Maize', 'Wheat', 'Sorghum', 'Sunflower', 'Soybeans',
    'Vegetables', 'Fruit', 'Sugarcane', 'Cotton', 'Livestock', 'Poultry', 'Other',
];

function SettingsPage() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '', surname: '', phone: '', region: '',
        farmName: '', farmSize: '', cropTypes: [],
        bio: '', notifications: true, smsAlerts: true,
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
                name:          parsed.name      ?? '',
                surname:       parsed.surname   ?? '',
                phone:         parsed.phone     ?? '',
                region:        parsed.region    ?? '',
                farmName:      parsed.farmName  ?? '',
                farmSize:      parsed.farmSize  ?? '',
                cropTypes:     parsed.cropTypes ?? [],
                bio:           parsed.bio       ?? '',
                notifications: true,
                smsAlerts:     true,
            });
            setAvatarSrc(buildAvatarUrl(parsed.avatarUrl));
        }

        setLoading(false);
    }, []);

    const syncUserEvent = () => window.dispatchEvent(new Event('userUpdated'));

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleCropToggle = (crop) => {
        setFormData(prev => ({
            ...prev,
            cropTypes: prev.cropTypes.includes(crop)
                ? prev.cropTypes.filter(c => c !== crop)
                : [...prev.cropTypes, crop],
        }));
    };

    // ── Avatar upload ─────────────────────────────────────────────────────────
    const applyAvatarFile = async (file) => {
        if (!file || !file.type.startsWith('image/')) return;
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
                const updated = { ...user, avatarUrl: data.avatarUrl };
                localStorage.setItem('user', JSON.stringify(updated));
                setUser(updated);
                setAvatarSrc(buildAvatarUrl(data.avatarUrl));
                syncUserEvent();
                toast.success('Profile photo updated');
            } else {
                toast.error('Failed to upload photo');
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
            console.log("The token is ", token);
            const response = await fetch(`${BASE_URL}/api/users/farmer/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name:      formData.name,
                    surname:   formData.surname,
                    phone:     formData.phone,
                    region:    formData.region,
                    farmName:  formData.farmName,
                    farmSize:  formData.farmSize,
                    cropTypes: formData.cropTypes,
                    bio:       formData.bio,
                }),
            });

            console.log("Response status:", response.status);   // ← and this


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

    if (loading) return <div className="settings-page"><p>Loading...</p></div>;
    if (!user)   return <div className="settings-page"><p>You are not logged in.</p></div>;

    return (
        <div className="settings-page">
            <header className="page-header">
                <h2>⚙️ Settings</h2>
                <p>Manage your farm profile and preferences</p>
            </header>

            <form className="settings-form" onSubmit={handleSubmit}>

                {/* ── Personal Information ── */}
                <section className="settings-section">
                    <h3>Personal Information</h3>

                    <div className="avatar-row">
                        <div style={{ position: 'relative' }}>
                            <Avatar
                                src={avatarSrc}
                                initials={getInitials(formData.name, formData.surname)}
                                size={80}
                            />
                            {uploadingAvatar && (
                                <div style={{
                                    position: 'absolute', inset: 0, borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.7)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 12, color: '#2d6a4f', fontWeight: 600,
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


                {/* ── Farm Details ── */}
                {/*
                <section className="settings-section">
                    <h3>Farm Details</h3>

                    <div className="form-group">
                        <label htmlFor="farmName">Farm Name</label>
                        <input
                            type="text" id="farmName" name="farmName"
                            placeholder="e.g. Mphelane Family Farm"
                            value={formData.farmName} onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="farmSize">Farm Size (hectares)</label>
                        <input
                            type="number" id="farmSize" name="farmSize"
                            placeholder="e.g. 50"
                            min="0" step="0.1"
                            value={formData.farmSize} onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Crop / Produce Types</label>
                        <div className="crop-tags">
                            {CROP_TYPES.map(crop => (
                                <button
                                    key={crop}
                                    type="button"
                                    className={`crop-tag${formData.cropTypes.includes(crop) ? ' active' : ''}`}
                                    onClick={() => handleCropToggle(crop)}
                                >
                                    {crop}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="bio">About Your Farm</label>
                        <textarea
                            id="bio" name="bio"
                            placeholder="Tell buyers a little about your farm and farming practices..."
                            rows={3}
                            value={formData.bio} onChange={handleChange}
                        />
                    </div>
                </section>*/}

                {/* ── Contact & Location ── */}
                <section className="settings-section">
                    <h3>Contact &amp; Location</h3>

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel" id="phone" name="phone"
                            placeholder="+27 82 000 0000"
                            value={formData.phone} onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="region">Farm Location / Region</label>
                        <input
                            type="text" id="region" name="region"
                            placeholder="e.g. Limpopo, Tzaneen"
                            value={formData.region} onChange={handleChange}
                        />
                    </div>
                </section>

                {/* ── Preferences ── */}
                <section className="settings-section">
                    <h3>Preferences</h3>
                    <div className="checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox" name="notifications"
                                checked={formData.notifications} onChange={handleChange}
                            />
                            Receive email notifications
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox" name="smsAlerts"
                                checked={formData.smsAlerts} onChange={handleChange}
                            />
                            Receive SMS alerts for new orders
                        </label>
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

export default SettingsPage;