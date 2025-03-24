export async function fetchPollenData(cityName) {
  const url = `https://fe24-vc-backend-grupp4.onrender.com/api/pollen/${encodeURIComponent(
    cityName
  )}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch pollen data", error);
    throw error; // Re-throw the error to handle it elsewhere
  }
}

// weatherData

export async function weatherFetchCurrent(city) {
  const API_KEY = "2a51ff00bfeed2436069b3aa319e2bb3";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export async function weatherFetchForecast(city) {
  const API_KEY = "2a51ff00bfeed2436069b3aa319e2bb3";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// get City name from coordinates
export async function getCityName(lat, lon) {
  const API_KEY = "2a51ff00bfeed2436069b3aa319e2bb3";
  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export async function airQualityFetch(lat, lon) {
  const API_KEY = "2a51ff00bfeed2436069b3aa319e2bb3";
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// export async function weatherFetchForecast(city) {
//   const API_KEY = "5204ed86ca397d06531ddbd2efefb7b8";
//   const url = ` api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=7&units=metric&appid=${API_KEY}`;
//   const response = await fetch(url);
//   const data = await response.json();
//   return data;
// }