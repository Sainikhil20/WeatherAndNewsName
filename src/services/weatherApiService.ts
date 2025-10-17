import { WeatherData, LocationCoords } from '../types';

const WEATHERAPI_BASE_URL = 'https://api.weatherapi.com/v1';

export class WeatherAPIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getCurrentWeather(coords: LocationCoords): Promise<WeatherData> {
    try {
      const response = await fetch(
        `${WEATHERAPI_BASE_URL}/forecast.json?key=${this.apiKey}&q=${coords.latitude},${coords.longitude}&days=5&aqi=no&alerts=no`
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid WeatherAPI key. Please check your API key in Settings.');
        }
        if (response.status === 403) {
          throw new Error('WeatherAPI access denied. Check your subscription plan.');
        }
        throw new Error(`Failed to fetch weather data (Status: ${response.status})`);
      }

      const data = await response.json();
      return this.formatWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data from WeatherAPI:', error);
      throw error;
    }
  }

  private formatWeatherData(data: any): WeatherData {
    const current = data.current;
    const location = data.location;
    const forecast = data.forecast.forecastday;

    return {
      location: {
        name: location.name,
        country: location.country,
        lat: location.lat,
        lon: location.lon,
      },
      current: {
        temp: current.temp_c,
        feels_like: current.feelslike_c,
        temp_min: forecast[0].day.mintemp_c,
        temp_max: forecast[0].day.maxtemp_c,
        pressure: current.pressure_mb,
        humidity: current.humidity,
        weather: [{
          main: current.condition.text,
          description: current.condition.text.toLowerCase(),
          icon: this.mapWeatherIcon(current.condition.code, current.is_day)
        }],
        wind: {
          speed: current.wind_kph / 3.6, // Convert to m/s
          deg: current.wind_degree,
        },
      },
      forecast: forecast.map((day: any) => ({
        dt: new Date(day.date).getTime() / 1000,
        temp: {
          day: day.day.avgtemp_c,
          min: day.day.mintemp_c,
          max: day.day.maxtemp_c,
          night: day.hour[23]?.temp_c || day.day.mintemp_c,
          eve: day.hour[18]?.temp_c || day.day.avgtemp_c,
          morn: day.hour[6]?.temp_c || day.day.mintemp_c,
        },
        feels_like: {
          day: day.day.avgtemp_c,
          night: day.hour[23]?.feelslike_c || day.day.mintemp_c,
          eve: day.hour[18]?.feelslike_c || day.day.avgtemp_c,
          morn: day.hour[6]?.feelslike_c || day.day.mintemp_c,
        },
        pressure: current.pressure_mb,
        humidity: day.day.avghumidity,
        weather: [{
          main: day.day.condition.text,
          description: day.day.condition.text.toLowerCase(),
          icon: this.mapWeatherIcon(day.day.condition.code, 1)
        }],
        speed: day.day.maxwind_kph / 3.6,
        deg: current.wind_degree,
        gust: 0,
        clouds: day.day.avgvis_km < 10 ? 80 : 20,
        pop: day.day.daily_chance_of_rain / 100,
      })),
    };
  }

  private mapWeatherIcon(code: number, isDay: number): string {
    // Map WeatherAPI condition codes to OpenWeatherMap icon format
    const iconMap: { [key: number]: string } = {
      1000: isDay ? '01d' : '01n', // Clear/Sunny
      1003: isDay ? '02d' : '02n', // Partly cloudy
      1006: isDay ? '03d' : '03n', // Cloudy
      1009: isDay ? '04d' : '04n', // Overcast
      1030: '50d', // Mist
      1063: '10d', // Patchy rain possible
      1180: '09d', // Light rain
      1183: '09d', // Light rain
      1186: '10d', // Moderate rain
      1189: '10d', // Moderate rain
      1192: '09d', // Heavy rain
      1195: '09d', // Heavy rain
      1240: '09d', // Light rain shower
      1243: '09d', // Moderate rain shower
      1246: '09d', // Torrential rain shower
    };

    return iconMap[code] || (isDay ? '01d' : '01n');
  }
}