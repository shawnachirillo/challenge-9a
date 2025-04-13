import './styles/jass.css';

const API_BASE = import.meta.env.VITE_API_BASE;

const fetchWeather = async (cityName: string) => {
  const response = await fetch(`${API_BASE}/weather/`, {
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
  const response = await fetch(`${API_BASE}/weather/history`);
  return response.json();
};

const deleteCityFromHistory = async (id: string) => {
  await fetch(`${API_BASE}/weather/history/${id}`, {
    method: 'DELETE',
  });
};

function renderCurrentWeather(weather: any) {
  const weatherContainer = document.getElementById('current-weather');
  if (!weatherContainer) return;

  weatherContainer.innerHTML = `
    <h2>Current Weather</h2>
    <p><strong>City:</strong> ${weather.city}</p>
    <p><strong>Date:</strong> ${weather.date}</p>
    <p><strong>Temperature:</strong> ${weather.tempF}°F</p>
    <p><strong>Condition:</strong> ${weather.iconDescription}</p>
    <img src="https://openweathermap.org/img/w/${weather.icon}.png" alt="${weather.iconDescription}">
    <p><strong>Humidity:</strong> ${weather.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${weather.windSpeed} MPH</p>
  `;
}

function renderForecast(forecast: any[]) {
  const forecastContainer = document.getElementById('forecast');
  if (!forecastContainer) return;

  forecastContainer.innerHTML = '<h2>5-Day Forecast</h2>';

  forecast.forEach(day => {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'forecast-day';
    dayDiv.innerHTML = `
      <p><strong>Date:</strong> ${day.date}</p>
      <img src="https://openweathermap.org/img/w/${day.icon}.png" alt="${day.iconDescription}">
      <p>${day.iconDescription}</p>
      <p>Temp: ${day.tempF}°F</p>
      <p>Humidity: ${day.humidity}%</p>
      <p>Wind: ${day.windSpeed} MPH</p>
    `;
    forecastContainer.appendChild(dayDiv);
  });
}
