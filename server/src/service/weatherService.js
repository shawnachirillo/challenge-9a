import dotenv from 'dotenv';
import fetch from 'node-fetch'; // ✅ Fix 1
dotenv.config();
class WeatherService {
    constructor() {
        this.city = '';
    }
    async fetchLocationData(query) {
        const res = await fetch(query);
        if (!res.ok)
            throw new Error(`Failed to fetch geocode: ${res.statusText}`);
        return res.json();
    }
    destructureLocationData(data) {
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Geocode response is empty or invalid');
        }
        return {
            latitude: data[0].lat,
            longitude: data[0].lon,
        };
    }
    buildGeocodeQuery() {
        const key = process.env.API_KEY;
        if (!key)
            throw new Error('❌ API_KEY missing in .env');
        return `http://api.openweathermap.org/geo/1.0/direct?q=${this.city}&limit=1&appid=${key}`;
    }
    buildWeatherQuery(coords) {
        return `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${process.env.API_KEY}&units=imperial`;
    }
    async fetchWeatherData(query) {
        const res = await fetch(query);
        if (!res.ok)
            throw new Error(`Failed to fetch weather: ${res.statusText}`);
        return res.json();
    }
    parseCurrentWeather(data) {
        return {
            city: data.name,
            date: new Date(data.dt * 1000).toLocaleDateString(),
            icon: data.weather[0].icon,
            iconDescription: data.weather[0].description,
            tempF: data.main.temp,
            windSpeed: data.wind.speed,
            humidity: data.main.humidity,
        };
    }
    async buildForecastArray(currentWeather, coords) {
        const forecastQuery = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.latitude}&lon=${coords.longitude}&appid=${process.env.API_KEY}&units=imperial`;
        const res = await fetch(forecastQuery);
        const data = await res.json();
        const forecast = data.list.map((f) => ({
            date: new Date(f.dt * 1000).toLocaleDateString(),
            icon: f.weather[0].icon,
            iconDescription: f.weather[0].description,
            tempF: f.main.temp,
            windSpeed: f.wind.speed,
            humidity: f.main.humidity,
        }));
        return [
            currentWeather,
            forecast[0],
            forecast[8],
            forecast[16],
            forecast[24],
            forecast[32],
        ];
    }
    async getWeatherForCity(city) {
        this.city = city;
        console.log(`📍 Getting weather for: ${city}`);
        const geoQuery = this.buildGeocodeQuery();
        const coords = this.destructureLocationData(await this.fetchLocationData(geoQuery));
        const weatherQuery = this.buildWeatherQuery(coords);
        const currentData = await this.fetchWeatherData(weatherQuery);
        const current = this.parseCurrentWeather(currentData);
        const forecast = await this.buildForecastArray(current, coords);
        return forecast;
    }
}
export default new WeatherService();
