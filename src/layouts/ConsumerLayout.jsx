import React from "react";
import ConsumerSidebar from "../pages/Consumer/ConsumerSidebar";
import "../pages/Consumer/ConsumerDashboard.css"; // Sidebar + main styles imported

function ConsumerLayout({ children }) {
    return (
        <div className="dashboard-container">
            <ConsumerSidebar />

            <main className="main-content">
                {children}
            </main>
        </div>
    );
}

export default ConsumerLayout;