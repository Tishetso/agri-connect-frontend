import React from 'react';
import ListingCard from '../../components/ListingCard';
import AnalyticsWidget from '../../components/AnalyticsWidget';
import ModerationPanel from '../../components/ModerationPanel';
import LogoutButton from '../../components/LogoutButton';

function AdminDashboard() {
    return (
        <div style={{ padding: '20px' }}>
            <header>
                <h2>Admin Dashboard 🧑‍💼</h2>
                <p>Monitor platform activity, moderate listings, and view impact reports.</p>
                <LogoutButton />
            </header>

            {/* Analytics Section */}
            <section>
                <h3>📊 Usage Analytics</h3>
                <AnalyticsWidget />
            </section>

            {/* Moderation Section */}
            <section>
                <h3>🛠️ Moderation Queue</h3>
                <ModerationPanel />
            </section>

            {/* Listings Overview */}
            <section>
                <h3>📦 Recent Listings</h3>
                <ListingCard crop="Cabbage" quantity="100 heads" price="R500" status="Pending Review" />
                <ListingCard crop="Carrots" quantity="30kg" price="R250" status="Approved" />
            </section>
        </div>
    );
}

export default AdminDashboard;
