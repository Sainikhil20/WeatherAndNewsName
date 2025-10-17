import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppContext } from '../context/AppContext';
import { WeatherService } from '../services/weatherService';
import { WeatherAPIService } from '../services/weatherApiService';
import { NewsService } from '../services/newsService';
import { LocationService } from '../services/locationService';
import { getWeatherCondition, filterNewsByWeather } from '../utils/helpers';
import WeatherCard from '../components/WeatherCard';
import NewsList from '../components/NewsList';
import LoadingSpinner from '../components/LoadingSpinner';

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { weather, news, filteredNews, preferences, loading, error } = state;

  useEffect(() => {
    loadData();
  }, [preferences.apiKeys]);

  useEffect(() => {
    // Filter news based on weather when weather or news data changes
    if (weather && news.length > 0) {
      const weatherCondition = getWeatherCondition(weather.current.temp);
      const filtered = filterNewsByWeather(news, weatherCondition);
      dispatch({ type: 'SET_FILTERED_NEWS', payload: filtered });
    }
  }, [weather, news]);

  const loadData = async () => {
    const weatherApiKey = preferences.weatherProvider === 'weatherapi' 
      ? preferences.apiKeys.weatherApi 
      : preferences.apiKeys.openWeatherMap;
    
    if (!weatherApiKey) {
      console.log('Weather API key not set - using demo data for web preview');
      // Still load demo data even without API keys
      await Promise.all([loadWeatherData(), loadNewsData()]);
      return;
    }

    try {
      await Promise.all([loadWeatherData(), loadNewsData()]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const loadWeatherData = async () => {
    dispatch({ type: 'SET_WEATHER_LOADING', payload: true });
    
    try {
      const location = await LocationService.getCurrentLocation();
      
      let weatherData;
      if (preferences.weatherProvider === 'weatherapi') {
        const weatherService = new WeatherAPIService(preferences.apiKeys.weatherApi);
        weatherData = await weatherService.getCurrentWeather(location);
      } else {
        const weatherService = new WeatherService(preferences.apiKeys.openWeatherMap);
        weatherData = await weatherService.getCurrentWeather(location);
      }
      
      dispatch({ type: 'SET_WEATHER_SUCCESS', payload: weatherData });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load weather data';
      dispatch({ type: 'SET_WEATHER_ERROR', payload: message });
    }
  };

  const loadNewsData = async () => {
    dispatch({ type: 'SET_NEWS_LOADING', payload: true });
    
    try {
      const newsService = new NewsService(preferences.apiKeys.newsApi);
      const newsData = await newsService.getNewsByCategories(preferences.newsCategories);
      dispatch({ type: 'SET_NEWS_SUCCESS', payload: newsData.articles });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load news data';
      dispatch({ type: 'SET_NEWS_ERROR', payload: message });
    }
  };

  const onRefresh = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
    loadData();
  };

  const isLoading = loading.weather || loading.news;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Weather Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Weather</Text>
          {(!preferences.apiKeys.openWeatherMap || !preferences.apiKeys.newsApi) && (
            <View style={styles.demoNotice}>
              <Text style={styles.demoText}>
                📱 Demo Mode: Set your API keys in Settings for live data
              </Text>
            </View>
          )}
          {loading.weather && <LoadingSpinner />}
          {error.weather && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error.weather}</Text>
            </View>
          )}
          {weather && !loading.weather && (
            <WeatherCard weather={weather} temperatureUnit={preferences.temperatureUnit} />
          )}
        </View>

        {/* News Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {weather ? `News for ${getWeatherCondition(weather.current.temp)} weather` : 'Latest News'}
          </Text>
          {loading.news && <LoadingSpinner />}
          {error.news && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error.news}</Text>
            </View>
          )}
          {!loading.news && (
            <NewsList 
              articles={weather ? filteredNews : news}
              onArticlePress={(url: string) => {
                // Handle article press - could open browser or in-app browser
                console.log('Article pressed:', url);
              }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1D1D1F',
    marginBottom: 12,
    marginTop: 16,
  },
  errorContainer: {
    backgroundColor: '#FFE6E6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
  },
  demoNotice: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  demoText: {
    color: '#1976D2',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default HomeScreen;