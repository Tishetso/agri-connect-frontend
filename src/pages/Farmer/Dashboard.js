import React, {useEffect, useState} from 'react';
import AlertCard from '../../components/AlertCard';
import ListingCard from '../../components/ListingCard';
import ChatbotWidget from '../../components/ChatbotWidget';
import OrderStatusCard from '../../components/OrderStatusCard';
import CommunityPost from '../../components/CommunityPost';
import './FarmerDashboard.css';
import WeatherData from "../../components/WeatherData";
import Sidebar from "../../components/Sidebar";

function FarmerDashboard() {

    const user = JSON.parse(localStorage.getItem('user'));
    const [region, setRegion] = useState("Detecting location...");
    const [weatherAlert, setWeatherAlert] = useState("Loading weather...")

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    //Reverse geocode using OpenWeather (no CORS issues)
                    const geoRes = await fetch(
                        `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${process.env.REACT_APP_WEATHER_KEY}`
                    );
                    const geoData = await geoRes.json();
                    const locationName =
                        geoData[0]?.local_names?.en ||   // suburb/town name if available
                        geoData[0]?.name ||              // fallback to municipality
                        geoData[0]?.state ||             // fallback to province
                        "an Unknown region";
                    setRegion(locationName)
                    /*setRegion(geoData[0]?.name || "Unknown region");*/

                    // Fetch 5-day forecast from OpenWeather
                    const weatherRes = await fetch(
                        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric`
                    );
                    //log raw response status
                    console.log("Weather API status:", weatherRes.status);

                    if (!weatherRes.ok){
                        throw new Error(`OpenWeather error: ${weatherRes.status}`);
                    }

                    const weatherData = await weatherRes.json();

                    //log the entire JSON response
                    console.log("Weather API data:", weatherData);

                    // Example: check if rain is expected in next 2 days
                    const rainForecast = weatherData.list.find(item =>
                        item.weather.some(w => w.main.toLowerCase().includes("rain"))
                    );

                    if (rainForecast) {
                        setWeatherAlert("🌧️ Rain expected in 2 days");
                    } else {
                        setWeatherAlert("☀️ No rain expected soon");
                    }
                } catch (err) {
                    console.error("Weather fetch failed:", err);
                    setWeatherAlert("Weather data unavailable");
                }
            });
        }
    }, []);

    return (
        <div className="dashboard-container" style={{ display: 'flex' }}>
            {/* Sidebar component */}
            <Sidebar/>


            {/* Main Panel */}
            <main className="main-content">
                {/* TopBar */}
                <header >
                    <h2>Welcome back,  {user.name} 👋</h2>
                    <p>You’re logged in from <strong>{region}</strong>. Here’s what’s happening in your area today.</p>
                    <p>{weatherAlert} | 🐛 Armyworm risk nearby</p>
                </header>

                {/* Weather Section */}
                <section>
                    <WeatherData latitude={-25.5559} longitude={28.0944} />
                </section>

                {/* AlertsSection */}
                <section>
                    <h3>AgriAlerts</h3>
                    <AlertCard
                        type="Pest"
                        severity="High"
                        message="Armyworm risk in your area"
                        action="Apply organic pesticide within 48 hours"
                    />
                    <AlertCard
                        type="Weather"
                        severity="Medium"
                        message="Rain expected in 2 days"
                        action="Delay irrigation"
                    />
                </section>

                {/* ProduceSummary */}
                <section>
                    <h3>My Produce</h3>
                    <button style={{ marginBottom: '10px' }}>+ New Listing</button>
                    <ListingCard crop="Tomatoes" quantity="50kg" price="R300" status="Available" />
                    <ListingCard crop="Spinach" quantity="20 bunches" price="R100" status="Sold" />
                </section>

                {/* OrderTracker */}
                <section>
                    <h3>Order Tracker</h3>
                    <OrderStatusCard buyer="GreenGrocer SA" item="Tomatoes" status="In Transit" />
                    <OrderStatusCard buyer="Local Market" item="Spinach" status="Delivered" />
                </section>

                {/* ChatbotWidget */}
                <section>
                    <h3>Ask AgriBot</h3>
                    <ChatbotWidget />
                </section>

                {/* CommunityFeed */}
                <section>
                    <h3>Community Feed</h3>
                    <CommunityPost author="Farmer Lerato" content="Best time to plant maize this season?" />
                    <CommunityPost author="Farmer Sipho" content="Looking to swap pumpkin seeds!" />
                    <button>Join Discussion</button>
                </section>
            </main>
        </div>
    );
}

export default FarmerDashboard;
