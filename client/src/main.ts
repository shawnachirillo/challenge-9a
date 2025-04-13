const API_BASE = import.meta.env.VITE_API_BASE;

// ...

const fetchWeather = async (cityName: string) => {
  const response = await fetch(`${API_BASE}/weather/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cityName }),
  });

  const weatherData = await response.json();
  console.log('weatherData: ', weatherData);

  renderCurrentWeather(weatherData[0]);
  renderForecast(weatherData.slice(1));
};

const fetchSearchHistory = async () => {
  const history = await fetch(`${API_BASE}/weather/history`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return history;
};

const deleteCityFromHistory = async (id: string) => {
  await fetch(`${API_BASE}/weather/history/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
// Removed duplicate function definition
function renderCurrentWeather(weather: any) {
  const weatherContainer = document.getElementById('current-weather');
  if (!weatherContainer) {
    console.error('No element with id "current-weather" found.');
    return;
  }

  weatherContainer.innerHTML = `
    <h2>Current Weather</h2>
    <p><strong>City:</strong> ${weather.cityName}</p>
    <p><strong>Temperature:</strong> ${weather.temperature}°C</p>
    <p><strong>Condition:</strong> ${weather.condition}</p>
    <p><strong>Humidity:</strong> ${weather.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${weather.windSpeed} km/h</p>
  `;
}
// Removed duplicate function definition
function renderForecast(forecast: any[]) {
  const forecastContainer = document.getElementById('forecast');
  if (!forecastContainer) {
    console.error('No element with id "forecast" found.');
    return;
  }

  forecastContainer.innerHTML = '<h2>Weather Forecast</h2>';

  forecast.forEach((day) => {
    const dayElement = document.createElement('div');
    dayElement.classList.add('forecast-day');
    dayElement.innerHTML = `
      <p><strong>Date:</strong> ${day.date}</p>
      <p><strong>Temperature:</strong> ${day.temperature}°C</p>
      <p><strong>Condition:</strong> ${day.condition}</p>
      <p><strong>Humidity:</strong> ${day.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${day.windSpeed} km/h</p>
    `;
    forecastContainer.appendChild(dayElement);
  });
}
