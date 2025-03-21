
import { fetchPollenData } from "./api-fetches.js";

const categorySelect = document.querySelector('#categorySelect');
let categoryGlob = categorySelect.value;

categorySelect.addEventListener('change', async (event) => {
    categoryGlob = event.target.value;
    //categoryGlob = [];
    //categoryGlob.push(category)
})


const searchCityForm = document.querySelector('#cities-form');
searchCityForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(searchCityForm);
    const cityName = formData.get('city-name');
 console.log(categoryGlob)
    console.log(cityName)
    if(categoryGlob === 'pollen'){
        displayPollenInfo(cityName);
    }
});

async function displayPollenInfo(cName) {
    const pollenInfoDiv = document.querySelector('.pollen-info');
    const pollenData = await fetchPollenData(cName)
    console.log(pollenData);
    pollenInfoDiv.innerHTML = `
    <h2>Pollen data for ${cityName}</h2>
    <p>Main Allergens:</p> `
}



   

