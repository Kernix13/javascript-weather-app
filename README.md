# Vanilla JavaScript Weather APP

Conversion of my jQuery weather app to pure JavaScript. Data from openweather.org. Used Parcel to compile the SCSS files.

> TO-DO Items

1. get current time (DONE)
1. Weather by Zip Code
1. Weather maps
1. Total redo of the CSS - MOBILE-FIRST
1. Fahrenheit to Celsius conversion
1. Settings?
1. Historical weather data?

## Something goes here

Links:

1. [FAQS](https://openweathermap.org/faq):
1. [Weather maps 1.0](https://openweathermap.org/api/weathermaps)
1. [Weather maps 2.0](https://openweathermap.org/api/weather-map-2)
1. [Historical weather data](https://openweathermap.org/api/one-call-3#history)
1. [Alerts](https://openweathermap.org/api/one-call-3#how)
1. [Relief maps](https://openweathermap.org/api/relief)
1. [Units of measurement](https://openweathermap.org/weather-data)
1. [Icon List](https://openweathermap.org/weather-conditions#How-to-get-icon-URL)
1. [FontAwesome Weather](https://fontawesome.com/search?q=weather&o=r)
1. [Geocoding API](https://openweathermap.org/api/geocoding-api):
   1. Geocoding is the process of transformation of any location name into geographical coordinates, and the other way around
   1. [Coordinates by zip/post code](https://openweathermap.org/api/geocoding-api#direct_zip), syntax:

```js
// Zip Code weather
const locationByZip = `http://api.openweathermap.org/geo/1.0/zip?zip={zip code},{country code}&appid={API key}`;
// Historical weather
const historicalWeather = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat={lat}&lon={lon}&dt={time}&appid={API key}`;
// Weather maps 1.0
const weatherMap1 = `https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={API key}`;
// Weather maps 2.0
const weatherMap2 = `http://maps.openweathermap.org/maps/2.0/weather/{op}/{z}/{x}/{y}?appid={API key}`;
```

> Please use ISO 3166 country codes, `US` not USA

## Setup

1. Add your own favicon icon into `src\images`
1. Add your own API key into `src/js/script.js`, or:
1. Create `.env` file in the root and add your openweather.org API key into there.
1. I chose to use Font Awesome icons because the ones from openweathermap suck!. Feel free to use any other icons or remove that code altogether.
