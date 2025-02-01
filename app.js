
/**
 * The API key for accessing the OpenWeatherMap API.
 * @type {string}
 */
const API_KEY = 'fd84cd54d6f04502e4fafe38eb2d9fdc'; 

/**
 * The base URL for the OpenWeatherMap current weather API.
 * @type {string}
 */
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * The base URL for the OpenWeatherMap 5-day forecast API.
 * @type {string}
 */
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

/**
 * The Chart.js instance for displaying the forecast chart.
 * @type {Chart}
 */
let weatherChart = null;

/**
 * Event listener for the search button. Fetches weather data and forecast data for the city input.
 */
document.getElementById('searchBtn').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) return alert('Please enter a city name!');

    getWeatherData(city);
    getForecastData(city);
});

/**
 * Fetches current weather data from OpenWeatherMap API.
 * @async
 * @function getWeatherData
 * @param {string} city - The name of the city to fetch weather data for.
 * @throws {Error} Throws an error if the API request fails.
 */
async function getWeatherData(city) {
    const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    if (!response.ok) return alert('City not found!');

    const data = await response.json();
    displayWeather(data);
}

/**
 * Fetches 5-day forecast data from the OpenWeatherMap API.
 * @async
 * @function getForecastData
 * @param {string} city - The name of the city to fetch forecast data for.
 */
async function getForecastData(city) {
    const response = await fetch(`${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    if (!response.ok) {
        // Display a message for forecast errors
        alert('Forecast data not available for this city.');
        return;
    }

    const data = await response.json();
    displayForecast(data);
}

/**
 * Shows the current weather data on the page.
 * @function displayWeather
 * @param {object} data - The weather data object by the API.
 */
function displayWeather(data) {
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('weatherDescription').textContent = data.weather[0].description;
    document.getElementById('temperature').textContent = Math.round(data.main.temp);
    document.getElementById('humidity').textContent = data.main.humidity;
    document.getElementById('windSpeed').textContent = (data.wind.speed * 3.6).toFixed(1); // m/s to km/h
    document.getElementById('weatherIcon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    document.getElementById('weatherDisplay').classList.remove('hidden');
}

/**
 * Shows the 5-day temperature forecast using Chart.js.
 * @function displayForecast
 * @param {object} data - The forecast data object  by the API.
 */
function displayForecast(data) {
    // Clear the previous chart
    if (weatherChart) {
        weatherChart.destroy();
    }

    const forecastData = data.list.filter((item, index) => index % 8 === 0); // Get 5 days forecast 
    const labels = forecastData.map(item => new Date(item.dt * 1000).toLocaleDateString());
    const temperatures = forecastData.map(item => item.main.temp);

    const ctx = document.getElementById('weatherChart').getContext('2d');
    weatherChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}