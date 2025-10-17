# Weather and News Aggregator App 🌤️📰

A React Native TypeScript application that intelligently filters news articles based on current weather conditions. The app provides real-time weather information and displays relevant news articles that match the weather mood.

## 📱 Project Screenshots

### Home Screen - Weather & Filtered News
![Home Screen](screenshots/home-screen.png)
*Main screen showing current weather and weather-filtered news articles*

### Settings Screen - API Configuration
![Settings Screen](screenshots/settings-screen.png)
*Settings page for configuring API keys and preferences*

### Weather-Based News Filtering
![News Filtering](screenshots/news-filtering.png)
*Example of news filtering based on weather conditions*

### Mobile Responsive Design
![Mobile View](screenshots/mobile-view.png)
*Responsive design working on mobile devices*

## 🌟 Key Features

### 🌤️ Weather Information
- **Real-time weather data** from WeatherAPI or OpenWeatherMap
- **5-day weather forecast** with detailed information
- **Location-based weather** using GPS or manual city search
- **Multiple temperature units** (Celsius/Fahrenheit)
- **Weather icons and detailed conditions**

### 📰 Intelligent News Filtering
- **Weather-based news categorization**:
  - **Cold weather (< 10°C)**: Depressing/somber news articles
  - **Cool weather (10-20°C)**: Positive/winning news stories
  - **Normal weather (20-30°C)**: Surprising/unexpected news
  - **Hot weather (> 30°C)**: Fear-inducing/intense news articles
- **Real-time news filtering** based on current weather
- **Multiple news categories** support

### ⚙️ Advanced Settings
- **API key management** for weather and news services
- **Weather provider selection** (WeatherAPI/OpenWeatherMap)
- **Temperature unit preferences**
- **News category customization**
- **Persistent settings** with AsyncStorage

### 📱 Cross-Platform Support
- **React Native** for iOS and Android
- **Web support** with React Native Web
- **Responsive design** for all screen sizes
- **Progressive Web App** capabilities

## 🛠️ Technology Stack

- **Frontend**: React Native with TypeScript
- **Navigation**: React Navigation 6
- **State Management**: React Context API with useReducer
- **Storage**: AsyncStorage for persistence
- **APIs**: WeatherAPI, OpenWeatherMap, NewsAPI
- **Styling**: React Native StyleSheet
- **Development**: Expo CLI
- **Build**: Expo Application Services (EAS)

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Git

### 1. Clone the Repository
```bash
git clone <your-github-repo-url>
cd WeatherandNewsApp
```

### 2. Install Dependencies
```bash
# Install Expo CLI globally
npm install -g @expo/cli

# Install project dependencies
npm install

# Fix any dependency issues
npx expo install --fix
```

### 3. Install Web Dependencies
```bash
npx expo install react-native-web@~0.19.6 react-dom@18.2.0 @expo/webpack-config@^19.0.0
```

## 🔑 API Configuration

### WeatherAPI (Recommended)
1. Sign up at [WeatherAPI.com](https://www.weatherapi.com/signup.aspx)
2. Get your free API key (1M calls/month)
3. API key activates instantly

### OpenWeatherMap (Alternative)
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Wait 2-10 hours for activation

### NewsAPI
1. Sign up at [NewsAPI.org](https://newsapi.org/)
2. Get your free API key
3. 1000 requests/day limit

### Test Your API Keys
```bash
# Test WeatherAPI
curl "http://api.weatherapi.com/v1/current.json?key=YOUR_KEY&q=London"

# Test OpenWeatherMap
curl "https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_KEY&units=metric"

# Test NewsAPI
curl "https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_KEY"
```

## 🏃‍♂️ Running the Application

### Development Mode

#### Web Development
```bash
# Start web development server (with PATH setup for macOS)
export PATH="/usr/local/bin:$PATH" && npx expo start --web

# Alternative (if PATH is already configured)
npx expo start --web

# Access at http://localhost:19006
```

#### Mobile Development
```bash
# Start development server (with PATH setup for macOS)
export PATH="/usr/local/bin:$PATH" && npx expo start

# Alternative (if PATH is already configured)
npx expo start

# Options:
# - Scan QR code with Expo Go app
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Press 'w' for web browser
```

#### Development Server Commands
```bash
# Start with tunnel for testing on devices (with PATH setup)
export PATH="/usr/local/bin:$PATH" && npx expo start --tunnel

# Start with specific platform (with PATH setup)
export PATH="/usr/local/bin:$PATH" && npx expo start --ios
export PATH="/usr/local/bin:$PATH" && npx expo start --android
export PATH="/usr/local/bin:$PATH" && npx expo start --web

# Clear cache and restart (with PATH setup)
export PATH="/usr/local/bin:$PATH" && npx expo start --clear
```

## 📱 Building for Production

### Build APK for Android
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure EAS
eas build:configure

# Build APK
eas build --platform android --profile preview

# Build AAB for Play Store
eas build --platform android --profile production
```

### Build for iOS
```bash
# Build for iOS simulator
eas build --platform ios --profile preview

# Build for App Store
eas build --platform ios --profile production
```

### Web Deployment
```bash
# Build web version
npx expo export --platform web

# Deploy to Netlify/Vercel
# Upload the 'dist' folder to your hosting service
```

## 🎯 Project Structure

```
WeatherandNewsApp/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── WeatherCard.tsx
│   │   ├── NewsList.tsx
│   │   └── LoadingSpinner.tsx
│   ├── context/             # State management
│   │   └── AppContext.tsx
│   ├── screens/             # Main app screens
│   │   ├── HomeScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/            # API services
│   │   ├── weatherService.ts
│   │   ├── weatherApiService.ts
│   │   ├── newsService.ts
│   │   └── locationService.ts
│   ├── utils/               # Utility functions
│   │   └── helpers.ts
│   └── types/               # TypeScript definitions
│       └── index.ts
├── assets/                  # Images and icons
├── App.tsx                  # Main app component
├── app.json                 # Expo configuration
├── package.json            # Dependencies
└── README.md               # This file
```

## 🎮 Usage Instructions

### First Launch
1. **Start the app** using one of the run commands above
2. **Allow location access** when prompted (optional)
3. **Go to Settings** to configure API keys
4. **Enter your API keys**:
   - WeatherAPI key (recommended)
   - NewsAPI key (optional)
5. **Select weather provider** (WeatherAPI or OpenWeatherMap)
6. **Save settings** and return to Home

### Using the App
1. **View current weather** with detailed information
2. **Browse filtered news** based on weather conditions
3. **Check 5-day forecast** by scrolling down
4. **Refresh data** by pulling down on the screen
5. **Customize settings** in the Settings tab

### Weather-Based News Categories
- **Cold (< 10°C)**: Depressing, somber news
- **Cool (10-20°C)**: Positive, uplifting news
- **Normal (20-30°C)**: Surprising, unexpected news
- **Hot (> 30°C)**: Fear-inducing, intense news

## 🐛 Troubleshooting

### Common Issues

#### API Key Errors
```bash
# OpenWeatherMap 401 error
# Solution: Wait 2-10 hours for key activation or use WeatherAPI

# WeatherAPI 2006 error
# Solution: Check API key format and account status
```

#### Build Errors
```bash
# Clear Expo cache
npx expo start --clear

# Reset dependencies
rm -rf node_modules package-lock.json
npm install

# Fix dependency conflicts
npx expo install --fix
```

#### Web Build Issues
```bash
# Install web dependencies
npx expo install react-native-web react-dom @expo/webpack-config

# Check favicon exists
ls assets/favicon.png
```

## 📊 Performance Features

- **Caching**: Weather data cached for 5 minutes
- **Lazy Loading**: News articles loaded on demand
- **Error Handling**: Graceful fallbacks to demo data
- **Offline Support**: Basic functionality without internet
- **Responsive Design**: Optimized for all screen sizes

## 🔒 Privacy & Security

- **No data collection**: All data stays on device
- **API keys encrypted**: Stored securely in AsyncStorage
- **Location privacy**: GPS access is optional
- **HTTPS only**: All API calls use secure connections

## 📱 APK Download

### Android APK
Download the latest APK file: [Weather-News-App.apk](releases/Weather-News-App.apk)

### Build Your Own APK
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure build
eas build:configure

# Build APK
eas build --platform android --profile preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review API documentation

## 🎉 Features Demo

### Real-time Weather
- Current conditions with detailed metrics
- 5-day forecast with daily summaries
- Location-based weather updates
- Multiple weather provider support

### Smart News Filtering
- Intelligent content categorization
- Weather-mood matching algorithm
- Real-time filtering updates
- Customizable news sources

### User Experience
- Intuitive navigation with bottom tabs
- Pull-to-refresh functionality
- Loading states and error handling
- Responsive design for all devices

---

**Built with ❤️ using React Native and TypeScript**

*Weather and News Aggregator - Making news relevant to your weather!*