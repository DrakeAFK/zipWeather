const apiKey = 'CANT_TELL_YOU';

// Variables to store map and forecast instances
let weatherMap;

async function getWeather() {
  const zipCode = document.getElementById('zipCode').value;

  if (!zipCode) {
    alert('Please enter a valid zip code.');
    return;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?zip=${zipCode}&appid=${apiKey}&units=metric`;

  try {
    const currentResponse = await fetch(currentWeatherUrl);
    const currentData = await currentResponse.json();

    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.innerHTML = `
      <h2>Current Weather in ${currentData.name}</h2>
      <p>Temperature: ${currentData.main.temp}°C</p>
      <p>Weather: ${currentData.weather[0].description}</p>
    `;

    const forecastInfo = document.getElementById('forecastInfo');
    forecastInfo.innerHTML = '<h2>5-Day Forecast</h2>';

    for (let i = 0; i < forecastData.list.length; i += 8) {
      const forecast = forecastData.list[i];
      const forecastDate = new Date(forecast.dt * 1000);

      forecastInfo.innerHTML += `
        <div class="forecast-item">
          <p>Date: ${forecastDate.toLocaleDateString()}</p>
          <p>Time: ${forecastDate.toLocaleTimeString()}</p>
          <p>Temperature: ${forecast.main.temp}°C</p>
          <p>Weather: ${forecast.weather[0].description}</p>
        </div>
      `;
    }

    // Create or update the weather map
    if (!weatherMap) {
      weatherMap = L.map('weatherMap').setView([currentData.coord.lat, currentData.coord.lon], 10);
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      });
      tileLayer.addTo(weatherMap);
    } else {
      weatherMap.setView([currentData.coord.lat, currentData.coord.lon], 10);
    }

    const marker = L.marker([currentData.coord.lat, currentData.coord.lon]).addTo(weatherMap);
    marker.bindPopup(`<b>${currentData.name}</b><br>${currentData.weather[0].description}<br>Temperature: ${currentData.main.temp}°C`).openPopup();

  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}