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