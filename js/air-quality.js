
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
    if(categoryGlob == 'pollen'){
        displayPollenInfo(cityName);
    }
});

async function displayPollenInfo(cName) {
    const pollenInfoDiv = document.querySelector('.pollen-info');
    const pollenDetailsDiv = document.querySelector('.pollen-details');
    const capitalizedName = cName.charAt(0).toUpperCase() + cName.slice(1);
    const pollenData = await fetchPollenData(cName);
    console.log(pollenData.data[0]);
    

    const speciesData = pollenData.data[0].Species;

    if (speciesData) {
        let speciesList = '';
        for (const [category, data] of Object.entries(speciesData)) {
            speciesList += `<h3>${category} Pollen:</h3><ul>`;
            if (typeof data === 'object') {
                for (const [pollenType, percentage] of Object.entries(data)) {
                    speciesList += `<li>${pollenType}: ${percentage}%</li>`;
                }
            } else {

                speciesList += `<li>${category}: ${data}%</li>`;
            }
            speciesList += `</ul>`;
        }
        pollenDetailsDiv.innerHTML = `${speciesList}`;
    }else{
        console.log('No data found')
    }


    const allergens = pollenData.data[0].Risk;

    const allergensList = Object.entries(allergens).map(([allergen, level]) => 
        `<li>${allergen.replace('_', ' ')}: ${level}</li>`
    ).join('');

   
    pollenInfoDiv.innerHTML = `
    <h2>Pollen data for ${capitalizedName}</h2>
    <ul>${allergensList}</ul>`;
}




   

