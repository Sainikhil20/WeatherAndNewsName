import { WeatherData, NewsArticle, WeatherCondition } from '../types';

export const celsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9/5) + 32;
};

export const fahrenheitToCelsius = (fahrenheit: number): number => {
  return (fahrenheit - 32) * 5/9;
};

export const formatTemperature = (temp: number, unit: 'celsius' | 'fahrenheit'): string => {
  const symbol = unit === 'celsius' ? '°C' : '°F';
  return `${Math.round(temp)}${symbol}`;
};

export const getWeatherCondition = (temperature: number): WeatherCondition => {
  if (temperature < 10) return 'cold';
  if (temperature >= 10 && temperature <= 20) return 'cool';
  if (temperature > 30) return 'hot';
  return 'normal';
};

export const filterNewsByWeather = (
  news: NewsArticle[],
  weatherCondition: WeatherCondition
): NewsArticle[] => {
  const keywords = getNewsKeywordsByWeather(weatherCondition);
  
  if (keywords.length === 0) {
    // If no keywords for this weather condition, return all news
    return news;
  }
  
  const filteredNews = news.filter(article => {
    const content = `${article.title} ${article.description}`.toLowerCase();
    return keywords.some(keyword => content.includes(keyword.toLowerCase()));
  });
  
  // If no articles match the weather-based keywords, return all news
  return filteredNews.length > 0 ? filteredNews : news;
};

const getNewsKeywordsByWeather = (condition: WeatherCondition): string[] => {
  switch (condition) {
    case 'cold':
      // Depressing news keywords
      return [
        'crisis', 'tragedy', 'disaster', 'death', 'accident', 'crime',
        'violence', 'war', 'conflict', 'murder', 'crash', 'fire',
        'flood', 'earthquake', 'storm', 'recession', 'unemployment',
        'poverty', 'disease', 'pandemic', 'terror', 'attack'
      ];
    case 'hot':
      // Fear-related news keywords
      return [
        'fear', 'terror', 'threat', 'danger', 'risk', 'warning',
        'alert', 'emergency', 'panic', 'anxiety', 'concern', 'worry',
        'caution', 'hazard', 'outbreak', 'crisis', 'security',
        'investigation', 'suspect', 'criminal', 'fraud', 'scandal'
      ];
    case 'cool':
      // Winning and happiness keywords
      return [
        'win', 'victory', 'success', 'achievement', 'celebration',
        'happy', 'joy', 'triumph', 'breakthrough', 'progress',
        'innovation', 'discovery', 'award', 'prize', 'champion',
        'record', 'milestone', 'accomplishment', 'positive',
        'growth', 'improvement', 'recovery', 'hope', 'solution'
      ];
    case 'normal':
      // Surprised and unexpected news keywords
      return [
        'surprised', 'surprising', 'unexpected', 'shocking', 'amazing',
        'incredible', 'unbelievable', 'astonishing', 'remarkable', 'stunning',
        'extraordinary', 'bizarre', 'strange', 'unusual', 'rare',
        'first time', 'never before', 'unprecedented', 'mystery', 'curious'
      ];
    default:
      return [];
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getWeatherIcon = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};