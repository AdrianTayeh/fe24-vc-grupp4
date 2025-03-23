// fetch functionality

import {
  /*fetchPollenData,*/ weatherFetchCurrent,
  weatherFetchForecast,
  getCityName,
} from "./api-fetches.js";

const sevenDayForecast = document.querySelector("#seven-day-forecast");


function intitializeWeather() {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    const cityName = await getCityName(latitude, longitude);
    console.log(cityName[0].name);
    const currentData = await weatherFetchCurrent(cityName[0].name);
    console.log(currentData);
    const forecast = await weatherFetchForecast(cityName[0].name);
    const cityNameIn = forecast.city.name;
    await displayWeatherData(cityNameIn);
    return cityName;
  });
}

intitializeWeather();

const searchCityForm = document.querySelector("#cities-form");
const todaysForecast = document.querySelector("#todays-forecast");

searchCityForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const prevEl = document.querySelector(".forecast-div");
  if (prevEl) {
    prevEl.remove();
  }

  const formData = new FormData(searchCityForm);
  const cityName = formData.get("city-name");

  await displayWeatherData(cityName);
});

async function displayWeatherData(cityName) {
  const todaysPrevDiv = document.querySelector("#todays-forecast");
  todaysPrevDiv.innerHTML = "";
  const sevenDayPrevDiv = document.querySelector("#seven-day-forecast");
  sevenDayPrevDiv.innerHTML = "";
  const currentData = await weatherFetchCurrent(cityName);
  const actualTemp = currentData.main.temp;
  const feelsLike = currentData.main.feels_like;

  const forecastDiv = document.createElement("div");
  forecastDiv.classList.add("forecast-div");
  const currentTempDiv = document.createElement("div");
  currentTempDiv.classList.add("temp-div");
  currentTempDiv.innerHTML = `<h1>${cityName}</h1><h2>${actualTemp}°C</h2><p>Feels like: ${feelsLike}°C</p>`;
  todaysForecast.appendChild(currentTempDiv);
  todaysForecast.appendChild(forecastDiv);

  const forecast7Days = await weatherFetchForecast(cityName);
  const forecastList = forecast7Days.list;


  function getDateFromTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toISOString().split("T")[0];
  }

  const dailyTemps = {};

  forecastList.forEach((forecast) => {
    const date = getDateFromTimestamp(forecast.dt);
    if (!dailyTemps[date]) {
      dailyTemps[date] = {
        minTemp: forecast.main.temp_min,
        maxTemp: forecast.main.temp_max,
        icon: forecast.weather[0].icon,
      };
    } else {
      dailyTemps[date].minTemp = Math.min(
        dailyTemps[date].minTemp,
        forecast.main.temp_min
      );
      dailyTemps[date].maxTemp = Math.max(
        dailyTemps[date].maxTemp,
        forecast.main.temp_max
      );
    }
  });

  const dailyForecasts = Object.keys(dailyTemps).map((date) => {
    const dailyData = dailyTemps[date];
    return {date, ...dailyData};
});

const forecastDiv7Days = document.createElement("div");
forecastDiv7Days.classList.add("forecast-div-7-days");
sevenDayForecast.appendChild(forecastDiv7Days);

dailyForecasts.forEach((day, index) => {
    const weekDayDiv = document.createElement("div");
    weekDayDiv.classList.add("week-day-div");

    const minTemp = day.minTemp;
    const maxTemp = day.maxTemp;
    const tempRange = 60;
    const progressStart = Math.max(0, ((minTemp + 20) / tempRange) * 100);
    const progressEnd = Math.min(100, ((maxTemp + 20) / tempRange) * 100);
    const progressWidth = progressEnd - progressStart;

    const weekDayName = index  === 0 ? "Today" : getDayFromDate(day.date);
    console.log(weekDayName);
    const iconURL = `http://openweathermap.org/img/wn/${day.icon}.png`;

    weekDayDiv.innerHTML = `
        <div class="day-name">${weekDayName}</div>
        <img src="${iconURL}" alt="Weather icon" class="weather-icon">
        <div class="temp-range">
            <span class="min-temp">${minTemp.toFixed(1)}°C</span>
            <span> ---</span>
            <span class="max-temp">${maxTemp.toFixed(1)}°C</span>
        </div>
    `;

    forecastDiv7Days.appendChild(weekDayDiv);
});
}

function getDayFromDate(dateString) {
  const date = new Date(dateString);
  const options = { weekday: "short" };
  return date.toLocaleDateString("en-US", options);
}
