import { WeatherData, LocationCoords } from '../types';

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Demo weather data for when API is not available or location access is denied
const DEMO_WEATHER_DATA: WeatherData = {
  location: {
    name: 'Bangalore',
    country: 'IN',
    lat: 12.9716,
    lon: 77.5946,
  },
  current: {
    temp: 26,
    feels_like: 28,
    temp_min: 22,
    temp_max: 30,
    pressure: 1010,
    humidity: 72,
    weather: [{
      main: 'Clouds',
      description: 'partly cloudy',
      icon: '02d'
    }],
    wind: {
      speed: 2.8,
      deg: 180,
    },
  },
  forecast: [
    {
      dt: Date.now() / 1000,
      temp: { day: 26, min: 22, max: 30, night: 24, eve: 28, morn: 23 },
      feels_like: { day: 28, night: 26, eve: 30, morn: 25 },
      pressure: 1010,
      humidity: 72,
      weather: [{ main: 'Clouds', description: 'partly cloudy', icon: '02d' }],
      speed: 2.8,
      deg: 180,
      gust: 0,
      clouds: 40,
      pop: 0.2,
    },
    {
      dt: (Date.now() / 1000) + 86400,
      temp: { day: 28, min: 23, max: 31, night: 25, eve: 29, morn: 24 },
      feels_like: { day: 30, night: 27, eve: 31, morn: 26 },
      pressure: 1008,
      humidity: 68,
      weather: [{ main: 'Rain', description: 'light rain', icon: '10d' }],
      speed: 4.0,
      deg: 220,
      gust: 0,
      clouds: 20,
      pop: 0.2,
    },
    {
      dt: (Date.now() / 1000) + 172800,
      temp: { day: 20, min: 16, max: 24, night: 18, eve: 22, morn: 17 },
      feels_like: { day: 22, night: 20, eve: 24, morn: 19 },
      pressure: 1010,
      humidity: 70,
      weather: [{ main: 'Rain', description: 'light rain', icon: '10d' }],
      speed: 5.5,
      deg: 180,
      gust: 0,
      clouds: 75,
      pop: 0.8,
    },
    {
      dt: (Date.now() / 1000) + 259200,
      temp: { day: 15, min: 12, max: 18, night: 14, eve: 16, morn: 13 },
      feels_like: { day: 17, night: 16, eve: 18, morn: 15 },
      pressure: 1008,
      humidity: 80,
      weather: [{ main: 'Rain', description: 'moderate rain', icon: '10d' }],
      speed: 6.0,
      deg: 160,
      gust: 0,
      clouds: 90,
      pop: 0.9,
    },
    {
      dt: (Date.now() / 1000) + 345600,
      temp: { day: 28, min: 24, max: 32, night: 26, eve: 30, morn: 25 },
      feels_like: { day: 30, night: 28, eve: 32, morn: 27 },
      pressure: 1018,
      humidity: 55,
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
      speed: 2.5,
      deg: 240,
      gust: 0,
      clouds: 5,
      pop: 0.0,
    },
  ],
};

export class WeatherService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getCurrentWeather(coords: LocationCoords): Promise<WeatherData> {
    // Check if we're in a browser environment and API key is not set
    if (typeof window !== 'undefined' && (!this.apiKey || this.apiKey.trim() === '')) {
      console.log('Using demo weather data - API key not set');
      return DEMO_WEATHER_DATA;
    }

    try {
      const currentWeatherResponse = await fetch(
        `${OPENWEATHER_BASE_URL}/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${this.apiKey}&units=metric`
      );

      if (!currentWeatherResponse.ok) {
        if (currentWeatherResponse.status === 401) {
          const errorData = await currentWeatherResponse.json();
          console.error('OpenWeatherMap API Error:', errorData);
          throw new Error(`Invalid OpenWeatherMap API key. ${errorData.message || 'Please check your API key in Settings and ensure it\'s activated (can take up to 2 hours).'}`);
        }
        if (currentWeatherResponse.status === 429) {
          throw new Error('OpenWeatherMap API rate limit exceeded. Please try again later.');
        }
        throw new Error(`Failed to fetch current weather data (Status: ${currentWeatherResponse.status})`);
      }

      const currentWeatherData = await currentWeatherResponse.json();

      const forecastResponse = await fetch(
        `${OPENWEATHER_BASE_URL}/forecast?lat=${coords.latitude}&lon=${coords.longitude}&appid=${this.apiKey}&units=metric`
      );

      if (!forecastResponse.ok) {
        throw new Error('Failed to fetch weather forecast data');
      }

      const forecastData = await forecastResponse.json();

      return this.formatWeatherData(currentWeatherData, forecastData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      
      // If we're in browser and there's a network error, return demo data
      if (typeof window !== 'undefined' && error instanceof TypeError) {
        console.log('Network error detected - using demo weather data');
        return DEMO_WEATHER_DATA;
      }
      
      throw error;
    }
  }

  private formatWeatherData(currentData: any, forecastData: any): WeatherData {
    // Process forecast data to get daily forecasts
    const dailyForecasts = this.processForecastData(forecastData.list);

    return {
      location: {
        name: currentData.name,
        country: currentData.sys.country,
        lat: currentData.coord.lat,
        lon: currentData.coord.lon,
      },
      current: {
        temp: currentData.main.temp,
        feels_like: currentData.main.feels_like,
        temp_min: currentData.main.temp_min,
        temp_max: currentData.main.temp_max,
        pressure: currentData.main.pressure,
        humidity: currentData.main.humidity,
        weather: currentData.weather,
        wind: {
          speed: currentData.wind.speed,
          deg: currentData.wind.deg,
        },
      },
      forecast: dailyForecasts,
    };
  }

  private processForecastData(forecastList: any[]): any[] {
    const dailyData: { [key: string]: any[] } = {};

    // Group forecast data by date
    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyData[date]) {
        dailyData[date] = [];
      }
      dailyData[date].push(item);
    });

    // Process daily data to get daily averages/extremes
    return Object.keys(dailyData).slice(0, 5).map(date => {
      const dayData = dailyData[date];
      const temps = dayData.map(item => item.main.temp);
      const feelsLike = dayData.map(item => item.main.feels_like);

      return {
        dt: dayData[0].dt,
        temp: {
          day: temps.reduce((a, b) => a + b, 0) / temps.length,
          min: Math.min(...temps),
          max: Math.max(...temps),
          night: dayData[dayData.length - 1]?.main.temp || temps[temps.length - 1],
          eve: dayData[Math.floor(dayData.length * 0.75)]?.main.temp || temps[0],
          morn: dayData[0].main.temp,
        },
        feels_like: {
          day: feelsLike.reduce((a, b) => a + b, 0) / feelsLike.length,
          night: dayData[dayData.length - 1]?.main.feels_like || feelsLike[feelsLike.length - 1],
          eve: dayData[Math.floor(dayData.length * 0.75)]?.main.feels_like || feelsLike[0],
          morn: dayData[0].main.feels_like,
        },
        pressure: dayData[0].main.pressure,
        humidity: dayData[0].main.humidity,
        weather: dayData[0].weather,
        speed: dayData[0].wind.speed,
        deg: dayData[0].wind.deg,
        gust: dayData[0].wind.gust || 0,
        clouds: dayData[0].clouds.all,
        pop: Math.max(...dayData.map(item => item.pop || 0)),
      };
    });
  }
}