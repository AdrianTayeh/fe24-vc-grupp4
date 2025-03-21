
export async function fetchPollenData(cityName) {
  const url = `https://fe24-vc-backend-grupp4.onrender.com/api/pollen/${encodeURIComponent(cityName)}`;

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

export async function weatherFetch(city){
    const url = `https://fe24-vc-backend-grupp4.onrender.com/api/weather/${city}`;
    const response = await fetch(url);
    const data = await response.json();
    return data; 
}


// weatherMap





  





