// --- DOM references ---
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const statusMessage = document.getElementById("status-message");
const currentWeatherEl = document.getElementById("current-weather");

const locationNameEl = document.getElementById("location-name");
const locationDateEl = document.getElementById("location-date");
const currentTempEl = document.getElementById("current-temp");
const currentConditionEl = document.getElementById("current-condition");
const feelsLikeEl = document.getElementById("feels-like");
const humidityEl = document.getElementById("humidity");
const windSpeedEl = document.getElementById("wind-speed");

// --- Weather code -> human readable condition (simplified WMO codes) ---
const WEATHER_CODES = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  80: "Rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with heavy hail",
};

function getConditionText(code) {
  return WEATHER_CODES[code] || "Unknown";
}

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
}

// --- Step 1: Convert city name to lat/lon using Open-Meteo Geocoding API ---
async function geocodeCity(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    city
  )}&count=1&language=en&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to look up that city.");
  }

  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error("City not found. Try a different spelling.");
  }

  const { latitude, longitude, name, country } = data.results[0];
  return { latitude, longitude, name, country };
}

// --- Step 2: Fetch current weather for given coordinates ---
async function fetchCurrentWeather(latitude, longitude) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
    `&timezone=auto`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch weather data.");
  }

  const data = await response.json();
  return data.current;
}

// --- Step 3: Render results into the DOM ---
function renderCurrentWeather(location, current) {
  locationNameEl.textContent = `${location.name}, ${location.country}`;
  locationDateEl.textContent = new Date(current.time).toLocaleString(
    undefined,
    {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  currentTempEl.textContent = `${Math.round(current.temperature_2m)}°C`;
  currentConditionEl.textContent = getConditionText(current.weather_code);

  feelsLikeEl.textContent = `${Math.round(current.apparent_temperature)}°C`;
  humidityEl.textContent = `${current.relative_humidity_2m}%`;
  windSpeedEl.textContent = `${current.wind_speed_10m} km/h`;

  currentWeatherEl.classList.remove("hidden");
}

// --- Orchestration ---
async function handleSearch(event) {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;

  currentWeatherEl.classList.add("hidden");
  setStatus("Loading weather...");

  try {
    const location = await geocodeCity(city);
    const current = await fetchCurrentWeather(
      location.latitude,
      location.longitude
    );
    renderCurrentWeather(location, current);
    setStatus("");
  } catch (err) {
    setStatus(err.message || "Something went wrong.", true);
  }
}

searchForm.addEventListener("submit", handleSearch);