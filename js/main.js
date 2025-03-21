const toggleSwitch = document.querySelector('.switch input');

function setTheme(theme) {
    console.log(`Theme set to: ${theme}`);
    document.documentElement.setAttribute('data-theme', theme);
    toggleSwitch.checked = theme === 'dark';
}

const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = prefersDarkScheme ? 'dark' : 'light';
setTheme(initialTheme);

toggleSwitch.addEventListener('change', event => {
    const theme = event.target.checked ? 'dark' : 'light';
    setTheme(theme);
});





// fetch functionality


import { fetchPollenData, weatherFetch } from "./api-fetches.js";
import { initializeMap } from "./tile-map.js";

// const pRaw = await fetchPollenData('Casablanca');
// const pollenData = pRaw.data[0];
const data = await weatherFetch('Casablanca');
console.log(data);
const long = data.coord.lon;
const lat = data.coord.lat;


const mapId = 'map';
const coordinates = [lat, long];

initializeMap(mapId, coordinates);
