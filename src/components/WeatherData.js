import React, { useEffect, useState } from "react";

function WeatherData({ latitude, longitude }) {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Current weather
                const currentRes = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric`
                );
                const currentData = await currentRes.json();

                // 5-day forecast
                const forecastRes = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric`
                );
                const forecastData = await forecastRes.json();

                setWeather({
                    current: currentData,
                    forecast: forecastData.list.slice(0, 5), // show next 5 entries
                });
            } catch (err) {
                setError("Failed to fetch weather data");
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [latitude, longitude]);

    if (loading) return <p>Loading weather...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="weather-data">
            <h3>🌦️ Weather Data</h3>

            {/* Current Weather */}
            <section>
                <h4>Current Conditions</h4>
                <p>Temperature: {weather.current.main.temp}°C</p>
                <p>Feels Like: {weather.current.main.feels_like}°C</p>
                <p>Humidity: {weather.current.main.humidity}%</p>
                <p>Wind Speed: {weather.current.wind.speed} m/s</p>
                <p>Condition: {weather.current.weather[0].description}</p>
            </section>

            {/* Forecast */}
            <section>
                <h4>Forecast</h4>
                <ul>
                    {weather.forecast.map((item, index) => (
                        <li key={index}>
                            {item.dt_txt}: {item.main.temp}°C, {item.weather[0].description}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default WeatherData;
