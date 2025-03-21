
/*export async function fetchPollenData(cityName) {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const targetUrl = `https://api.ambeedata.com/latest/pollen/by-place?place=${cityName}`;
    const url = proxyUrl + targetUrl;
    const apiKey = '94041507041a3150f709836d930fb620c36fb28a54d7d27512007a7ab82bf830'; 
  
    console.log(`Fetching pollen data for city: ${cityName}`);
    console.log(`Request URL: ${url}`);
  
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        "Content-Type": "application/json"
      }
    });
  
    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      throw new Error('Failed to fetch pollen data');
    }
  
    const data = await response.json();
    return data;
  }*/

  


// weatherData

export async function weatherFetchCurrent(city){
    const API_KEY = '2a51ff00bfeed2436069b3aa319e2bb3'
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data; 
}


export async function weatherFetchForecast(city){
    const API_KEY = '2a51ff00bfeed2436069b3aa319e2bb3'
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    const response = await fetch(url);
    const data = await response.json();
    return data; 
}


// weatherMap



export async function mapFetch(long, lat){
    const API_KEY = '2a51ff00bfeed2436069b3aa319e2bb3'
    const url = `https://maps.openweathermap.org/maps/2.0/weather/1h/{op}/1/${lat}/${long}?appid=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return; 
}




  





