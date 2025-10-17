import * as Location from 'expo-location';
import { LocationCoords } from '../types';

export class LocationService {
  static async getCurrentLocation(): Promise<LocationCoords> {
    // If running in web browser, try browser geolocation API
    if (typeof window !== 'undefined' && navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          });
        });

        return {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      } catch (error) {
        console.warn('Browser geolocation failed, using demo location:', error);
        // Return demo coordinates (Bangalore, India)
        return {
          latitude: 12.9716,
          longitude: 77.5946,
        };
      }
    }

    try {
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.warn('Location permission denied, using demo location');
        // Return demo coordinates (Bangalore, India)
        return {
          latitude: 12.9716,
          longitude: 77.5946,
        };
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting location:', error);
      console.log('Using demo location coordinates');
      // Return demo coordinates (Bangalore, India)
      return {
        latitude: 12.9716,
        longitude: 77.5946,
      };
    }
  }

  static async reverseGeocode(coords: LocationCoords): Promise<string> {
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        return `${address.city || address.district || address.subregion}, ${address.region || address.country}`;
      }

      return 'Unknown Location';
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return 'Unknown Location';
    }
  }
}