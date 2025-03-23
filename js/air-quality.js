
import { fetchPollenData } from "./api-fetches.js";
import { getCityName } from "./api-fetches.js";
import { weatherFetchCurrent } from "./api-fetches.js";
import { weatherFetchForecast } from "./api-fetches.js";


const switchPollenAQ = document.querySelector('.switchPollenAQ input');
let categoryGlob = switchPollenAQ.checked ? 'pollen' : 'air-quality';

switchPollenAQ.addEventListener('change', (event) => {
    categoryGlob = event.target.checked ? 'pollen' : 'air-quality';
});


function intitializeData(){
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const cityName = await getCityName(latitude, longitude);
        console.log(cityName[0].name);
        const currentData = await weatherFetchCurrent(cityName[0].name);
        console.log(currentData);
        const forecast = await weatherFetchForecast(cityName[0].name);
        const cityNameIn  = forecast.city.name;
if(categoryGlob == 'pollen'){
        displayPollenInfo(cityNameIn);
      }else{
        displayAirQuality(cityNameIn);
      }
      return cityName;
      });
  }
  intitializeData();



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
    const pollenDetailsDiv = document.querySelector('#pollen-data-sidebar');
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



/*async function displayAirQuality(cName) {
    const pollenInfoDiv = document.querySelector('.pollen-info');
    const pollenDetailsDiv = document.querySelector('#pollen-data-sidebar');
    const capitalizedName = cName.charAt(0).toUpperCase() + cName.slice(1);
    //const pollenData = await fetchPollenData(cName);
  
    

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

   

*/