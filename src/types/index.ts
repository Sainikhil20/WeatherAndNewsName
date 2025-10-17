export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
    wind: {
      speed: number;
      deg: number;
    };
  };
  forecast: ForecastDay[];
}

export interface ForecastDay {
  dt: number;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  speed: number;
  deg: number;
  gust: number;
  clouds: number;
  pop: number;
}

export interface NewsArticle {
  source: {
    id: string;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export interface UserPreferences {
  temperatureUnit: 'celsius' | 'fahrenheit';
  newsCategories: NewsCategory[];
  weatherProvider: 'openweathermap' | 'weatherapi';
  apiKeys: {
    openWeatherMap: string;
    weatherApi: string;
    newsApi: string;
  };
}

export type NewsCategory = 
  | 'general'
  | 'business'
  | 'entertainment'
  | 'health'
  | 'science'
  | 'sports'
  | 'technology';

export type WeatherCondition = 'cold' | 'cool' | 'hot' | 'normal';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}