import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider } from './src/context/AppContext';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: '#007AFF',
              tabBarInactiveTintColor: '#8E8E93',
              headerStyle: {
                backgroundColor: '#F8F9FA',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Tab.Screen 
              name="Home" 
              component={HomeScreen}
              options={{
                title: 'Weather & News',
                tabBarLabel: 'Home',
              }}
            />
            <Tab.Screen 
              name="Settings" 
              component={SettingsScreen}
              options={{
                title: 'Settings',
                tabBarLabel: 'Settings',
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </AppProvider>
    </SafeAreaProvider>
  );
}