import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherData, NewsArticle, UserPreferences, NewsCategory } from '../types';

interface AppState {
  weather: WeatherData | null;
  news: NewsArticle[];
  filteredNews: NewsArticle[];
  preferences: UserPreferences;
  loading: {
    weather: boolean;
    news: boolean;
  };
  error: {
    weather: string | null;
    news: string | null;
  };
}

type AppAction =
  | { type: 'SET_WEATHER_LOADING'; payload: boolean }
  | { type: 'SET_NEWS_LOADING'; payload: boolean }
  | { type: 'SET_WEATHER_SUCCESS'; payload: WeatherData }
  | { type: 'SET_NEWS_SUCCESS'; payload: NewsArticle[] }
  | { type: 'SET_FILTERED_NEWS'; payload: NewsArticle[] }
  | { type: 'SET_WEATHER_ERROR'; payload: string }
  | { type: 'SET_NEWS_ERROR'; payload: string }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'CLEAR_ERRORS' };

const initialState: AppState = {
  weather: null,
  news: [],
  filteredNews: [],
  preferences: {
    temperatureUnit: 'celsius',
    newsCategories: ['general'],
    weatherProvider: 'weatherapi',
    apiKeys: {
      // Default API keys (can be overridden by the user in Settings)
      // Provided by the developer for demo/live usage
      openWeatherMap: '0e132572c7024c9698a85017251710',
      weatherApi: '0e132572c7024c9698a85017251710',
      newsApi: 'c1fb07340a9b4984939904cd7942c455',
    },
  },
  loading: {
    weather: false,
    news: false,
  },
  error: {
    weather: null,
    news: null,
  },
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_WEATHER_LOADING':
      return {
        ...state,
        loading: { ...state.loading, weather: action.payload },
        error: { ...state.error, weather: null },
      };
    case 'SET_NEWS_LOADING':
      return {
        ...state,
        loading: { ...state.loading, news: action.payload },
        error: { ...state.error, news: null },
      };
    case 'SET_WEATHER_SUCCESS':
      return {
        ...state,
        weather: action.payload,
        loading: { ...state.loading, weather: false },
        error: { ...state.error, weather: null },
      };
    case 'SET_NEWS_SUCCESS':
      return {
        ...state,
        news: action.payload,
        loading: { ...state.loading, news: false },
        error: { ...state.error, news: null },
      };
    case 'SET_FILTERED_NEWS':
      return {
        ...state,
        filteredNews: action.payload,
      };
    case 'SET_WEATHER_ERROR':
      return {
        ...state,
        loading: { ...state.loading, weather: false },
        error: { ...state.error, weather: action.payload },
      };
    case 'SET_NEWS_ERROR':
      return {
        ...state,
        loading: { ...state.loading, news: false },
        error: { ...state.error, news: action.payload },
      };
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: { weather: null, news: null },
      };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load user preferences on app start
  useEffect(() => {
    loadUserPreferences();
  }, []);

  // Save preferences whenever they change
  useEffect(() => {
    saveUserPreferences(state.preferences);
  }, [state.preferences]);

  const loadUserPreferences = async () => {
    try {
      const storedPreferences = await AsyncStorage.getItem('userPreferences');
      if (storedPreferences) {
        const preferences = JSON.parse(storedPreferences);
        dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  const saveUserPreferences = async (preferences: UserPreferences) => {
    try {
      await AsyncStorage.setItem('userPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};