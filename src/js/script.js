const form = document.getElementById('city-form');
const cityName = document.getElementById('city-name');
const userCity = cityName.value;

// CITY Zip
const locationByZip = 'http://api.openweathermap.org/geo/1.0/zip?zip=19064,US&appid=' + process.env.API_KEY;

let city = '';
async function fetchByUrl(url) {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      city = data.name;
      console.log(city); // Philadelphia
      return city;
    } else {
      console.log("Not Successful");
    }
  } catch (err) {
    console.error(err);
  }
}
console.log(fetchByUrl(locationByZip)); // Promise pending

console.log(city + "getting nothing here")
city = 'Philadelphia'; // this works in the main fetch function
const cityLat = document.querySelector('.lat');
const cityLong = document.querySelector('.long');

// Need to convert this to zip and country code example
const currentWeatherCity = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&APPID={API key}'
// Same as above
const dayHourWeatherCity = 'https://api.openweathermap.org/data/2.5/onecall?lat=39.95&lon=-75.16&exclude=minutely&units=imperial&appid={API key}';

// CURRENT CONDITIONS SELECTORS
const cityH2 = document.querySelector('.city');
const weatherIcon = document.querySelector('.icon');
const currWeatherDesc = document.querySelector('.weather');
const currTemp = document.querySelector('.temp');
const currFeelsLike = document.querySelector('.feels-like');
const sunrise = document.querySelector('.sunrise');
const sunset = document.querySelector('.sunset');
const totalSunlight = document.querySelector('.daylight');
const currHumidity = document.querySelector('.humidity');
const currPressure = document.querySelector('.pressure');
const currVisibility = document.querySelector('.visibility');
const currWindSpeed = document.querySelector('.wind-speed');
const currWindGust = document.querySelector('.wind-gust');
const currWindDegree = document.querySelector('.wind-degree');

const directions = [
  [0, 11.25, ' N'],
  [11.25, 33.75, ' NNE'],
  [33.75, 56.25, ' NE'],
  [56.25, 78.75, ' ENE'],
  [78.75, 101.25, ' E'],
  [101.25, 123.75, ' ESE'],
  [123.75, 146.25, ' SE'],
  [146.25, 168.75, ' SSE'],
  [168.75, 191.25, ' S'],
  [191.25, 213.75, ' SSW'],
  [213.75, 236.25, ' SW'],
  [236.25, 258.75, ' WSW'],
  [258.75, 281.25, ' W'],
  [281.25, 303.75, ' WNW'],
  [303.75, 326.25, ' NW'],
  [326.25, 348.75, ' NNW'],
  [348.75, 0, ' N'],
];

cityH2.innerText = 'Weather for ' + city;

// Current conditions
async function fetchCurrent(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log(data);

      // GET ICON FROM 2ND ARRAY IF AVAILABLE
      let iconTwo = 0;
      if (data.weather[1]) {
        iconTwo = 1;
      }
      const icon = 'https://openweathermap.org/img/w/' + data.weather[iconTwo].icon + '.png';
      weatherIcon.setAttribute('src', icon)

      // GET TEXT DESCRIPTION FROM 2ND ARRAY (IF AVAILABLE)
      let descTwo = 0;
      if (data.weather[1]) descTwo = 1;
      const weatherDesc = 'Conditions: ' + data.weather[descTwo].main + ' (' + data.weather[descTwo].description + ')';
      currWeatherDesc.innerText = weatherDesc;

      // TEMPERATURE
      let temp = 'Temperature: ' + Math.round(data.main.temp) + `<span class="deg"><sup>&deg;</sup></span>` + ' F';
      let feelsLike = '(Feels like: ' + Math.round(data.main.feels_like) + `<span>&deg;</span>` + ')';
      currTemp.innerHTML = temp;
      currFeelsLike.innerHTML = feelsLike

      // COORDINATES
      const lat = data.coord.lat;
      const lon = data.coord.lon;

      // CONVERT LAT & LONG INTO DEGREES
      // Get integer and decimal as separate values
      const latInt = Math.trunc(lat);
      let latDecimal,
        latMins,
        latMinInt,
        latMinDec,
        latSecs = '';

      if (lat > 0) {
        latDecimal = lat - latInt;
        latMins = latDecimal * 60;
        latMinInt = Math.trunc(latMins);
        latMinDec = latMins - latMinInt;
        latSecs = (latMinDec * 60).toFixed(1);
      } else {
        latDecimal = Math.abs(lat - latInt);
        latMins = latDecimal * 60;
        latMinInt = Math.trunc(latMins);
        latMinDec = latMins - latMinInt;
        latSecs = (latMinDec * 60).toFixed(1);
      }

      const lonInt = Math.trunc(lon);
      let lonDecimal,
        lonMins,
        lonMinInt,
        lonMinDec,
        lonSecs = '';

      if (lon > 0) {
        lonDecimal = lon - lonInt;
        lonMins = lonDecimal * 60;
        lonMinInt = Math.trunc(lonMins);
        lonMinDec = lonMins - lonMinInt;
        lonSecs = (lonMinDec * 60).toFixed(1);
      } else {
        lonDecimal = Math.abs(lon - lonInt);
        lonMins = lonDecimal * 60;
        lonMinInt = Math.trunc(lonMins);
        lonMinDec = lonMins - lonMinInt;
        lonSecs = (lonMinDec * 60).toFixed(1);
      }

      let latDegMinSec = latInt + `<span>&deg;</span> ` + latMinInt + `<span>&prime;</span> ` + latSecs + `<span>&Prime;</span> `;
      let lonDegMinSec = lonInt + `<span>&deg;</span> ` + lonMinInt + `<span>&prime;</span> ` + lonSecs + `<span>&Prime;</span> `;
      let latDesc = 'Lat.: ' + latDegMinSec + ' (' + data.coord.lat + ')';
      let longDesc = 'Long.: ' + lonDegMinSec + ' (' + data.coord.lon + ')';
      cityLat.innerHTML = latDesc
      cityLong.innerHTML = longDesc

      // SUNRISE
      let sunriseTime = data.sys.sunrise;
      let dateRise = new Date(sunriseTime * 1000);
      let riseTime = 'Sunrise: ' + dateRise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      sunrise.innerHTML = riseTime

      // SUNSET
      let sunsetTime = data.sys.sunset;
      let dateSet = new Date(sunsetTime * 1000);
      let setTime = 'Sunset: ' + dateSet.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      sunset.innerHTML = setTime

      // Calculate hours of daylight
      let daylight = sunsetTime - sunriseTime;
      let lightHrs = Math.trunc(daylight / 3600);
      let lightMins = Math.trunc((daylight / 3600 - lightHrs) * 60);
      let lightSecs = Math.round(((daylight / 3600 - lightHrs) * 60 - lightMins) * 60);
      let lightLength = new Date(daylight * 1000);
      let hrsOfLight = 'Hrs of light: ' + lightHrs + ':' + lightMins + ':' + lightSecs;
      totalSunlight.innerText = hrsOfLight;

      // HUMIDITY, PRESSURE, VISIBILITY
      let humidity = 'Humidity: ' + data.main.humidity + '%';
      let pressure = 'Pressure: ' + data.main.pressure + ' hPa';
      let visibility = 'Visibility: ' + ((data.visibility / 1000) * 0.621371).toFixed(1) + ' mi';
      currHumidity.innerText = humidity;
      currPressure.innerText = pressure;
      currVisibility.innerText = visibility;

      // WIND SPEED, WIND GUST
      let windSpeed = 'Wind speed: ' + Math.round(data.wind.speed) + ' mph';
      let windGust = 'Wind gusts: ' + Math.round(data.wind.gust) + ' mph';
      if (!data.wind.gust) {
        windGust = 'Wind gusts: no gusts';
      }
      currWindSpeed.innerText = windSpeed;
      currWindGust.innerText = windGust;

      // WIND DIRECTION
      const windDeg = data.wind.deg;
      let direction = '';

      function getWindDirection(arr) {
        arr.map(item => {
          if (windDeg >= item[0] && windDeg < item[1]) {
            direction = item[2];
          }
        })
        return direction;
      }

      let windDegree = 'Wind dir: ' + windDeg + `<span>&deg;</span>` + getWindDirection(directions);
      currWindDegree.innerHTML = windDegree;

      // return data;
    } else {
      console.log("Not successful");
    }
  } catch (err) {
    console.error(err);
  }
}
fetchCurrent(currentWeatherCity);

// Daily and Hourly weather
const dailyData = document.getElementById('daily-data');
const hourlyData = document.getElementById('hourly-data');
const weatherAlerts = document.getElementById('weather-alerts');
const hourlyDetail = document.getElementById('hourly-detail');
const weatherAlert = document.querySelector('.alert');

async function fetchDailyHourly(url) {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      console.log(data);

      const dayData = data.daily;
      const hrData = data.hourly;

      // DAILY LOOP
      dayData.map(item => {
        // MAIN VARIABLES
        const date = item.dt;
        const date2 = new Date(date * 1000).toLocaleDateString('en-us', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
        const tempMin = Math.round(item.temp.min);
        const tempMax = Math.round(item.temp.max);
        // let humidity = item.humidity;
        const precip = item.pop * 100;
        const moonPhase = Math.round(item.moon_phase * 100);
        const moonRise = item.moonrise;
        const moonrise2 = new Date(moonRise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const moonSet = item.moonset;
        const moonset2 = new Date(moonSet * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const dailyMain = item.weather[0].main.slice(0, 1).toUpperCase() + item.weather[0].main.slice(1);
        // let dailyDesc = item.weather[0].description;

        // SUNRISE
        const sunriseTime = item.sunrise;
        const dateRise = new Date(sunriseTime * 1000);
        const riseTime = 'Sunrise: ' + dateRise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // SUNSET
        const sunsetTime = item.sunset;
        const dateSet = new Date(sunsetTime * 1000);
        const setTime = 'Sunset: ' + dateSet.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // OUTPUT DAILY CONDITIONS
        const dayOutput = `<li class="curr-day"><span class="bold">${date2}</span>
          <ul id="daily-${item}">
            <li>${dailyMain}</li>

            <li>Low: ${tempMin}<span>&deg;</span>F</li>
            <li>High: ${tempMax}<span>&deg;</span>F</li>
            <li>Precip: ${precip}%</li>

            <li>Moon phase: ${moonPhase}%</li>
            <li>Moon rise: ${moonrise2}</li>
            <li>Moon set: ${moonset2}</li>
            
            <li>${riseTime}</li>
            <li>${setTime}</li>
          </ul>
        </li>`;

        const dailyText = document.createElement('li');

        dailyText.classList.add('daily-data');

        dailyData.insertAdjacentHTML('beforeend', dayOutput);
      });

      // HOURLY LOOP - let hrData = data.hourly;
      hrData.map(item => {
        // MAIN VARIABLES
        const main = item.weather[0].main;
        const desc = item.weather[0].description.slice(0, 1).toUpperCase() + item.weather[0].description.slice(1);

        const time = item.dt;
        const hour = new Date(time * 1000);
        const outputHour = hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        const temp = 'Temp.: ' + Math.round(item.temp) + `<span>&deg;</span>` + 'F';
        const feelsLike = '(Feels like: ' + Math.round(item.feels_like) + `<span>&deg;</span>` + ')';

        const dewPt = Math.round(item.dew_point) + `<span>&deg;</span>` + 'F';
        const pop = Math.round(item.pop * 100) + '%';
        const humidity = item.humidity + '%';

        const pressure = item.pressure + ' mb';
        const visibility = ((item.visibility / 1000) * 0.621371).toFixed(1) + ' mi';

        const windSpeed = 'Wind: ' + Math.round(item.wind_speed) + ' mph';
        const gustSpeed = 'Gusts: ' + Math.round(item.wind_gust) + ' mph';

        // OUTPUT HOURLY CONDITIONS
        const hrOutput = `<li class="curr-hour"><span class="bold">${outputHour}</span>
          <ul id="hourly-${item}">
            <li>Conditions: ${desc}</li>

            <li>${temp} <span>${feelsLike}</span></li>

            <li>${windSpeed} | ${gustSpeed}</li>
          
            <li>Humidity: ${humidity} | Precip.: ${pop}</li>
          </ul>
        </li>`;
        
        const weatherText = document.createElement('li');

        weatherText.classList.add('hourly-data');

        hourlyData.insertAdjacentHTML('beforeend', hrOutput);
      })
      
      if (data.alert) {
        const senderName = data.alerts.sender_name;
        const alertEvent = data.alerts.event;
        const eventStart = data.alerts.start;
        const eventEnd = data.alerts.end;
        const eventDesc = data.alerts.description;
        const tags = data.alerts.tags;

        const alertOutput = `
          <li>Precip. %: ${senderName}</li>
          <li>Precip. %: ${alertEvent}</li>
          <li>Precip. %: ${eventStart}</li>
          <li>Precip. %: ${eventEnd}</li>
          <li>Precip. %: ${eventDesc}</li>
          <li>Precip. %: ${tags}</li>
          `;

        const alertText = document.createElement('li');

        alertText.classList.add('alert-data');

        weatherAlerts.insertAdjacentHTML('beforeend', alertOutput);

        console.log('Alert exists');
      } else {
        console.log('Weather alerts for this area: No alerts');
      }

      if (data.alert) {
        const alertNotice = 'Alerts: ' + `${alertEvent}`;
        weatherAlert.innerText = alertNotice
      } else {
        const alertNotice = 'Alerts: No alerts';
        weatherAlert.innerText = alertNotice
      }

      // return data;
    } else {
      console.log("Not successful");
    }
  } catch (err) {
    console.error(err);
  }
}
fetchDailyHourly(dayHourWeatherCity);

