const toggleSwitch = document.querySelectorAll('.switch input');


function setTheme(theme) {
    console.log(`Theme set to: ${theme}`);
    document.documentElement.setAttribute('data-theme', theme);
    toggleSwitch.checked = theme === 'dark';
}

const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = prefersDarkScheme ? 'dark' : 'light';
setTheme(initialTheme);

toggleSwitch.forEach(switchEl => {
    switchEl.addEventListener('change', event => {
        console.log("clicked");
        const theme = event.target.checked ? 'dark' : 'light';
        setTheme(theme);
    });
});

       




// fetch functionality


import { /*fetchPollenData,*/ weatherFetchCurrent, /*mapFetch,*/ weatherFetchForecast } from "./api-fetches.js";

// const pRaw = await fetchPollenData('Malmo');
// const pollenData = pRaw.data[0];



// const map = await mapFetch(long, lat);



// DOM manipulation





const searchCityForm = document.querySelector('#cities-form');
const todaysForecast = document.querySelector('#todays-forecast');

searchCityForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const prevEl = document.querySelector('.forecast-div');
    if(prevEl){
    prevEl.remove();
    }
    const formData = new FormData(searchCityForm);
    const cityName = formData.get('city-name');
    const currentData = await weatherFetchCurrent(cityName);
   

    // coords
const long = currentData.coord.lon;
const lat = currentData.coord.lat;

// temp
const actualTemp = currentData.main.temp;
const feelsLike = currentData.main.feels_like;

//  forecast data 

const forecast = await weatherFetchForecast(cityName);
const forecastDiv = document.createElement('div');
forecastDiv.classList.add('forecast-div');

for (let i = 0; i < 6; i++) {
    const forecastTime = forecast.list[i].dt_txt.slice(11, 16);
    const forecastTemp = forecast.list[i].main.temp;
    const forecastWeatherIcon = forecast.list[i].weather[0].icon;
    console.log(forecastWeatherIcon)
    const iconURL = `http://openweathermap.org/img/wn/${forecastWeatherIcon}@2x.png`;


    



    console.log(forecastTime, forecastTemp);
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






const currentTempDiv = document.createElement('div');
currentTempDiv.classList.add('temp-div');
currentTempDiv.innerHTML = `<p>Temperature: ${actualTemp}°C</p><p>Feels like: ${feelsLike}°C</p>`;
todaysForecast.appendChild(forecastDiv, currentTempDiv);




})


