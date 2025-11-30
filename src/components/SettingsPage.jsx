import React from "react";

import "../pages/Farmer/SettingsPage.css";

function SettingsPage() {
    return (
        <div className="settings-page">
            <h2>Settings</h2>

            <div className="settings-section">
                <h3>Profile</h3>
                <label>Name</label>
                <input type="text" value="Tishetso Mphelane" readOnly />

                <label>Role</label>
                <input type="text" value="Farmer" readOnly />
            </div>

            <div className="settings-section">
                <h3>Preferences</h3>
                <label>
                    <input type="checkbox" />
                    Receive email notifications
                </label>

                <label>
                    <input type="checkbox" />
                    Receive SMS alerts
                </label>
            </div>

        </div>
    );
}

export default SettingsPage;
