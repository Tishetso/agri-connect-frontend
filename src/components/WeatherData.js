import React, { useEffect, useState } from "react";
import "./WeatherData.css";

function WeatherData({ latitude, longitude }) {
    const [current, setCurrent] = useState(null);
    const [forecast, setForecast] = useState(null);
    /*const [weather, setWeather] = useState(null);*/
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    function getWeatherClass(condition){
        const main = condition.toLowerCase();

        if(main.includes("clear"))return "sun-active";
        if (main.includes("cloud")) return "clouds-active";
        if(main.includes("rain") || main.includes("drizzle")) return "rain-active";
        if (main.includes("thunder")) return "storm-active";
        if (main.includes("snow")) return "snow-active";
        if (main.includes("fog") || main.includes("mist") || main.includes("haze")) return "fog-active";

        return "";//fallback
    }

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
                Object.keys(grouped).slice(1, 6).forEach(day => {
                    const temps = grouped[day].map(i => i.main.temp);
                    const avgTemp = (temps.reduce((a, b) => a+b, 0) / temps.length).toFixed(1);
                    const condition = grouped[day][0].weather[0].description;

                    //Convert date String to day name
                    const dayName = new Date(day).toLocaleDateString("en-US",{weekday:"short"});


                    dailyForecast.push({day,dayName, avgTemp, condition});
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
            <section className={`current-weather weather-card ${getWeatherClass(current.weather[0].main)}`}>
                <div className = "sun"></div>
                <div className = "clouds"></div>
                <div className = "rain"></div>
                <div className = "fog"></div>
                <div className = "snow"></div>
                <div className = "storm"></div>

                <h4>Current Conditions:</h4>

                <div className="weather-top">



                    <img
                        src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`}

                        alt={current.weather[0].description}
                    />
                    <div className = "weather-main">
                        <h2 className = "temp"> {current.main.temp}°C</h2>
                        <p className = "feels">🌡️ Feels Like: {current.main.feels_like}°C</p>
                        <p className = "condition">{current.weather[0].description}</p>
                    </div>
                </div>
                    <p>💧 Humidity: {current.main.humidity}%</p>
                    <p>🌬️ Wind Speed: {current.wind.speed} m/s</p>


            </section>

            {/* Forecast */}
            <section className = "forecast">
             {/*   <h4>📅 5-Day Forecast</h4>*/}

                <ul>
                    {forecast.map((f, idx) => (
                        <li key={idx} className = "forecast-card">
                            <strong>{f.dayName} : {f.day}</strong>:
                            <div className="temp">{f.avgTemp}°C</div>
                            <div className = "condition">{f.condition}</div>

                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default WeatherData;
