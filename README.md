# Vanilla JavaScript Weather APP

Conversion of my jQuery weather app to pure JavaScript. Data from openweather.org. I will eventually use Parcel to compile the SCSS files which I don't have yet, plus I am still building the UI in Figma.

> HOW DO I USE ENVIRONMENT VARIABLES SO THAT I DO NOT PUSH MY API KEY?

## TO-DO Items

1. get current time (DONE)
1. Weather by Zip Code (DONE)
1. Finish pade designs in Figma (in process)
1. Total redo of the CSS - MOBILE-FIRST
1. Have body background-color change from day to night based on sunrise and sunset times with a 20+ minute transition between
1. Get zip code input field working
1. Set weather by user's Geolocation, else default to input field (Not realistic), so maybe set to a default city like Philadelphia or New York
1. Fahrenheit to Celsius (imperial to metric) conversion (Settings?)
1. Settings? Let user uncheck fields like visibility, humidity, etc. (React?)
1. List of difficulties/issues while building this app:
   1. **PROBLEM**: original program used jQuery, **SOLUTIOn**: Converted to vanilla JS
   1. **PROBLEM**: current weather endpoint did not accept city names of more than 1 word, **SOLUTION**: had to change to geo lat/long to get current data
   1. **PROBLEM**: using the output of 1 endpoint as the input for another, **SOLUTION**: called the first inside the secong with the `await` keyword
   1. **PROBLEM**: Wind speed and direction were bith 0 when speed was zero; noticed it when I checked at such a condition, **SOLUTION**: if/else in a Fx check to output text
   1. **PROBLEM**: gigantic if/else block to output the direction of the wind, **SOLUTION**: created an arrap of directions and used `arr.map()`
   1. **PROBLEM**: openweathermap.ord icons were poor quality, **SOLUTION**: created an object of their files names set to FontAwesome calss names; changed the HTML
   1. **PROBLEM**: Input field functionality not working, **SOLUTION**: NONE
   1. **PROBLEM**: errors with maps and historical weather, **SOLUTION**: NONE

## Miscelaaneous

Links:

1. [FAQS](https://openweathermap.org/faq):
1. [Weather maps 1.0](https://openweathermap.org/api/weathermaps)
1. [Units of measurement](https://openweathermap.org/weather-data)
1. [Icon List](https://openweathermap.org/weather-conditions#How-to-get-icon-URL)
1. [FontAwesome Weather](https://fontawesome.com/search?q=weather&o=r)
1. [Geocoding API](https://openweathermap.org/api/geocoding-api):
   1. Geocoding is the process of transformation of any location name into geographical coordinates, and the other way around
   1. [Coordinates by zip/post code](https://openweathermap.org/api/geocoding-api#direct_zip), syntax:

```js
// Zip Code weather
const locationByZip = `http://api.openweathermap.org/geo/1.0/zip?zip={zip code},{country code}&appid={API key}`;
```

> Please use ISO 3166 country codes, `US` not USA

## Setup

1. Add your own favicon icon into `src\images`
1. Add your own API key into `src/js/script.js`, or:
1. Create `.env` file in the root and add your openweather.org API key into there.
1. I chose to use Font Awesome icons because the ones from openweathermap suck!. Feel free to use any other icons or remove that code altogether.

## Other Info

1. Weather Maps 1.0 - need Leaflet
1. Relief Maps - need Leaflet
1. Historical weather - getting an error:

```sh
index.js:478
 GET https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=39.9296&lon=-75.3338&dt=1643803200&appid=804cf3b… 401 (Unauthorized)
getWeatherMap	@	index.js:478
await in getWeatherMap (async)
(anonymous)
```

The JS:

```js
// HISTORICAL
const weatherMap = document.getElementById('weather-map');

async function getWeatherMap() {
  try {
    const city = await fetchByZip(zipCode);
    const cityName = city[0];
    const cityZip = city[1].zip;
    const latitude = city[1].latitude;
    const longitude = city[1].longitude;

    const mapApi = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${latitude}&lon=${longitude}&dt=1643803200&appid=804cf3b11e9abeee25a8f6e6cb189d31`;
    const response = await fetch(mapApi);

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      // return data;
    } else {
      console.log('Not Successful');
    }
  } catch (err) {
    console.error(err);
  }
}
getWeatherMap();
```
