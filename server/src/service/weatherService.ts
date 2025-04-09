// server/src/service/weatherService.ts
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// ESM workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env file
dotenv.config({ path: resolve(__dirname, '../../.env') });

interface Coordinates {
  latitude: number;
  longitude: number;
}

class WeatherService {
  city: string;

  constructor() {
    this.city = '';
  }

  private async fetchLocationData(query: string) {
    const geoCodeResponse = await fetch(query);
    const geoCodeData = await geoCodeResponse.json();
    return geoCodeData;
  }

  private destructureLocationData(locationData: any): Coordinates {
    const coordinates = {
      latitude: locationData[0].lat,
      longitude: locationData[0].lon,
    };
    return coordinates;
  }

  private buildGeocodeQuery(): string {
    if (!process.env.API_KEY) {
      console.error('🚫 Missing API_KEY in .env');
      throw new Error('❌ API_KEY missing in .env');
    }
    console.log('🌐 API_KEY from env:', process.env.API_KEY);

    return `http://api.openweathermap.org/geo/1.0/direct?q=${this.city}&limit=1&appid=${process.env.API_KEY}`;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${process.env.API_KEY}&units=imperial`;
  }

  private async fetchAndDestructureLocationData(query: string): Promise<Coordinates> {
    const geoCodeData = await this.fetchLocationData(query);
    const coordinates = this.destructureLocationData(geoCodeData);
    return coordinates;
  }

  private async fetchWeatherData(query: string) {
    const currentWeatherResponse = await fetch(query);
    const currentWeatherData = await currentWeatherResponse.json();
    return currentWeatherData;
  }

  private parseCurrentWeather(currentWeatherData: any) {
    return {
      city: currentWeatherData.name,
      date: new Date(currentWeatherData.dt * 1000).toLocaleDateString(),
      icon: currentWeatherData.weather[0].icon,
      iconDescription: currentWeatherData.weather[0].description,
      tempF: currentWeatherData.main.temp,
      windSpeed: currentWeatherData.wind.speed,
      humidity: currentWeatherData.main.humidity,
    };
  }

  private async buildForecastArray(currentWeather: any, coordinates: Coordinates): Promise<any> {
    const forecastQuery = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${process.env.API_KEY}&units=imperial`;
    const forecastResponse = await fetch(forecastQuery);
    const forecastData = await forecastResponse.json();

    const forecastArray = forecastData.list.map((forecast: any) => {
      return {
        date: new Date(forecast.dt * 1000).toLocaleDateString(),
        icon: forecast.weather[0].icon,
        iconDescription: forecast.weather[0].description,
        tempF: forecast.main.temp,
        windSpeed: forecast.wind.speed,
        humidity: forecast.main.humidity,
      };
    });

    return [
      currentWeather,
      forecastArray[0],
      forecastArray[8],
      forecastArray[16],
      forecastArray[24],
      forecastArray[32],
    ];
  }

  async getWeatherForCity(city: string) {
    console.log('📍 Getting weather for:', city);
    this.city = city;

    const geocodeQuery = this.buildGeocodeQuery();
    const coordinates = await this.fetchAndDestructureLocationData(geocodeQuery);

    const currentWeatherQuery = this.buildWeatherQuery(coordinates);
    const currentWeatherData = await this.fetchWeatherData(currentWeatherQuery);

    const parsedCurentWeather = this.parseCurrentWeather(currentWeatherData);
    const weatherArray = await this.buildForecastArray(parsedCurentWeather, coordinates);
    return weatherArray;
  }
}

export default new WeatherService();