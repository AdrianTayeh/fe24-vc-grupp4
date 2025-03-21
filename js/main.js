const toggleSwitch = document.querySelector('.switch input');
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    toggleSwitch.checked = theme === 'dark';
}

const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(prefersDarkScheme ? 'dark' : 'light');

toggleSwitch.addEventListener('change', event => {
    const theme = event.target.checked ? 'dark' : 'light';
    console.log(theme);
    setTheme(theme);
});