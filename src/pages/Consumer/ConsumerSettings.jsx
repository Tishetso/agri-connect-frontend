import React, { useState, useEffect, useRef } from 'react';
import './ConsumerSettings.css';

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

function ConsumerSettings() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '', surname: '', region: '', phone: '',
        notifications: true, emailUpdates: true,
    });
    const [avatarSrc, setAvatarSrc] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState(null);
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
        }
        setLoading(false);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const applyAvatarFile = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        setAvatarFile(file);
        setAvatarSrc(URL.createObjectURL(file));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        applyAvatarFile(e.dataTransfer.files[0]);
    };

    const handleRemoveAvatar = () => {
        setAvatarSrc(null);
        setAvatarFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSaveMessage(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/users/profile', {
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
                setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
            } else {
                const err = await response.json();
                setSaveMessage({ type: 'error', text: err.error ?? 'Failed to save settings.' });
            }
        } catch (err) {
            setSaveMessage({ type: 'error', text: 'Network error. Please try again.' });
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
                        <Avatar src={avatarSrc} initials={getInitials(formData.name, formData.surname)} size={80} />
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
                                <span>Click or drag to upload photo</span>
                                <span className="drop-hint">JPG, PNG, or WebP · Max 5 MB</span>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => applyAvatarFile(e.target.files[0])}
                                style={{ display: 'none' }}
                            />
                            {avatarSrc && (
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
                            type="tel"
                            id="phone"
                            name="phone"
                            placeholder="+27 82 000 0000"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="region">Address / Region</label>
                        <input
                            type="text"
                            id="region"
                            name="region"
                            placeholder="e.g. Soshanguve East, Pretoria"
                            value={formData.region}
                            onChange={handleChange}
                        />
                    </div>
                </section>

                {/* ── Notifications ── */}
                <section className="settings-section">
                    <h3>Notifications</h3>
                    <div className="form-group checkbox-group">
                        <label>
                            <input type="checkbox" name="notifications" checked={formData.notifications} onChange={handleChange} />
                            <span>Enable push notifications</span>
                        </label>
                    </div>
                    <div className="form-group checkbox-group">
                        <label>
                            <input type="checkbox" name="emailUpdates" checked={formData.emailUpdates} onChange={handleChange} />
                            <span>Receive email updates about new produce</span>
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

                {saveMessage && (
                    <div className={`save-message ${saveMessage.type}`}>
                        {saveMessage.text}
                    </div>
                )}

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