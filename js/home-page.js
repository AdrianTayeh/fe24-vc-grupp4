
// fetch functionality


import { /*fetchPollenData,*/ weatherFetchCurrent, weatherFetchForecast, getCityName } from "./api-fetches.js";



function intitializeWeather(){
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      const cityName = await getCityName(latitude, longitude);
      console.log(cityName[0].name);
      const currentData = await weatherFetchCurrent(cityName[0].name);
      console.log(currentData);
      const forecast = await weatherFetchForecast(cityName[0].name);
      const cityNameIn  = forecast.city.name;
      await displayWeatherData(cityNameIn);
    return cityName;
    });
}

intitializeWeather();

const searchCityForm = document.querySelector('#cities-form');
const todaysForecast = document.querySelector('#todays-forecast');

searchCityForm.addEventListener('submit', async (event) => {
    event.preventDefault();  

    const prevEl = document.querySelector('.forecast-div');
    if (prevEl) {
        prevEl.remove();
    }


    const formData = new FormData(searchCityForm);
    const cityName = formData.get('city-name'); 


    await displayWeatherData(cityName);  
});

async function displayWeatherData(cityName) {
  const todaysPrevDiv = document.querySelector('#todays-forecast');
  todaysPrevDiv.innerHTML = '';
  const sevenDayPrevDiv = document.querySelector('#seven-day-forecast');
  sevenDayPrevDiv.innerHTML = '';
    const currentData = await weatherFetchCurrent(cityName);
    const actualTemp = currentData.main.temp;
    const feelsLike = currentData.main.feels_like;
   

    const forecastDiv = document.createElement('div');
    forecastDiv.classList.add('forecast-div');
    const currentTempDiv = document.createElement('div');
    currentTempDiv.classList.add('temp-div');
    currentTempDiv.innerHTML = `<h1>${cityName}</h1><h2>${actualTemp}°C</h2><p>Feels like: ${feelsLike}°C</p>`;
    todaysForecast.appendChild(currentTempDiv);
    todaysForecast.appendChild(forecastDiv);
    
    const forecast = await weatherFetchForecast(cityName);
    for (let i = 0; i < 6; i++) {
        const forecastTime = forecast.list[i].dt_txt.slice(11, 16); 
        const forecastTemp = forecast.list[i].main.temp;
        const forecastWeatherIcon = forecast.list[i].weather[0].icon;
        const iconURL = `http://openweathermap.org/img/wn/${forecastWeatherIcon}@2x.png`;

        const dayForecast = document.createElement('div');
        dayForecast.classList.add('day-forecast');
        dayForecast.innerHTML = `
            <p>${forecastTime}</p>
            <p>${forecastTemp}°C</p>
        `;
        const icon = document.createElement('img');
        icon.src = iconURL;
        dayForecast.append(icon);
        forecastDiv.append(dayForecast);
    }
    const forecast7Days = await weatherFetchForecast(cityName);
    const forecastList = forecast7Days.list;

    function getDateFromTimestamp(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toISOString().split('T')[0];
    }

    const dailyTemps = {};

    forecastList.forEach(forecast => {
        const date = getDateFromTimestamp(forecast.dt);
        if (!dailyTemps[date]) {
            dailyTemps[date] = { totalTemp: 0, count: 0 };
        }
        
        dailyTemps[date].totalTemp += forecast.main.temp;
        dailyTemps[date].count++;
    });

    const dailyAverages = Object.keys(dailyTemps).map(date => {
        const dailyData = dailyTemps[date];
        const averageTemp = dailyData.totalTemp / dailyData.count;
        return { date, averageTemp };
    });

    const sevenDayForecast = document.querySelector('#seven-day-forecast');
    const forecastDiv7Days = document.createElement('div');
    forecastDiv7Days.classList.add('forecast-div-7-days');
    sevenDayForecast.appendChild(forecastDiv7Days);

    dailyAverages.forEach(day => {
        const weekDayDiv = document.createElement('div');
        weekDayDiv.classList.add('week-day-div');
        const weekdayName = getDayFromDate(day.date);
        
        weekDayDiv.innerHTML = `<p>${weekdayName}</p><p>${day.averageTemp.toFixed(2)}°C</p>`;
        forecastDiv7Days.append(weekDayDiv);
    });

   
}

function getDayFromDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long' }; 
    return date.toLocaleDateString('en-US', options); 
}
