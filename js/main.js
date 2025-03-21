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


import { fetchPollenData, weatherFetch, mapFetch } from "./api-fetches.js";

const pRaw = await fetchPollenData('Malmo');
const pollenData = pRaw.data[0];
const data = await weatherFetch('Malmo');
const long = data.coord.lon;
const lat = data.coord.lat;


const map = await mapFetch(long, lat);
console.log(long, lat)
