// export async function fetchWeather(city) {
//     const API_KEY = '339a510bc4456709619391fe868af9b1';
//     const response = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
//     );
//     if (!response.ok) {
//       throw new Error('Could not fetch weather data');
//     }
//     const data = await response.json();
//     return data;
//   }

export function fetchWeather(city) {
    const API_KEY = '339a510bc4456709619391fe868af9b1';
    return fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    ).then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
  }