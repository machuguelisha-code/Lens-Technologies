/* Live weather for Lens Law court stations, via the key-free Open-Meteo API. */

const STATIONS = [
  { name: 'Dar es Salaam', note: 'High Court, Main Registry', lat: -6.792, lon: 39.208 },
  { name: 'Dodoma', note: 'Court of Appeal sittings', lat: -6.163, lon: 35.751 },
  { name: 'Arusha', note: 'High Court sub-registry', lat: -3.387, lon: 36.683 },
  { name: 'Mwanza', note: 'High Court zone', lat: -2.517, lon: 32.9 },
  { name: 'Mbeya', note: 'Legal aid clinic', lat: -8.909, lon: 33.46 },
  { name: 'Zanzibar', note: 'Outreach clinic', lat: -6.165, lon: 39.199 },
  { name: 'Tabora', note: 'Mobile clinic route', lat: -5.017, lon: 32.8 },
  { name: 'Mtwara', note: 'Ward tribunal support', lat: -10.266, lon: 40.183 }
];

const CODES = {
  0: ['Clear sky', '☀️'], 1: ['Mainly clear', '🌤️'], 2: ['Partly cloudy', '⛅'], 3: ['Overcast', '☁️'],
  45: ['Fog', '🌫️'], 48: ['Rime fog', '🌫️'], 51: ['Light drizzle', '🌦️'], 53: ['Drizzle', '🌦️'],
  55: ['Dense drizzle', '🌧️'], 61: ['Light rain', '🌦️'], 63: ['Rain', '🌧️'], 65: ['Heavy rain', '🌧️'],
  71: ['Light snow', '🌨️'], 73: ['Snow', '🌨️'], 75: ['Heavy snow', '❄️'], 80: ['Rain showers', '🌦️'],
  81: ['Showers', '🌧️'], 82: ['Violent showers', '⛈️'], 95: ['Thunderstorm', '⛈️'],
  96: ['Storm with hail', '⛈️'], 99: ['Severe storm', '⛈️']
};

const grid = document.getElementById('wx-grid');
const status = document.getElementById('wx-status');

const describe = (code) => CODES[code] || ['Conditions unavailable', '🌡️'];
const dayName = (iso) => new Date(iso).toLocaleDateString('en-GB', { weekday: 'short' });

function card(station, current, daily) {
  const [label, icon] = describe(current.weather_code);
  const days = (daily.time || []).slice(0, 4).map((t, i) =>
    `<span>${dayName(t)} ${Math.round(daily.temperature_2m_max[i])}&deg;/${Math.round(daily.temperature_2m_min[i])}&deg;</span>`
  ).join('');
  return `
    <article class="wx-card">
      <h3>${station.name}</h3>
      <div class="wx-meta">${station.note}</div>
      <div class="wx-icon">${icon}</div>
      <div class="wx-temp">${Math.round(current.temperature_2m)}&deg;C</div>
      <div class="wx-meta">${label} &middot; humidity ${current.relative_humidity_2m}% &middot; wind ${Math.round(current.wind_speed_10m)} km/h</div>
      <div class="wx-days">${days}</div>
    </article>`;
}

function fallback(station, message) {
  return `
    <article class="wx-card">
      <h3>${station.name}</h3>
      <div class="wx-meta">${station.note}</div>
      <div class="wx-icon">🌡️</div>
      <div class="wx-temp">&mdash;</div>
      <div class="wx-meta">${message}</div>
    </article>`;
}

async function load() {
  const results = await Promise.all(STATIONS.map(async (s) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${s.lat}&longitude=${s.lon}`
      + '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m'
      + '&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Africa%2FDar_es_Salaam';
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return card(s, data.current, data.daily || {});
    } catch (err) {
      return fallback(s, 'Live data unavailable offline');
    }
  }));
  grid.innerHTML = results.join('');
  const live = results.filter((html) => !html.includes('unavailable')).length;
  status.textContent = live
    ? `Live conditions for ${live} station${live === 1 ? '' : 's'}, updated ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Dar_es_Salaam' })} EAT.`
    : 'Live weather could not be reached from this network. Station list shown without readings.';
}

load();
