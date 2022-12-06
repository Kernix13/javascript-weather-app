const form = document.getElementById('city-form');
// I need an event listener
// Change zip code to string because eastern US has zipcodes that start with 0 and international countries have zip codes with letters. Number based zip codes cause errors when either of these are experienced
const zip_code = document.getElementById('zip-code').value;
console.log("zip_code: " + zip_code)

// CURRENT CONDITIONS SELECTORS
const cityHeading = document.querySelector('.city');
const cityLat = document.querySelector('.lat');
const cityLong = document.querySelector('.long');
const weatherIcon = document.getElementById('icon');
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
const weatherAlert = document.querySelector('.alert');

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

const weatherIcons = {
  '01d': 'fa-solid fa-sun',
  '02d': 'fa-solid fa-cloud-sun',
  '03d': 'fa-solid fa-cloud-sun',
  '04d': 'fa-solid fa-cloud',
  '09d': 'fa-solid fa-cloud-rain',
  '10d': 'fa-solid fa-cloud-rain',
  '11d': 'fa-solid fa-cloud-bolt',
  '13d': 'fa-regular fa-snowflake',
  '50d': 'fa-solid fa-cloud-rain',
  '01n': 'fa-regular fa-moon',
  '02n': 'fa-solid fa-cloud-moon',
  '03n': 'fa-solid fa-cloud-moon',
  '04n': 'fa-solid fa-cloud-moon',
  '09n': 'fa-solid fa-cloud-rain',
  '10n': 'fa-solid fa-cloud-rain',
  '11n': 'fa-solid fa-cloud-bolt',
  '13n': 'fa-regular fa-snowflake',
  '50n': 'fa-solid fa-cloud-rain',
}

let zipCode = '19064';
let countryCode = 'US';

async function fetchByZip(zip) {
  // if (zip_code) zipCode = zip_code;

  try {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/zip?zip=${zip},${countryCode}&appid={API_ID0}`);

    if (response.ok) {
      const data = await response.json();
      const city = data.name;
      const cityData = {
        latitude: data.lat,
        longitude: data.lon,
        zip
      }
      const output = [city, cityData];
      // console.log(output)
      // return output;
    } else {
      console.log("Not Successful");
    }
  } catch (err) {
    console.error(err);
  }
}

// if (zip_code) zipCode = zip_code;
// fetchByZip(zipCode)
// CURRENT WEATHER CONDITIONS
async function fetchCurrent() {
  try {
    const city = await fetchByZip(zipCode);
    const cityName = city[0]
    const cityZip = city[1].zip
    const latitude = city[1].latitude
    const longitude = city[1].longitude

    const currentWeatherCity = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid={API_ID0}`;
    
    const response = await fetch(currentWeatherCity);
    if (response.ok) {
      const data = await response.json();
      console.log(data);

      // OUTPUT CITY NAME
      cityHeading.innerText = cityName + ' (' + cityZip + ')';

      // GET ICON FROM 2ND ARRAY IF AVAILABLE
      let iconNum = 0;
      if (data.weather.length === 2) iconNum = 1;

      // Create an object for data.weather[0].icon values and FontAwesome icons
      // const icon = 'https://openweathermap.org/img/w/' + data.weather[iconNum].icon + '.png';
      // weatherIcon.setAttribute('src', icon)

      const icon = weatherIcons[data.weather[iconNum].icon];
      weatherIcon.setAttribute('class', icon)

      // GET MORE ACCURATE TEXT DESCRIPTION FROM 2ND ARRAY (if it exists)
      let descNum = 0;
      if (data.weather.length === 2) descNum = 1;
      const main = data.weather[descNum].main;
      const description = data.weather[descNum].description

      // OUTPUT MAIN AND DESCRIPTION IF AVAILABLE, ELSE JUST MAIN 
      let weatherDesc = `Conditions:  ${main} (${description})`;
      if (description.split(" ").length < 2) {
        weatherDesc = `Conditions: ${main}`;
      }
      currWeatherDesc.innerText = weatherDesc;

      // TEMPERATURE
      const temp = 'Temperature: ' + Math.round(data.main.temp) + `<span class="deg"><sup>&deg;</sup></span>` + 'F';
      // const celcius = temp
      const feelsLike = '(Feels like: ' + Math.round(data.main.feels_like) + '<span>&deg;</span>F' + ')';
      currTemp.innerHTML = temp;
      currFeelsLike.innerHTML = feelsLike

      // COORDINATES
      const lat = data.coord.lat;
      const lon = data.coord.lon;

      // CONVERT LAT & LONG DECIMALS INTO DEGREES (Is this needed?)
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

      const latDegMinSec = latInt + `<span>&deg;</span> ` + latMinInt + `<span>&prime;</span> ` + latSecs + `<span>&Prime;</span> `;
      const lonDegMinSec = lonInt + `<span>&deg;</span> ` + lonMinInt + `<span>&prime;</span> ` + lonSecs + `<span>&Prime;</span> `;
      const latDesc = 'Lat.: ' + latDegMinSec + ' (' + data.coord.lat + ') | ';
      const longDesc = 'Long.: ' + lonDegMinSec + ' (' + data.coord.lon + ')';
      // cityLat.innerHTML = latDesc
      // cityLong.innerHTML = longDesc
      cityLat.innerHTML = 'Lat.: ' + data.coord.lat + ' | ';
      cityLong.innerHTML = 'Long.: ' + data.coord.lon;

      // SUNRISE
      const sunriseTime = data.sys.sunrise;
      const dateRise = new Date(sunriseTime * 1000);
      const riseTime = 'Sunrise: ' + dateRise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      sunrise.innerHTML = riseTime

      // SUNSET
      const sunsetTime = data.sys.sunset;
      const dateSet = new Date(sunsetTime * 1000);
      const setTime = 'Sunset: ' + dateSet.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      sunset.innerHTML = setTime

      // Calculate hours of daylight
      const daylight = sunsetTime - sunriseTime;
      const lightHrs = Math.trunc(daylight / 3600);
      const lightMins = Math.trunc((daylight / 3600 - lightHrs) * 60);
      let lightSecs = Math.round(((daylight / 3600 - lightHrs) * 60 - lightMins) * 60);
      if (lightSecs < 10) lightSecs = `0${lightSecs}`
      const hrsOfLight = 'Hrs of light: ' + lightHrs + ':' + lightMins + ':' + lightSecs;
      totalSunlight.innerText = hrsOfLight;

      // HUMIDITY, PRESSURE, VISIBILITY
      const humidity = 'Humidity: ' + data.main.humidity + '%';
      const pressure = 'Pressure: ' + data.main.pressure + ' hPa';
      const visibility = 'Visibility: ' + ((data.visibility / 1000) * 0.621371).toFixed(1) + ' mi';
      currHumidity.innerText = humidity;
      currPressure.innerText = pressure;
      currVisibility.innerText = visibility;

      // WIND SPEED, WIND GUST
      let windSpeed = '';
      let windDegree = '';
      let windGust = 'Wind gusts: ' + Math.round(data.wind.gust) + ' mph';
      if (!data.wind.gust) {
        windGust = 'Wind gusts: no gusts';
      }

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
      
      // RESET windSpeed & windDegree IF NO WIND
      const wind = [windSpeed, windDegree]

      function checkWindSpeed() {
          if (data.wind.speed === 0) {
          wind[0] = 'Wind speed: No wind';
          wind[1] = 'Wind dir: N/A';
          // return wind;
        } else {
          wind[0] = 'Wind speed: ' + Math.round(data.wind.speed) + ' mph';
          wind[1] = 'Wind dir: ' + windDeg + `<span>&deg;</span>` + getWindDirection(directions);
          // return wind;
        }
        return wind;
      }
      checkWindSpeed()

      currWindSpeed.innerText = wind[0];
      currWindGust.innerText = windGust;
      currWindDegree.innerHTML = wind[1];

      // CURRENT ALERT NOTICE OUTPUT
      if (data.alert) {
        const alertNotice = 'Alerts: ' + `${alertEvent}`;
        weatherAlert.innerText = alertNotice
      } else {
        console.log('Weather Alerts: No alerts for your location.');
        const alertNotice = 'Alerts: No alerts.';
        weatherAlert.innerText = alertNotice;
      }

      // return data;
    } else {
      console.log("Not successful");
    }
  } catch (err) {
    console.error(err);
  }
}
fetchCurrent();

// DAILY AND HOURLY WEATHER
const dailyData = document.getElementById('daily-data');
const hourlyData = document.getElementById('hourly-data');
const weatherAlerts = document.getElementById('weather-alerts');
const hourlyDetail = document.getElementById('hourly-detail');
// const weatherAlert = document.querySelector('.alert');

async function fetchDailyHourly() {
  try {
    const city = await fetchByZip(zipCode);
    const lat = city[1].latitude;
    const long = city[1].longitude;
    const dayHourWeatherCity = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=imperial&appid={API_ID0}`;

    const response = await fetch(dayHourWeatherCity);
    if (response.ok) {
      const data = await response.json();
      console.log(data);

      const dayData = data.daily;
      const hrData = data.hourly;

      // DAILY LOOP
      dayData.map(item => {
        const date = item.dt;
        const date2 = new Date(date * 1000).toLocaleDateString('en-us', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
        const tempMin = Math.round(item.temp.min);
        const tempMax = Math.round(item.temp.max);
        const precip = item.pop * 100;
        const moonPhase = Math.round(item.moon_phase * 100);
        const moonRise = item.moonrise;
        const moonrise2 = new Date(moonRise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const moonSet = item.moonset;
        const moonset2 = new Date(moonSet * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const dailyMain = item.weather[0].main.slice(0, 1).toUpperCase() + item.weather[0].main.slice(1);
        const humidity = item.humidity;
        const dailyDesc = item.weather[0].description;

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
        dailyText.classList.add('daily-data'); // already have this class above?
        dailyData.insertAdjacentHTML('beforeend', dayOutput);
      });

      // HOURLY LOOP - let hrData = data.hourly;
      hrData.map(item => {
        const desc = item.weather[0].description.slice(0, 1).toUpperCase() + item.weather[0].description.slice(1);
        const time = item.dt;
        const hour = new Date(time * 1000);
        const outputHour = hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const temp = 'Temp.: ' + Math.round(item.temp) + `<span>&deg;</span>` + 'F';
        const feelsLike = '(Feels like: ' + Math.round(item.feels_like) + `<span>&deg;</span>` + ')';
        const pop = Math.round(item.pop * 100) + '%';
        const humidity = item.humidity + '%';
        const windSpeed = 'Wind: ' + Math.round(item.wind_speed) + ' mph';
        const gustSpeed = 'Gusts: ' + Math.round(item.wind_gust) + ' mph';
        const dewPt = Math.round(item.dew_point) + `<span>&deg;</span>` + 'F';
        const pressure = item.pressure + ' mb';
        const visibility = ((item.visibility / 1000) * 0.621371).toFixed(1) + ' mi';

        // OUTPUT HOURLY CONDITIONS
        const hrOutput = `<li class="curr-hour"><span class="bold">${outputHour}</span>
          <ul id="hourly-${item}">
            <li>Conditions: ${desc}</li>
            <li>${temp} <span>${feelsLike}</span></li>
            <li>${windSpeed} | ${gustSpeed}</li>
            <li>Humidity: ${humidity} | Precip.: ${pop}</li>
          </ul>
        </li>`;
        
        const hourlyText = document.createElement('li');
        hourlyText.classList.add('hourly-data'); // already have this class above?
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
        console.log('Weather Alerts: No alerts for your location.');
      }

      return data;
    } else {
      console.log("Not successful");
    }
  } catch (err) {
    console.error(err);
  }
}
fetchDailyHourly();

// Get user's current time
function currentTime() {
  let date = new Date(); 
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const todayDate = `${month}-${day}-${year}`
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();
  let session = "AM";

  if(hh === 0){
      hh = 12;
  }
  if(hh > 12){
      hh = hh - 12;
      session = "PM";
   }

   hh = (hh < 10) ? "0" + hh : hh;
   mm = (mm < 10) ? "0" + mm : mm;
   ss = (ss < 10) ? "0" + ss : ss;
    
   const time = todayDate + ', ' + hh + ":" + mm + ":" + ss + " " + session;

  document.getElementById("clock").innerText = time; 
  const t = setTimeout(function(){ currentTime() }, 1000);
}
currentTime();
window.addEventListener('load', currentTime)

// navigator.geolocation.getCurrentPosition was here but it takes too long
