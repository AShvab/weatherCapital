import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import { fetchWeather } from './fetchWeather';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(inputCountry, DEBOUNCE_DELAY));

function inputCountry(evt) {
    const countryName = evt.target.value.trim();
    if (countryName === "") {
        clearSearchCountry();
        return;
    }

    
fetchCountries(countryName)
    .then(response => {
        clearSearchCountry();
        if (response.length > 10) {
            return Notify.info(
                'Too many matches found. Please enter a more specific name.'
            );
        }        
        if (response.length === 1) {
            searchOneCountry(response)
        } else {
            searchListCountry(response);
        }
    })
    .catch(error => {
        clearSearchCountry();
        Notify.failure("Oops, there is no country with that name")
        return error;
    });    
    }

function searchListCountry(response) {
    const markup = response
        .map(el => {
            return `<li class="item_country">
            <img class="img" src="${el.flags.svg}" width = 50 height = 33 alt="flag">
            <h3 class="title">${el.name.official}</h3>
            </li>`;
        })
        .join('');
    countryList.innerHTML = markup;
}

    
// function searchOneCountry(response) {
//     const markup = response
//     .map(el => {
//     return `<div class="item_country"><img class="img" src="${
//         el.flags.svg
//     }" width=80 alt="flag">
//     <h1 class ="title">${el.name.official}</h1></div>
//     <p class="text"><span>Capital:</span> ${el.capital}</p>
//     <p class="text"><span>Population:</span> ${el.population}</p>
//     <p class="text"><span>Languages:</span> ${Object.values(el.languages)}</p>
//     <div class="weather">
//       <h2 class="weather-title">Weather in ${el.capital}:</h2>
//       <p class="weather-text">Loading...</p>      
//     </div>`;
//     })
//     .join('');
//     countryInfo.innerHTML = markup;
// }
function searchOneCountry(response) {
    const country = response[0];
    const markup = `<div class="item_country">
      <img class="img" src="${country.flags.svg}" width="150px" alt="flag">
      <h1 class="title">${country.name.official}</h1>
    </div>
    <p class="text"><span>Capital:</span> ${country.capital}</p>
    <p class="text"><span>Population:</span> ${country.population}</p>
    <p class="text"><span>Languages:</span> ${Object.values(
      country.languages
    )}</p>
    <div class="weather">
      <h2 class="weather-title">Weather in ${country.capital}:</h2>
      <div class="weather-data">Loading...</div>
    </div>`;
    countryInfo.innerHTML = markup;
  
    fetchWeather(country.capital)
      .then((weatherData) => {
        const weatherMarkup = `
          <div class="weather__header">
            <div class="weather__main">
          
              <div class="weather__status">${weatherData.weather[0].description}</div>
            </div>
            <div class="weather__icon">
              <img src="https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png" alt="${weatherData.weather[0].description}">
            </div>
          </div>
          <div class="weather__temp">${Math.round(weatherData.main.temp)}°C</div>
          <div class="weather__feels-like">Feels-like: ${Math.round(weatherData.main.feels_like)}°C</div>
        `;
        const weatherDataEl = countryInfo.querySelector('.weather-data');
        weatherDataEl.innerHTML = weatherMarkup;
      })
      .catch((error) => {
        const weatherDataEl = countryInfo.querySelector('.weather-data');
        weatherDataEl.innerHTML = 'Failed to fetch weather data';
      });
  }


function clearSearchCountry() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
}