
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
    const statusW = document.querySelector('.statusWWidget')
    const pollenInfoDiv = document.querySelector('.pollen-info');
    const pollenDetailsDiv = document.querySelector('#pollen-data-sidebar');
    if(statusW){
        statusW.innerHTML = '';
        statusW.style.backgroundColor = 'transparent';
    }
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
    const statusW = document.querySelector('.statusWWidget')
    const pollenDetailsDiv = document.querySelector('#pollen-data-sidebar');
    pollenDetailsDiv.innerHTML = '<h3>Main pollutants</h3>';
    pollenInfoDiv.innerHTML = `
    <h2>Air Quality data for ${cityTitle}</h2>`;
    const AQdata = await airQualityFetch(lat, lon);
    const mainPollutants = AQdata.list[0].components;
    console.log(AQdata.list[0].main.aqi);
    if (AQdata.list[0].main.aqi == 1) {
        statusW.innerHTML = `<p class="good">Air quality is: Good</p>`;
        statusW.style.backgroundColor = '#05fc0061';
    } else if (AQdata.list[0].main.aqi == 2) {
        statusW.innerHTML = `<p class="fair">Air quality is: Fair</p>`;              //     <====== eventuellt lite ikoner för dessa
        statusW.style.backgroundColor = '#fcf80061';
    } else if (AQdata.list[0].main.aqi == 3) {
        statusW.innerHTML = `<p class="moderate">Air quality is: Moderate</p>`;
        statusW.style.backgroundColor = '#fcb60061';
    }
    else if (AQdata.list[0].main.aqi == 4) {
        statusW.innerHTML = `<p class="poor">Air quality is: Poor</p>`;
        statusW.style.backgroundColor = '#d100008a';
        statusW.style.color = 'white';
    }
    else if (AQdata.list[0].main.aqi == 5) {
        statusW.innerHTML = `<p class="very-poor">Air quality is: Very Poor</p>`;
        statusW.style.backgroundColor = '#d100008a';
        statusW.style.color = 'white';
    } 
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
        pollutantNameP.innerHTML = fullName + ': ' + mainPollutants[pollutant] + ' µg/m³';
        pollenDetailsDiv.appendChild(pollutantNameP);
    }

}



   

