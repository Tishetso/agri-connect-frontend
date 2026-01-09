import React, { useState } from 'react';
import './ConsumerSettings.css';

function ConsumerSettings() {
    const [formData, setFormData] = useState({
        name: 'Consumer Name',
        email: 'consumer@example.com',
        phone: '+27 123 456 789',
        address: '123 Main St, Johannesburg',
        preferredDelivery: 'home',
        notifications: true,
        emailUpdates: true,
        dietaryPreferences: []
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Settings saved successfully!');
    };

    return (
        <div className="consumer-settings">
            <header className="page-header">
                <h2>⚙️ Settings</h2>
                <p>Manage your account and preferences</p>
            </header>

            <form className="settings-form" onSubmit={handleSubmit}>
                <section className="settings-section">
                    <h3>Personal Information</h3>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Delivery Address</label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>
                </section>

                <section className="settings-section">
                    <h3>Delivery Preferences</h3>
                    <div className="form-group">
                        <label htmlFor="preferredDelivery">Preferred Delivery Method</label>
                        <select
                            id="preferredDelivery"
                            name="preferredDelivery"
                            value={formData.preferredDelivery}
                            onChange={handleChange}
                        >
                            <option value="home">Home Delivery</option>
                            <option value="pickup">Pickup Point</option>
                            <option value="farm">Farm Pickup</option>
                        </select>
                    </div>
                </section>

                <section className="settings-section">
                    <h3>Notifications</h3>
                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="notifications"
                                checked={formData.notifications}
                                onChange={handleChange}
                            />
                            <span>Enable push notifications</span>
                        </label>
                    </div>
                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="emailUpdates"
                                checked={formData.emailUpdates}
                                onChange={handleChange}
                            />
                            <span>Receive email updates about new produce</span>
                        </label>
                    </div>
                </section>

                <section className="settings-section">
                    <h3>Account Actions</h3>
                    <div className="action-buttons">
                        <button type="button" className="btn-secondary">Change Password</button>
                        <button type="button" className="btn-danger">Delete Account</button>
                    </div>
                </section>

                <div className="form-actions">
                    <button type="submit" className="btn-primary">Save Changes</button>
                    <button type="button" className="btn-secondary">Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default ConsumerSettings;