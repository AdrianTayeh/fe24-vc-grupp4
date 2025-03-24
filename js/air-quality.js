
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
        const windData = currentData.wind.speed;
        const forecast = await weatherFetchForecast(cityName[0].name);
        const cityNameIn  = forecast.city.name;
        
if(categoryGlob == 'pollen'){
        displayPollenInfo(cityNameIn);  
     }else{
     displayAirQuality(latitude, longitude, cityName[0].name, windData);
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
          const wind  = rawC.wind.speed;
          await displayAirQuality(coords.lat, coords.lon, cityName[0].name, wind);
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
                    speciesList += `<li class="listItem">${pollenType}: ${percentage}%</li>`;
                }
            } else {

                speciesList += `<li class = "listItem">${category}: ${data}%</li>`;
            }
            speciesList += `</ul>`;
        }
        
        speciesList = `<ul>${speciesList}</ul>`;
        pollenDetailsDiv.innerHTML = `${speciesList}`;
    }else{
        console.log('No data found')
    }


    const allergens = pollenData.data[0].Risk;

    const allergensList = Object.entries(allergens).map(([allergen, level]) => 
        `<li class="listItem">${allergen.replace('_', ' ')}: ${level}</li>`
    ).join('');

   
    pollenInfoDiv.innerHTML = `
    <h2>Pollen data for ${capitalizedName}</h2>
    <ul>${allergensList}</ul>`;
}


async function displayAirQuality(lat, lon, cityTitle, wind) {
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
        statusW.innerHTML = `<p class="fair"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-speedometer" viewBox="0 0 16 16">
  <path d="M8 2a.5.5 0 0 1 .5.5V4a.5.5 0 0 1-1 0V2.5A.5.5 0 0 1 8 2M3.732 3.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707M2 8a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 8m9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5m.754-4.246a.39.39 0 0 0-.527-.02L7.547 7.31A.91.91 0 1 0 8.85 8.569l3.434-4.297a.39.39 0 0 0-.029-.518z"/>
  <path fill-rule="evenodd" d="M6.664 15.889A8 8 0 1 1 9.336.11a8 8 0 0 1-2.672 15.78zm-4.665-4.283A11.95 11.95 0 0 1 8 10c2.186 0 4.236.585 6.001 1.606a7 7 0 1 0-12.002 0"/>
</svg>    Air quality is: Fair</p><p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cloud-fog2" viewBox="0 0 16 16">
  <path d="M8.5 4a4 4 0 0 0-3.8 2.745.5.5 0 1 1-.949-.313 5.002 5.002 0 0 1 9.654.595A3 3 0 0 1 13 13H.5a.5.5 0 0 1 0-1H13a2 2 0 0 0 .001-4h-.026a.5.5 0 0 1-.5-.445A4 4 0 0 0 8.5 4M0 8.5A.5.5 0 0 1 .5 8h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5"/>
</svg>    Windspeed: ${wind}m/s</p>`;              //     <====== eventuellt lite ikoner för dessa
        statusW.style.backgroundColor = '#fcf80061';
    } else if (AQdata.list[0].main.aqi == 3) {
        statusW.innerHTML = `<p class="moderate"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-speedometer" viewBox="0 0 16 16">
  <path d="M8 2a.5.5 0 0 1 .5.5V4a.5.5 0 0 1-1 0V2.5A.5.5 0 0 1 8 2M3.732 3.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707M2 8a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 8m9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5m.754-4.246a.39.39 0 0 0-.527-.02L7.547 7.31A.91.91 0 1 0 8.85 8.569l3.434-4.297a.39.39 0 0 0-.029-.518z"/>
  <path fill-rule="evenodd" d="M6.664 15.889A8 8 0 1 1 9.336.11a8 8 0 0 1-2.672 15.78zm-4.665-4.283A11.95 11.95 0 0 1 8 10c2.186 0 4.236.585 6.001 1.606a7 7 0 1 0-12.002 0"/>
</svg>    Air quality is: Moderate<p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cloud-fog2" viewBox="0 0 16 16">
  <path d="M8.5 4a4 4 0 0 0-3.8 2.745.5.5 0 1 1-.949-.313 5.002 5.002 0 0 1 9.654.595A3 3 0 0 1 13 13H.5a.5.5 0 0 1 0-1H13a2 2 0 0 0 .001-4h-.026a.5.5 0 0 1-.5-.445A4 4 0 0 0 8.5 4M0 8.5A.5.5 0 0 1 .5 8h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5"/>
</svg>     Windspeed: ${wind}m/s</p></p>`;
        statusW.style.backgroundColor = '##ffc700f0';
    }
    else if (AQdata.list[0].main.aqi == 4) {
        statusW.innerHTML = `<p class="poor"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-speedometer" viewBox="0 0 16 16">
  <path d="M8 2a.5.5 0 0 1 .5.5V4a.5.5 0 0 1-1 0V2.5A.5.5 0 0 1 8 2M3.732 3.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707M2 8a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 8m9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5m.754-4.246a.39.39 0 0 0-.527-.02L7.547 7.31A.91.91 0 1 0 8.85 8.569l3.434-4.297a.39.39 0 0 0-.029-.518z"/>
  <path fill-rule="evenodd" d="M6.664 15.889A8 8 0 1 1 9.336.11a8 8 0 0 1-2.672 15.78zm-4.665-4.283A11.95 11.95 0 0 1 8 10c2.186 0 4.236.585 6.001 1.606a7 7 0 1 0-12.002 0"/>
</svg>    Air quality is: Poor<p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cloud-fog2" viewBox="0 0 16 16">
  <path d="M8.5 4a4 4 0 0 0-3.8 2.745.5.5 0 1 1-.949-.313 5.002 5.002 0 0 1 9.654.595A3 3 0 0 1 13 13H.5a.5.5 0 0 1 0-1H13a2 2 0 0 0 .001-4h-.026a.5.5 0 0 1-.5-.445A4 4 0 0 0 8.5 4M0 8.5A.5.5 0 0 1 .5 8h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5"/>
</svg>     Windspeed: ${wind}m/s</p></p>`;
        statusW.style.backgroundColor = '#d100008a';
        statusW.style.color = 'white';
    }
    else if (AQdata.list[0].main.aqi == 5) {
        statusW.innerHTML = `<p class="very-poor"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-speedometer" viewBox="0 0 16 16">
  <path d="M8 2a.5.5 0 0 1 .5.5V4a.5.5 0 0 1-1 0V2.5A.5.5 0 0 1 8 2M3.732 3.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707M2 8a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 8m9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5m.754-4.246a.39.39 0 0 0-.527-.02L7.547 7.31A.91.91 0 1 0 8.85 8.569l3.434-4.297a.39.39 0 0 0-.029-.518z"/>
  <path fill-rule="evenodd" d="M6.664 15.889A8 8 0 1 1 9.336.11a8 8 0 0 1-2.672 15.78zm-4.665-4.283A11.95 11.95 0 0 1 8 10c2.186 0 4.236.585 6.001 1.606a7 7 0 1 0-12.002 0"/>
</svg>    Air quality is: Very Poor<p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cloud-fog2" viewBox="0 0 16 16">
  <path d="M8.5 4a4 4 0 0 0-3.8 2.745.5.5 0 1 1-.949-.313 5.002 5.002 0 0 1 9.654.595A3 3 0 0 1 13 13H.5a.5.5 0 0 1 0-1H13a2 2 0 0 0 .001-4h-.026a.5.5 0 0 1-.5-.445A4 4 0 0 0 8.5 4M0 8.5A.5.5 0 0 1 .5 8h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5"/>
</svg>     Windspeed: ${wind}m/s</p></p>`;
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



   

