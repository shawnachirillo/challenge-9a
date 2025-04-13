// src/main.ts

import './styles/jass.css';

const API_BASE = import.meta.env.VITE_API_BASE;

const fetchWeather = async (cityName: string) => {
  try {
    const response = await fetch(`${API_BASE}/weather/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cityName }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch weather: ${response.statusText}`);
    }

    const weatherData = await response.json();
    console.log('weatherData: ', weatherData);

    renderCurrentWeather(weatherData[0]);
    renderForecast(weatherData.slice(1));
  } catch (error) {
    console.error('Error fetching weather:', error);
  }
};

const fetchSearchHistory = async () => {
  try {
    const response = await fetch(`${API_BASE}/weather/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  } catch (error) {
    console.error('Error fetching search history:', error);
    return [];
  }
};

const deleteCityFromHistory = async (id: string) => {
  try {
    await fetch(`${API_BASE}/weather/history/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error deleting city from history:', error);
  }
};

function renderCurrentWeather(weather: any) {
  const weatherContainer = document.getElementById('current-weather');
  if (!weatherContainer) {
    console.error('No element with id "current-weather" found.');
    return;
  }

  weatherContainer.innerHTML = `
    <h2>Current Weather</h2>
    <p><strong>City:</strong> ${weather.city}</p>
    <p><strong>Date:</strong> ${weather.date}</p>
    <img src="https://openweathermap.org/img/w/${weather.icon}.png" alt="${weather.iconDescription}" />
    <p><strong>Temperature:</strong> ${weather.tempF} °F</p>
    <p><strong>Condition:</strong> ${weather.iconDescription}</p>
    <p><strong>Humidity:</strong> ${weather.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${weather.windSpeed} MPH</p>
  `;
}

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
      <img src="https://openweathermap.org/img/w/${day.icon}.png" alt="${day.iconDescription}" />
      <p><strong>Temperature:</strong> ${day.tempF} °F</p>
      <p><strong>Condition:</strong> ${day.iconDescription}</p>
      <p><strong>Humidity:</strong> ${day.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${day.windSpeed} MPH</p>
    `;
    forecastContainer.appendChild(dayElement);
  });
}

// Optional UI bindings you might need:
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const historyContainer = document.getElementById('history');

searchForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = searchInput.value.trim();
  if (city) {
    await fetchWeather(city);
  }
});

historyContainer?.addEventListener('click', async (e) => {
  const target = e.target as HTMLElement;
  if (target.matches('.delete-city')) {
    const id = target.dataset.id;
    if (id) {
      await deleteCityFromHistory(id);
    }
  }
});

// Initial call to load history
fetchSearchHistory().then((history) => {
  console.log('Search history:', history);
});
