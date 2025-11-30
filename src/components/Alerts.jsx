import React, { useState } from "react";
/*import "./AlertsPage.css";*/
import "../pages/Farmer/Alerts.css";
import { MdNotificationsActive, MdDelete, MdDoneAll } from "react-icons/md";

function AlertsPage() {
    const [alerts, setAlerts] = useState([
        {
            id: 1,
            title: "New Buyer Offer",
            message: "Someone offered R320 for your Spinach listing.",
            time: "10 min ago",
            read: false
        },
        {
            id: 2,
            title: "Listing Approved",
            message: "Your Tomatoes listing is now visible to buyers.",
            time: "1 hr ago",
            read: true
        }
    ]);

    const markAsRead = (id) => {
        setAlerts(alerts.map(a =>
            a.id === id ? { ...a, read: true } : a
        ));
    };

    const markAllAsRead = () => {
        setAlerts(alerts.map(a => ({ ...a, read: true })));
    };

    const deleteAlert = (id) => {
        setAlerts(alerts.filter(a => a.id !== id));
    };

    const clearAll = () => {
        setAlerts([]);
    };

    return (
        <div className="alerts-page">

            <div className="alerts-header">
                <h2>Alerts</h2>
                <div className="alert-actions">
                    <button onClick={markAllAsRead}>
                        <MdDoneAll /> Mark All as Read
                    </button>
                    <button onClick={clearAll}>
                        <MdDelete /> Clear All
                    </button>
                </div>
            </div>

            <div className="alerts-list">
                {alerts.length === 0 ? (
                    <div className="empty-alerts">
                        <MdNotificationsActive size={60} />
                        <p>No alerts yet</p>
                    </div>
                ) : (
                    alerts.map(alert => (
                        <div
                            key={alert.id}
                            className={`alert-card ${alert.read ? "read" : "unread"}`}
                        >
                            <div className="alert-text">
                                <h4>{alert.title}</h4>
                                <p>{alert.message}</p>
                                <small>{alert.time}</small>
                            </div>

                            <div className="alert-buttons">
                                {!alert.read && (
                                    <button onClick={() => markAsRead(alert.id)}>
                                        Mark as read
                                    </button>
                                )}
                                <button onClick={() => deleteAlert(alert.id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}

export default AlertsPage;
