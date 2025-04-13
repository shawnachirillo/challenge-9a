const API_BASE = import.meta.env.VITE_API_BASE;

const fetchWeather = async (cityName: string) => {
  const response = await fetch(`${API_BASE}/api/weather`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cityName }),
  });

  const weatherData = await response.json();
  renderCurrentWeather(weatherData[0]);
  renderForecast(weatherData.slice(1));
};

const fetchSearchHistory = async () => {
  return await fetch(`${API_BASE}/api/weather/history`, {
    headers: { 'Content-Type': 'application/json' },
  });
};

const deleteCityFromHistory = async (id: string) => {
  await fetch(`${API_BASE}/api/weather/history/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
};
// Removed duplicate function implementation
function renderCurrentWeather(weather: any) {
  const weatherContainer = document.getElementById('current-weather');
  if (!weatherContainer) return;

  weatherContainer.innerHTML = `
    <h2>Current Weather</h2>
    <p><strong>City:</strong> ${weather.city}</p>
    <p><strong>Temperature:</strong> ${weather.temperature}°C</p>
    <p><strong>Condition:</strong> ${weather.condition}</p>
    <p><strong>Humidity:</strong> ${weather.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${weather.windSpeed} km/h</p>
  `;
}
function renderForecast(forecast: any[]) {
  const forecastContainer = document.getElementById('forecast');
  if (!forecastContainer) return;

  forecastContainer.innerHTML = `
    <h2>Weather Forecast</h2>
    <ul>
      ${forecast
        .map(
          (day) => `
        <li>
          <p><strong>Date:</strong> ${day.date}</p>
          <p><strong>Temperature:</strong> ${day.temperature}°C</p>
          <p><strong>Condition:</strong> ${day.condition}</p>
          <p><strong>Humidity:</strong> ${day.humidity}%</p>
          <p><strong>Wind Speed:</strong> ${day.windSpeed} km/h</p>
        </li>
      `
        )
        .join('')}
    </ul>
  `;
}
