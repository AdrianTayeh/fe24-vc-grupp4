const searchCityForm = document.querySelector('#cities-form');
import { fetchPollenData } from "./api-fetches.js";

searchCityForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const pollenInfoDiv = document.querySelector('.pollen-info');
    const formData = new FormData(searchCityForm);
    const cityName = formData.get('city-name');
    const pollenData = await fetchPollenData(cityName)
    console.log(pollenData);
    //pollenInfoDiv.innerHTML = `
    //<h2>Pollen data for ${cityName}</h2>
    //<p>Main Allergens:</p> `
})