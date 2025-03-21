
export async function fetchPollenData(cityName) {
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
  }

  


// weatherData

export async function weatherFetch(city){
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=7ff2d54809cb5400fea929d83f975141`;
    const response = await fetch(url);
    const data = await response.json();
    return data; 
}


// weatherMap



export async function mapFetch(long, lat){
    const url = `https://maps.openweathermap.org/maps/2.0/weather/1h/{op}/1/${lat}/${long}?appid=7ff2d54809cb5400fea929d83f975141`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return; 
}




  





