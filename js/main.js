const toggleSwitch = document.querySelectorAll('.switch input');


function setTheme(theme) {
    console.log(`Theme set to: ${theme}`);
    document.documentElement.setAttribute('data-theme', theme);
    toggleSwitch.forEach(switchEl => {
        switchEl.checked = theme === 'dark';
    })
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

       
import { weatherFetchCurrent } from "./api-fetches.js";

const currentWeather = await weatherFetchCurrent("London");



document.getElementById('hamburger').addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.style.display = 'flex';
    }
});