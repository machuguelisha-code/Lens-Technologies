# Lens with Weather Dashboard

A combined chat application with an integrated weather dashboard.

## Features

### 💬 Chat Application

- Send and receive messages with contacts
- Import/add contacts
- Attach files (images, videos)
- Persistent message storage

### 🌤️ Weather Dashboard

- Real-time weather information for any city
- 5-day weather forecast
- Current weather conditions (temperature, humidity, wind speed, pressure, etc.)
- Geolocation support (use your current location)
- Beautiful, responsive UI

## Project Structure

```tree
Lens/
├── index.html              # Main HTML file with navigation
├── style.css               # Chat application styles
├── script.js               # Chat application logic
├── navigation.js           # Page navigation logic
├── weather.html            # Weather dashboard HTML
├── weather.css             # Weather dashboard styles
├── weather-app.js          # Weather dashboard logic
├── contacts.json           # Stored contacts
├── messages_*.json         # Chat messages
└── server.py               # Backend server
```

## Setup Instructions

### 1. Get Weather API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your free API key from the dashboard

### 2. Configure Weather Dashboard

1. Open `weather-app.js`
2. Find the line: `const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';`
3. Replace `'YOUR_OPENWEATHERMAP_API_KEY'` with your actual API key

### 3. Run in a Browser

```bash
python server.py
```

### 4. Access the Application

- Open your browser
- Navigate to `http://localhost:5000` (or your configured port)
- Use the navigation buttons to switch between Chat and Weather

## Android and iOS

Lens is packaged with Capacitor and includes native Android (`android/`) and iOS (`ios/`) projects. In the installed mobile app, contacts and messages are stored locally on the device, so chat does not require the Flask server.

The **Import Contacts** button opens the native contact permission flow on Android and iOS. Image and video attachments use the device file picker.

### Prerequisites

- Node.js 20 or newer
- Android Studio for Android builds
- macOS with Xcode and CocoaPods for iOS builds

### Run on Android

```bash
npm install
npm run android
```

Open the project in Android Studio, choose a device or emulator, and run it. To refresh native assets after a web change, run `npm run sync`.

### Run on iOS

```bash
npm install
npm run ios
```

Open the project in Xcode on a Mac, choose an iPhone simulator or connected device, configure signing, and run it. To refresh native assets after a web change, run `npm run sync`.

The mobile projects already include location permission declarations for the weather feature. Add an OpenWeatherMap key in `weather-app.js` before releasing the app.

### Enable online messages

The app can use the included Flask API as a shared online-message service after you deploy it to an HTTPS domain. Set the public URL in `config.js`:

```javascript
chatApiBaseUrl: 'https://api.example.com'
```

The current example API has no user accounts or access control, so do not expose it publicly with real user data. Add authentication and a production database before release.

### Enable Samwel AI

Samwel AI is embedded in the lower-right corner of the app and uses [samwel-ai.lovable.app](https://samwel-ai.lovable.app). The ↗ button opens it full screen. To change its URL, update `config.js`:

```javascript
samwelAppUrl: 'https://samwel-ai.lovable.app'
```

## How to Use

### Chat

1. Click the "💬 Chat" button in the navigation
2. Select a contact from the sidebar
3. Type a message and press Enter or click the send button
4. Use the attachment button to share files

### Weather

1. Click the "🌤️ Weather" button in the navigation
2. Enter a city name and click "Search"
   - OR click "📍 Use My Location" to use your current coordinates
3. View current weather and 5-day forecast
4. Weather data updates for the entered location

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Python (Flask)
- **Weather API**: OpenWeatherMap API
- **Storage**: JSON files

## API Reference

### Weather API Endpoints

- `GET /weather?city={cityname}` - Get weather by city name
- `GET /weather?lat={latitude}&lon={longitude}` - Get weather by coordinates

### Chat API Endpoints

- `GET /contacts` - Get all contacts
- `POST /contacts` - Add new contact
- `GET /messages/{user}` - Get messages for user
- `POST /messages/{user}` - Add new message

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Responsive Design

The dashboard is fully responsive and works on:

- Desktop (1920x1080 and above)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## Notes

- Weather data is from OpenWeatherMap (free tier)
- Free tier provides weather forecast data
- Geolocation requires browser permission
- All chat messages are stored locally
- API key should never be committed to version control

## Future Enhancements

- [ ] Weather alerts and notifications
- [ ] Multiple forecast options (hourly, daily, weekly)
- [ ] Weather history graphs
- [ ] User authentication
- [ ] Cloud storage for contacts and messages
- [ ] Dark mode theme
- [ ] Multi-language support

## License

MIT License - Feel free to use and modify as needed

## Support

For issues or questions:

- Email: [elishamachugu@outlook.com](mailto:elishamachugu@outlook.com)
- GitHub: [Your Repository]

---

Built by Machugu Foundation
