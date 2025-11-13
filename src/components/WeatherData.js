import React, { useEffect, useState } from "react";
/*import "./WeatherData.css";*/

function WeatherData({ latitude, longitude }) {
    const [current, setCurrent] = useState(null);
    const [forecast, setForecast] = useState(null);
    /*const [weather, setWeather] = useState(null);*/
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Current weather
                const currentRes = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric`
                );
                if (!currentRes.ok) throw new Error("Failed to fetch current weather");

                const currentData = await currentRes.json();

                // 5-day forecast (3-hour intervals)
                const forecastRes = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric`
                );
                if (!forecastRes.ok) throw new Error("Failed to fetch forecast");
                const forecastData = await forecastRes.json();

                //Group forecast by day (take first 5 days)
                const dailyForecast = [];
                const grouped = {};
                forecastData.list.forEach(item => {
                    const day = item.dt_txt.split(" ")[0];
                    if (!grouped[day]) grouped[day] = [];
                    grouped[day].push(item);
                });
                Object.keys(grouped).slice(0, 5).forEach(day => {
                    const temps = grouped[day].map(i => i.main.temp);
                    const avgTemp = (temps.reduce((a, b) => a+b, 0) / temps.length).toFixed(1);
                    const condition = grouped[day][0].weather[0].description;
                    dailyForecast.push({day, avgTemp, condition});
                });

                setCurrent(currentData);
                setForecast(dailyForecast);


             /*   setWeather({
                    current: currentData,
                    forecast: forecastData.list.slice(0, 5), // show next 5 entries
                });*/
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [latitude, longitude]);

    if (loading) return <p>⏳ Loading weather...</p>;
    if (error) return <p>❌{error}</p>;

    return (
        <div className="weather-data">
            <h3>🌦️ Weather Data</h3>

            {/* Current Weather */}
            <section className="current-weather">
                <h4>Current Conditions:</h4>

                <p>🌡️ Temperature: {current.main.temp}°C</p>
                <p>🌡️ Feels Like: {current.main.feels_like}°C</p>
                <p>💧 Humidity: {current.main.humidity}%</p>
                <p>🌬️ Wind Speed: {current.wind.speed} m/s</p>
                <p>☁️Condition: {current.weather[0].description}</p>
                <img
                    src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`}

                    alt={current.weather[0].description}
                />
            </section>

            {/* Forecast */}
            <section className = "forecast">
             {/*   <h4>📅 5-Day Forecast</h4>*/}

                <ul>
                    {forecast.map((f, idx) => (
                        <li key={idx} className = "forecast-card">
                            <strong>{f.day}</strong>: {f.avgTemp}°C, {f.condition}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default WeatherData;
