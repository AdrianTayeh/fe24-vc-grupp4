
import { fetchPollenData, getCityName, weatherFetchCurrent,weatherFetchForecast, airQualityFetch } from "./api-fetches.js";



const switchPollenAQ = document.querySelector('.switchPollenAQ input');
let categoryGlob = switchPollenAQ.checked ? 'pollen' : 'air-quality';

switchPollenAQ.addEventListener('change', (event) => {
    categoryGlob = event.target.checked ? 'pollen' : 'air-quality';
    intitializeData()
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
     displayAirQuality(latitude, longitude, cityName[0].name);
console.log(cityName[0].name);
    }
      return cityName;
      });
  }
  intitializeData();



  const searchCityForm = document.querySelector('#cities-form');
  searchCityForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(searchCityForm);
      const searchCityName = formData.get('city-name'); 
  
      console.log(categoryGlob);
      console.log(searchCityName);
  
      if (categoryGlob === 'pollen') {
          displayPollenInfo(searchCityName);
      } else {
          const rawC = await weatherFetchCurrent(searchCityName);
          const coords = rawC.coord;
          const cityName = await getCityName(coords.lat, coords.lon); 
          await displayAirQuality(coords.lat, coords.lon, cityName[0].name);
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


async function displayAirQuality(lat, lon, cityTitle) {
    const pollenInfoDiv = document.querySelector('.pollen-info');
    const pollenDetailsDiv = document.querySelector('#pollen-data-sidebar');
    
    pollenInfoDiv.innerHTML = `<h2>Main pollutants in ${cityTitle}</h2>`;
    pollenDetailsDiv.innerHTML = '<p>Main pollutants</p>';
    
    const AQdata = await airQualityFetch(lat, lon);
    const mainPollutants = AQdata.list[0].components;

    const pollutantFullNames = {
        co: "Carbon Monoxide",
        no: "Nitric Oxide",
        no2: "Nitrogen Dioxide",
        o3: "Ozone",
        so2: "Sulfur Dioxide",
        pm2_5: "Particulate Matter (PM2.5)",
        pm10: "Particulate Matter (PM10)",
        nh3: "Ammonia"
    };

    for (const pollutant of Object.keys(mainPollutants)) {
        const fullName = pollutantFullNames[pollutant] || pollutant.charAt(0).toUpperCase() + pollutant.slice(1);
        const pollutantNameP = document.createElement('p');
        pollutantNameP.classList.add('pollutant-name');
        pollutantNameP.innerHTML = fullName;
        pollenInfoDiv.appendChild(pollutantNameP);
    }

    for (const [pollutant, value] of Object.entries(mainPollutants)) {
        const shortName = pollutant.charAt(0).toUpperCase() + pollutant.slice(1);
        const pollutantP = document.createElement('p');
        pollutantP.classList.add('pollutant');
        pollutantP.innerHTML = `${shortName}: ${value}`;
        pollenDetailsDiv.appendChild(pollutantP);
    }
}



   

