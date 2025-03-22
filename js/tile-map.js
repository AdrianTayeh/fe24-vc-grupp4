import { weatherFetchCurrent } from "./api-fetches.js";

const layer = "temp_new";
const apiKey = "7ff2d54809cb5400fea929d83f975141";
const zoomLevel = 4;

let cityMarkersLayer;

export async function initializeMap(mapId, coordinates) {
  const map = L.map(mapId).setView(coordinates, zoomLevel);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);

  let currentLayer = L.tileLayer(
    `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`,
    {
        attribution:
            '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
        maxZoom: 18,
    }
  ).addTo(map);

  const layerForm = document.querySelector("#layer-form");
    layerForm.addEventListener("change", (event) => {
        const selectedLayer = event.target.value;

        if(currentLayer) {
            map.removeLayer(currentLayer);
        }
        
        currentLayer = L.tileLayer(
        `https://tile.openweathermap.org/map/${selectedLayer}/{z}/{x}/{y}.png?appid=${apiKey}`,
        {
            attribution:
            '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
            maxZoom: 18,
        }
        ).addTo(map);
    });

  L.tileLayer(
    `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${apiKey}`,
    {
      attribution:
        '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
      maxZoom: 18,
    }
  ).addTo(map);

  const citiesCheckbox = document.querySelector("#cities-checkbox");
  citiesCheckbox.addEventListener("change", async (event) => {
    if (event.target.checked) {
      cityMarkersLayer = await addCityMarkers(map);
    } else {
      if (cityMarkersLayer) {
        map.removeLayer(cityMarkersLayer);
      }
    }
  });
}

async function addCityMarkers(map) {
    const bounds = map.getBounds();
    console.log("Bounding Box:", bounds);

    const allCountries = await fetchAllCountries();
    console.log("All Countries:", allCountries);

    const cityMarkers = L.layerGroup();

    for (const country of allCountries) {
        const { capital } = country;

        if (!capital) {
            continue;
        }

        const weatherData = await weatherFetchCurrent(capital);


        if (!weatherData || !weatherData.main || !weatherData.coord) {
            continue;
        }

        const temperature = weatherData.main.temp;
        const roundedTemperature = Math.floor(temperature);

        const backgroundColor = getTemperatureColor(roundedTemperature);

        // Safely access lat and lon from weatherData.coord
        const { lat, lon } = weatherData.coord;

        const customIcon = L.divIcon({
            className: "custom-marker",
            html: `
                <div style="display: flex; align-items: center;">
                    <div style="width: 8px; height: 8px; background-color: black; border-radius: 50%;"></div>
                    <div style="color: white; background-color: black; padding: 2px 5px; border-radius: 3px; font-size: 12px;">
                        ${roundedTemperature}°C
                    </div>
                    <div style="color: white; background-color: ${backgroundColor}; padding: 2px 5px; border-radius: 3px; font-size: 12px; margin-left: 5px;">
                        ${capital}
                    </div>
                </div>
            `,
            iconSize: [100, 20], // Adjust size as needed
        });

        const marker = L.marker([lat, lon], { icon: customIcon });
        marker.bindPopup(`<b>${capital}</b><br><br>${roundedTemperature}°C`);
        cityMarkers.addLayer(marker);
    }

    cityMarkers.addTo(map);
    console.log("City markers added to the map.");

    return cityMarkers;
}
async function fetchAllCountries() {
    const username = "adriantayeh";
    const url = `http://api.geonames.org/countryInfoJSON?username=${username}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.error("Error fetching countries:", response.status, response.statusText);
            return [];
        }

        const data = await response.json();
        return data.geonames || [];
    } catch (error) {
        console.error("Network error while fetching countries:", error);
        return [];
    }
}

function getTemperatureColor(temp) {
    const minTemp = -40;
    const maxTemp = 40;

    const normalizedTemp = (temp - minTemp) / (maxTemp - minTemp);

    const r = Math.min(255, Math.max(0, Math.round(255 * normalizedTemp)));
    const g = Math.min(255, Math.max(0, Math.round(255 * (1 - Math.abs(normalizedTemp - 0.5) * 2))));
    const b = Math.min(255, Math.max(0, Math.round(255 * (1 - normalizedTemp))));
    return `rgb(${r},${g},${b})`;
}

const searchCityForm = document.querySelector('#cities-form');
searchCityForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(searchCityForm);
    const cityName = formData.get('city-name');
    const currentWeather = await weatherFetchCurrent(cityName);
    const { lat, lon } = currentWeather.coord;
    const mapId = "map";
    initializeMap(mapId, [lat, lon]);
});