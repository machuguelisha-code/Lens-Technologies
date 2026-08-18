const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Get free key from openweathermap.org

// Tanzania Regions Data
const TANZANIA_REGIONS = {
    'Dar es Salaam': { lat: -6.8, lon: 39.3, description: 'Largest city & commercial hub' },
    'Arusha': { lat: -3.37, lon: 36.68, description: 'Gateway to Mount Kilimanjaro' },
    'Moshi': { lat: -3.35, lon: 37.67, description: 'Base for Kilimanjaro trekking' },
    'Zanzibar': { lat: -6.16, lon: 39.20, description: 'Island paradise & spice hub' },
    'Dodoma': { lat: -6.17, lon: 35.74, description: 'Political capital' },
    'Mbeya': { lat: -8.90, lon: 33.45, description: 'Southern highlands region' },
    'Iringa': { lat: -8.77, lon: 35.69, description: 'Mountain town in southern highlands' },
    'Kigali': { lat: -1.95, lon: 30.06, description: 'Lake Victoria region' },
    'Mwanza': { lat: -2.52, lon: 32.90, description: 'Lake Victoria port city' },
    'Bukoba': { lat: -1.33, lon: 31.81, description: 'Northwestern region' },
    'Kagera': { lat: -1.50, lon: 31.50, description: 'Northwestern highlands' },
    'Tanga': { lat: -5.07, lon: 39.20, description: 'Northern coastal town' },
    'Musoma': { lat: -2.38, lon: 33.80, description: 'Lake Victoria fishing town' },
    'Singida': { lat: -5.31, lon: 35.01, description: 'Central region livestock hub' }
};

class WeatherDashboard {
    constructor() {
        this.initElements();
        this.attachEventListeners();
        this.initializeUnits();
        this.loadAllTanzaniaWeather();
    }

    initElements() {
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.geoBtn = document.getElementById('geoBtn');
        this.errorMessage = document.getElementById('errorMessage');
        this.weatherContainer = document.getElementById('weatherContainer');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.forecastContainer = document.getElementById('forecastContainer');
        this.tanzaniaCardsContainer = document.getElementById('tanzaniaCards');
        this.tanzaniaListContainer = document.getElementById('tanzaniaList');
        this.toggleButtons = document.querySelectorAll('.toggle-btn');
    }

    attachEventListeners() {
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        this.geoBtn.addEventListener('click', () => this.handleGeoLocation());
        
        // Add toggle button listeners
        this.toggleButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleViewToggle(e.target.dataset.view));
        });
    }

    initializeUnits() {
        this.units = 'metric'; // celsius
    }

    handleSearch() {
        const city = this.cityInput.value.trim();
        if (city) {
            this.fetchWeatherByCity(city);
        } else {
            this.showError('Please enter a city name');
        }
    }

    handleGeoLocation() {
        if (navigator.geolocation) {
            this.showLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.fetchWeatherByCoords(latitude, longitude);
                },
                (error) => {
                    this.showLoading(false);
                    this.showError('Unable to access your location. Please enable location services.');
                }
            );
        } else {
            this.showError('Geolocation is not supported by your browser');
        }
    }

    async fetchWeatherByCity(city) {
        try {
            this.showLoading(true);
            this.clearError();

            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${this.units}&appid=${API_KEY}`
            );

            if (!response.ok) {
                if (response.status === 404) {
                    this.showError('City not found. Please try again.');
                } else {
                    this.showError('Failed to fetch weather data');
                }
                this.showLoading(false);
                return;
            }

            const data = await response.json();
            this.displayWeather(data);
            this.showLoading(false);
        } catch (error) {
            console.error('Error fetching weather:', error);
            this.showError('Error fetching weather data. Please check your API key.');
            this.showLoading(false);
        }
    }

    async fetchWeatherByCoords(lat, lon) {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${this.units}&appid=${API_KEY}`
            );

            if (!response.ok) {
                this.showError('Failed to fetch weather data');
                this.showLoading(false);
                return;
            }

            const data = await response.json();
            this.displayWeather(data);
            this.showLoading(false);
        } catch (error) {
            console.error('Error fetching weather:', error);
            this.showError('Error fetching weather data');
            this.showLoading(false);
        }
    }

    displayWeather(data) {
        const current = data.list[0];
        const forecastDays = this.groupForecastByDay(data.list);

        // Display current weather
        document.getElementById('cityName').textContent = `${data.city.name}, ${data.city.country}`;
        document.getElementById('weatherDate').textContent = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        document.getElementById('temp').textContent = Math.round(current.main.temp);
        document.getElementById('feelsLike').textContent = `${Math.round(current.main.feels_like)}°C`;
        document.getElementById('humidity').textContent = `${current.main.humidity}%`;
        document.getElementById('windSpeed').textContent = `${Math.round(current.wind.speed)} m/s`;
        document.getElementById('pressure').textContent = `${current.main.pressure} hPa`;
        document.getElementById('uvIndex').textContent = '—'; // Not available in free tier
        document.getElementById('visibility').textContent = `${(current.visibility / 1000).toFixed(1)} km`;
        
        document.getElementById('weatherDesc').textContent = current.weather[0].main;
        const iconUrl = `https://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png`;
        document.getElementById('weatherIcon').src = iconUrl;

        // Display 5-day forecast
        this.displayForecast(forecastDays);

        this.weatherContainer.classList.remove('hidden');
    }

    groupForecastByDay(list) {
        const forecastByDay = {};
        
        list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dayKey = date.toLocaleDateString('en-US');
            
            if (!forecastByDay[dayKey]) {
                forecastByDay[dayKey] = [];
            }
            forecastByDay[dayKey].push(item);
        });

        return Object.values(forecastByDay).slice(1, 6); // Get next 5 days
    }

    displayForecast(forecastDays) {
        this.forecastContainer.innerHTML = '';

        forecastDays.forEach(dayData => {
            // Get midday forecast (closest to 12:00)
            const midday = dayData.reduce((prev, curr) => {
                const currHour = new Date(curr.dt * 1000).getHours();
                const prevHour = new Date(prev.dt * 1000).getHours();
                return Math.abs(currHour - 12) < Math.abs(prevHour - 12) ? curr : prev;
            });

            const date = new Date(midday.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            const forecastBox = document.createElement('div');
            forecastBox.className = 'forecast-box';
            forecastBox.innerHTML = `
                <p class="forecast-date">${dayName}</p>
                <p class="forecast-date-small">${monthDay}</p>
                <img src="https://openweathermap.org/img/wn/${midday.weather[0].icon}@2x.png" alt="Weather icon" class="forecast-icon">
                <p class="forecast-desc">${midday.weather[0].main}</p>
                <div class="forecast-temps">
                    <span class="forecast-high">${Math.round(midday.main.temp_max)}°</span>
                    <span class="forecast-low">${Math.round(midday.main.temp_min)}°</span>
                </div>
            `;
            this.forecastContainer.appendChild(forecastBox);
        });
    }

    showLoading(show) {
        if (show) {
            this.loadingSpinner.classList.remove('hidden');
        } else {
            this.loadingSpinner.classList.add('hidden');
        }
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
        this.weatherContainer.classList.add('hidden');
    }

    clearError() {
        this.errorMessage.textContent = '';
        this.errorMessage.style.display = 'none';
    }

    async loadAllTanzaniaWeather() {
        if (!this.tanzaniaCardsContainer) return;
        
        this.showLoading(true);
        this.clearError();

        try {
            const regionNames = Object.keys(TANZANIA_REGIONS);
            const weatherPromises = regionNames.map(region => {
                const { lat, lon } = TANZANIA_REGIONS[region];
                return this.fetchWeatherByCoordsSilent(lat, lon, region);
            });

            const results = await Promise.allSettled(weatherPromises);
            this.displayTanzaniaCardsWeather(results, regionNames);
            this.showLoading(false);
        } catch (error) {
            console.error('Error loading Tanzania weather:', error);
            this.showLoading(false);
        }
    }

    async fetchWeatherByCoordsSilent(lat, lon, region) {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${this.units}&appid=${API_KEY}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const data = await response.json();
            return { region, data, status: 'success' };
        } catch (error) {
            return { region, status: 'error', error };
        }
    }

    displayTanzaniaCardsWeather(results, regionNames) {
        if (!this.tanzaniaCardsContainer) return;
        
        this.tanzaniaCardsContainer.innerHTML = '';

        results.forEach((result, index) => {
            const region = regionNames[index];
            
            if (result.status === 'fulfilled' && result.value.status === 'success') {
                const data = result.value.data;
                this.createTanzaniaWeatherCard(region, data);
            } else {
                this.createTanzaniaErrorCard(region);
            }
        });
    }

    createTanzaniaWeatherCard(region, data) {
        const temp = Math.round(data.main.temp);
        const feelsLike = Math.round(data.main.feels_like);
        const humidity = data.main.humidity;
        const windSpeed = Math.round(data.wind.speed);
        const description = data.weather[0].main;
        const icon = data.weather[0].icon;
        const regionData = TANZANIA_REGIONS[region];

        const card = document.createElement('div');
        card.className = 'tanzania-weather-card';
        card.innerHTML = `
            <div class="card-header">
                <h3>${region}</h3>
                <p class="card-description">${regionData.description}</p>
            </div>
            <div class="card-icon">
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
            </div>
            <div class="card-temp">
                <span class="main-temp">${temp}°C</span>
                <span class="feels-like">Feels like ${feelsLike}°C</span>
            </div>
            <p class="card-description-weather">${description}</p>
            <div class="card-details">
                <div class="detail-item">
                    <span class="detail-label">💧 Humidity</span>
                    <span class="detail-value">${humidity}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">💨 Wind Speed</span>
                    <span class="detail-value">${windSpeed} m/s</span>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            this.fetchWeatherByCoords(data.coord.lat, data.coord.lon);
        });

        this.tanzaniaCardsContainer.appendChild(card);
    }

    createTanzaniaErrorCard(region) {
        const card = document.createElement('div');
        card.className = 'tanzania-weather-card error';
        card.innerHTML = `
            <div class="card-header">
                <h3>${region}</h3>
            </div>
            <div class="card-error">
                <p>Unable to load weather</p>
            </div>
        `;
        this.tanzaniaCardsContainer.appendChild(card);
    }

    initTanzaniaRegions() {
        // Check if Tanzania regions container exists
        const tanzaniaContainer = document.getElementById('tanzaniaRegions');
        if (!tanzaniaContainer) return;

        // Create buttons for Tanzania regions
        Object.keys(TANZANIA_REGIONS).forEach(region => {
            const btn = document.createElement('button');
            btn.className = 'tanzania-btn';
            btn.textContent = region;
            btn.title = TANZANIA_REGIONS[region].description;
            btn.addEventListener('click', () => this.getTanzaniaRegionWeather(region));
            tanzaniaContainer.appendChild(btn);
        });
    }

    getTanzaniaRegionWeather(region) {
        if (TANZANIA_REGIONS[region]) {
            const { lat, lon } = TANZANIA_REGIONS[region];
            this.fetchWeatherByCoords(lat, lon);
            this.cityInput.value = region; // Update input field
        }
    }

    handleViewToggle(view) {
        // Update button states
        this.toggleButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === view) {
                btn.classList.add('active');
            }
        });

        if (view === 'cards') {
            this.tanzaniaCardsContainer.classList.remove('hidden');
            this.tanzaniaListContainer.classList.add('hidden');
        } else if (view === 'list') {
            this.tanzaniaCardsContainer.classList.add('hidden');
            this.tanzaniaListContainer.classList.remove('hidden');
            this.displayTanzaniaList();
        }
    }

    displayTanzaniaList() {
        if (!this.tanzaniaListContainer) return;

        this.tanzaniaListContainer.innerHTML = '';

        const ul = document.createElement('ul');
        ul.className = 'tanzania-list';

        Object.keys(TANZANIA_REGIONS).forEach(region => {
            const li = document.createElement('li');
            li.className = 'tanzania-list-item';
            
            const regionData = TANZANIA_REGIONS[region];
            const button = document.createElement('button');
            button.className = 'region-list-btn';
            button.innerHTML = `
                <span class="region-name">${region}</span>
                <span class="region-desc">${regionData.description}</span>
            `;
            
            button.addEventListener('click', () => {
                this.getTanzaniaRegionWeather(region);
            });

            li.appendChild(button);
            ul.appendChild(li);
        });

        this.tanzaniaListContainer.appendChild(ul);
    }


// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new WeatherDashboard();
});
