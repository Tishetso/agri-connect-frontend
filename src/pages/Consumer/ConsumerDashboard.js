import React, { useEffect, useState } from 'react';
import ProduceCard from '../../components/ProduceCard';
import OrderStatusCard from '../../components/OrderStatusCard';
import GardenPlannerWidget from '../../components/GardenPlannerWidget';
import CommunityPost from '../../components/CommunityPost';
import './ConsumerDashboard.css';

function ConsumerDashboard() {
    //Get user data from localstorage
    const user = JSON.parse(localStorage.getItem('user')) || {name: 'Consumer'};

    //Extract firstname
    const firstName = user.name.split(' ')[0];

    const [region, setRegion] = useState("Detecting location...");
    const [weatherTip, setWeatherTip] = useState("Loading weather...");

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        console.log(token);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    // Reverse geocode using OpenWeather
                    const geoRes = await fetch(
                        `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${process.env.REACT_APP_WEATHER_KEY}`
                    );
                    const geoData = await geoRes.json();
                    const locationName =
                        geoData[0]?.local_names?.en ||
                        geoData[0]?.name ||
                        geoData[0]?.state ||
                        "Unknown region";
                    setRegion(locationName);

                    // Fetch weather forecast
                    const weatherRes = await fetch(
                        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric`
                    );

                    if (!weatherRes.ok) {
                        throw new Error(`OpenWeather error: ${weatherRes.status}`);
                    }

                    const weatherData = await weatherRes.json();

                    // Check weather and provide gardening tips
                    const rainForecast = weatherData.list.find(item =>
                        item.weather.some(w => w.main.toLowerCase().includes("rain"))
                    );

                    if (rainForecast) {
                        setWeatherTip("🌧️ Rain expected soon - Great time to plant moisture-loving crops!");
                    } else {
                        setWeatherTip("☀️ Mild conditions - Great week to plant spinach");
                    }
                } catch (err) {
                    console.error("Weather fetch failed:", err);
                    setWeatherTip("☀️ Great week to plant spinach");
                }
            });
        }
    }, []);
    return (
        <>
            {/* TopBar */}
            <header style={{ marginBottom: '20px' }}>
                <h2>Welcome, {firstName} 🛒</h2>
                <p>You're browsing from <strong>{region}</strong></p>

                <p>🌦️ {weatherTip}</p>
            </header>

            {/* Marketplace */}
            <section>
                <h3>Browse Produce</h3>
                <ProduceCard crop="Tomatoes" quantity="50kg" price="R300" seller="Farmer Thabo" />
                <ProduceCard crop="Pumpkin" quantity="10 units" price="R150" seller="Farmer Naledi" />
            </section>

            {/* Order Tracker */}
            <section>
                <h3>My Orders</h3>
                <OrderStatusCard item="Tomatoes" seller="Farmer Thabo" status="Confirmed" />
                <OrderStatusCard item="Pumpkin" seller="Farmer Naledi" status="Delivered" />
            </section>

            {/* Garden Planner */}
            <section>
                <h3>Garden Planner</h3>
                <GardenPlannerWidget />
            </section>

            {/* Community Feed */}
            <section>
                <h3>Community Feed</h3>
                <CommunityPost author="Gardener Zanele" content="Tips for container gardening?" />
                <CommunityPost author="NGO Ubuntu" content="Looking for surplus produce donations." />
                <button>Join Discussion</button>
            </section>
        </>
    );
}

export default ConsumerDashboard;