import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAppContext } from '../context/AppContext';
import { NewsCategory } from '../types';

const newsCategories: { label: string; value: NewsCategory }[] = [
  { label: 'General', value: 'general' },
  { label: 'Business', value: 'business' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Health', value: 'health' },
  { label: 'Science', value: 'science' },
  { label: 'Sports', value: 'sports' },
  { label: 'Technology', value: 'technology' },
];

const SettingsScreen: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { preferences } = state;

  const [openWeatherApiKey, setOpenWeatherApiKey] = useState(preferences.apiKeys.openWeatherMap);
  const [newsApiKey, setNewsApiKey] = useState(preferences.apiKeys.newsApi);

  const saveApiKeys = async () => {
    if (!openWeatherApiKey.trim() || !newsApiKey.trim()) {
      Alert.alert('Error', 'Please enter both API keys');
      return;
    }

    // Validate API key format
    const cleanWeatherKey = openWeatherApiKey.trim();
    const cleanNewsKey = newsApiKey.trim();
    
    // OpenWeatherMap API keys are typically 32 character alphanumeric strings
    if (cleanWeatherKey.length !== 32 || !/^[a-f0-9]+$/i.test(cleanWeatherKey)) {
      Alert.alert(
        'Invalid OpenWeatherMap API Key', 
        `Your API key (${cleanWeatherKey.length} characters) doesn't match the expected format. OpenWeatherMap API keys should be 32 character alphanumeric strings.\n\nYour key: ${cleanWeatherKey.substring(0, 8)}...`
      );
      return;
    }

    try {
      const updatedPreferences = {
        ...preferences,
        apiKeys: {
          openWeatherMap: cleanWeatherKey,
          weatherApi: preferences.apiKeys.weatherApi,
          newsApi: cleanNewsKey,
        },
      };

      await AsyncStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
      dispatch({ type: 'UPDATE_PREFERENCES', payload: updatedPreferences });
      
      Alert.alert(
        'Success', 
        'API keys saved successfully!\n\nNote: New OpenWeatherMap API keys can take up to 2 hours to become active. If you get authentication errors, please wait and try again.'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save API keys');
    }
  };

  const toggleTemperatureUnit = async () => {
    const newUnit: 'celsius' | 'fahrenheit' = preferences.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    const updatedPreferences = {
      ...preferences,
      temperatureUnit: newUnit,
    };

    try {
      await AsyncStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
      dispatch({ type: 'UPDATE_PREFERENCES', payload: updatedPreferences });
    } catch (error) {
      Alert.alert('Error', 'Failed to update temperature unit');
    }
  };

  const toggleNewsCategory = async (category: NewsCategory) => {
    const currentCategories = preferences.newsCategories;
    let newCategories: NewsCategory[];

    if (currentCategories.includes(category)) {
      if (currentCategories.length > 1) {
        newCategories = currentCategories.filter(c => c !== category);
      } else {
        Alert.alert('Error', 'At least one news category must be selected');
        return;
      }
    } else {
      newCategories = [...currentCategories, category];
    }

    const updatedPreferences = {
      ...preferences,
      newsCategories: newCategories,
    };

    try {
      await AsyncStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
      dispatch({ type: 'UPDATE_PREFERENCES', payload: updatedPreferences });
    } catch (error) {
      Alert.alert('Error', 'Failed to update news categories');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* API Keys Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>API Keys</Text>
          <Text style={styles.sectionDescription}>
            Enter your API keys to fetch weather and news data
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>OpenWeatherMap API Key</Text>
            <TextInput
              style={styles.textInput}
              value={openWeatherApiKey}
              onChangeText={setOpenWeatherApiKey}
              placeholder="Enter your OpenWeatherMap API key"
              placeholderTextColor="#8E8E93"
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>NewsAPI Key</Text>
            <TextInput
              style={styles.textInput}
              value={newsApiKey}
              onChangeText={setNewsApiKey}
              placeholder="Enter your NewsAPI key"
              placeholderTextColor="#8E8E93"
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={saveApiKeys}>
            <Text style={styles.saveButtonText}>Save API Keys</Text>
          </TouchableOpacity>
        </View>

        {/* Temperature Unit Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Temperature Unit</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>
              Use {preferences.temperatureUnit === 'celsius' ? 'Fahrenheit' : 'Celsius'}
            </Text>
            <Switch
              value={preferences.temperatureUnit === 'fahrenheit'}
              onValueChange={toggleTemperatureUnit}
              trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* News Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>News Categories</Text>
          <Text style={styles.sectionDescription}>
            Select the news categories you're interested in
          </Text>

          {newsCategories.map((category) => (
            <View key={category.value} style={styles.settingRow}>
              <Text style={styles.settingLabel}>{category.label}</Text>
              <Switch
                value={preferences.newsCategories.includes(category.value)}
                onValueChange={() => toggleNewsCategory(category.value)}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>
          ))}
        </View>

        {/* Instructions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to get API Keys</Text>
          <Text style={styles.instructionText}>
            1. <Text style={styles.boldText}>WeatherAPI (Recommended)</Text>: Visit weatherapi.com
          </Text>
          <Text style={styles.instructionText}>
            • Free: 1M calls/month, instant activation
          </Text>
          <Text style={styles.instructionText}>
            • Sign up → Dashboard → Copy API key
          </Text>
          <Text style={styles.instructionText}>
            2. <Text style={styles.boldText}>OpenWeatherMap API</Text>: Visit openweathermap.org/api
          </Text>
          <Text style={styles.instructionText}>
            • Create free account → API Keys section → Copy your key
          </Text>
          <Text style={styles.instructionText}>
            • Key format: 32-character alphanumeric string (like: a1b2c3d4...)
          </Text>
          <Text style={styles.instructionText}>
            • ⚠️ New keys take up to 2 hours to activate
          </Text>
          <Text style={styles.instructionText}>
            3. <Text style={styles.boldText}>NewsAPI</Text>: Visit newsapi.org
          </Text>
          <Text style={styles.instructionText}>
            • Register → Dashboard → Copy API key
          </Text>
          
          {/* Troubleshooting */}
          <Text style={styles.sectionTitle}>Troubleshooting</Text>
          <Text style={styles.instructionText}>
            • <Text style={styles.boldText}>"Invalid API key" error</Text>: Wait 2 hours for activation
          </Text>
          <Text style={styles.instructionText}>
            • <Text style={styles.boldText}>Check key format</Text>: No spaces, 32 characters for weather
          </Text>
          <Text style={styles.instructionText}>
            • <Text style={styles.boldText}>Demo mode</Text>: App works without keys for testing
          </Text>
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
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1D1D1F',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  settingLabel: {
    fontSize: 16,
    color: '#1D1D1F',
    flex: 1,
  },
  instructionText: {
    fontSize: 14,
    color: '#1D1D1F',
    marginBottom: 8,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '600',
    color: '#1D1D1F',
  },
});

export default SettingsScreen;