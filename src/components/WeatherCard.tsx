import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { WeatherData } from '../types';
import { formatTemperature, celsiusToFahrenheit, getWeatherIcon } from '../utils/helpers';

const { width: screenWidth } = Dimensions.get('window');

interface WeatherCardProps {
  weather: WeatherData;
  temperatureUnit: 'celsius' | 'fahrenheit';
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, temperatureUnit }) => {
  const temp = temperatureUnit === 'fahrenheit' 
    ? celsiusToFahrenheit(weather.current.temp)
    : weather.current.temp;
    
  const feelsLike = temperatureUnit === 'fahrenheit'
    ? celsiusToFahrenheit(weather.current.feels_like)
    : weather.current.feels_like;

  const tempMin = temperatureUnit === 'fahrenheit'
    ? celsiusToFahrenheit(weather.current.temp_min)
    : weather.current.temp_min;

  const tempMax = temperatureUnit === 'fahrenheit'
    ? celsiusToFahrenheit(weather.current.temp_max)
    : weather.current.temp_max;

  return (
    <View style={styles.container}>
      {/* Current Weather */}
      <View style={styles.currentWeather}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>
            {weather.location.name}, {weather.location.country}
          </Text>
        </View>
        
        <View style={styles.mainWeatherContainer}>
          <View style={styles.temperatureContainer}>
            <Text style={styles.temperature}>
              {formatTemperature(temp, temperatureUnit)}
            </Text>
            <Text style={styles.description}>
              {weather.current.weather[0].description}
            </Text>
          </View>
          
          <Image 
            source={{ uri: getWeatherIcon(weather.current.weather[0].icon) }}
            style={styles.weatherIcon}
          />
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Feels like</Text>
            <Text style={styles.detailValue}>
              {formatTemperature(feelsLike, temperatureUnit)}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Min / Max</Text>
            <Text style={styles.detailValue}>
              {formatTemperature(tempMin, temperatureUnit)} / {formatTemperature(tempMax, temperatureUnit)}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Humidity</Text>
            <Text style={styles.detailValue}>{weather.current.humidity}%</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Wind</Text>
            <Text style={styles.detailValue}>{weather.current.wind.speed} m/s</Text>
          </View>
        </View>
      </View>

      {/* 5-Day Forecast */}
      <View style={styles.forecastContainer}>
        <Text style={styles.forecastTitle}>5-Day Forecast</Text>
        <View style={styles.forecastList}>
          {weather.forecast.slice(0, 5).map((day, index) => {
            const dayTemp = temperatureUnit === 'fahrenheit'
              ? celsiusToFahrenheit(day.temp.day)
              : day.temp.day;
            
            const dayTempMin = temperatureUnit === 'fahrenheit'
              ? celsiusToFahrenheit(day.temp.min)
              : day.temp.min;
              
            const dayTempMax = temperatureUnit === 'fahrenheit'
              ? celsiusToFahrenheit(day.temp.max)
              : day.temp.max;

            const date = new Date(day.dt * 1000);
            const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });

            return (
              <View key={day.dt} style={styles.forecastItem}>
                <Text style={styles.forecastDay}>{dayName}</Text>
                <Image 
                  source={{ uri: getWeatherIcon(day.weather[0].icon) }}
                  style={styles.forecastIcon}
                />
                <Text style={styles.forecastTemp}>
                  {formatTemperature(dayTempMin, temperatureUnit)} - {formatTemperature(dayTempMax, temperatureUnit)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  currentWeather: {
    marginBottom: 24,
  },
  locationContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  mainWeatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  temperatureContainer: {
    flex: 1,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    color: '#8E8E93',
    textTransform: 'capitalize',
  },
  weatherIcon: {
    width: 80,
    height: 80,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  forecastContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 20,
  },
  forecastTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 16,
  },
  forecastList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastItem: {
    alignItems: 'center',
    flex: 1,
  },
  forecastDay: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  forecastIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  forecastTemp: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default WeatherCard;