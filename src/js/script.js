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
const currWindSpeed = document.querySelector('.wind-speed');
const currWindGust = document.querySelector('.wind-gust');
const currWindDegree = document.querySelector('.wind-degree');
const sunrise = document.querySelector('.sunrise');
const sunset = document.querySelector('.sunset');
const totalSunlight = document.querySelector('.daylight');
const currHumidity = document.querySelector('.humidity');
const currPressure = document.querySelector('.pressure');
const currVisibility = document.querySelector('.visibility');
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
  [348.75, 360.00, ' N'],
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
let countryCode = 'US'; // outputs as `undefined` in the end point below

async function fetchByZip(zip, country) {

  try {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/zip?zip=${zip},US&appid=WEATHER_API_KEY`);

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
      return output;
    } else {
      console.log("Not Successful");
    }
  } catch (err) {
    console.error(err);
  }
}

// CURRENT WEATHER CONDITIONS
async function fetchCurrent() {
  try {
    const city = await fetchByZip(zipCode, countryCode);
    const cityName = city[0]
    const cityZip = city[1].zip
    const latitude = city[1].latitude
    const longitude = city[1].longitude

    const currentWeatherCity = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=WEATHER_API_KEY`;
    
    const response = await fetch(currentWeatherCity);
    if (response.ok) {
      const data = await response.json();
      console.log(data);

      // OUTPUT CITY NAME
      cityHeading.innerText = `${cityName} (${cityZip})`;

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
      let weatherDesc = `${main} (${description})`;
      if (description.split(" ").length < 2) {
        weatherDesc = `${main}`;
      }
      currWeatherDesc.innerText = weatherDesc;

      // TEMPERATURE
      const temp = `${Math.round(data.main.temp)}<span class="deg"><sup>&deg;</sup></span>F`;
      // const celcius = temp
      const feelsLike = `(Feels like: ${Math.round(data.main.feels_like)}<span>&deg;</span>F)`;
      currTemp.innerHTML = temp;
      currFeelsLike.innerHTML = feelsLike

      // COORDINATES
      cityLat.innerHTML = `Lat.: ${data.coord.lat} | `;
      cityLong.innerHTML = `Long.: ${data.coord.lon}`;

      // SUNRISE
      const sunriseTime = data.sys.sunrise;
      const dateRise = new Date(sunriseTime * 1000);
      const riseTime = `Rise: ${dateRise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      sunrise.innerHTML = riseTime

      // SUNSET
      const sunsetTime = data.sys.sunset;
      const dateSet = new Date(sunsetTime * 1000);
      const setTime = `Set: ${dateSet.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      sunset.innerHTML = setTime

      // CALCULATE HOURS OF DAYLIGHT
      const daylight = sunsetTime - sunriseTime;
      const lightHrs = Math.trunc(daylight / 3600);
      const lightMins = Math.trunc((daylight / 3600 - lightHrs) * 60);
      let lightSecs = Math.round(((daylight / 3600 - lightHrs) * 60 - lightMins) * 60);
      if (lightSecs < 10) lightSecs = `0${lightSecs}`
      const hrsOfLight = `Hrs of light: ${lightHrs}:${lightMins}:${lightSecs}`;
      // totalSunlight.innerText = hrsOfLight;

      // HUMIDITY, PRESSURE, VISIBILITY
      const humidity = `${data.main.humidity}%`;
      const pressure = `${data.main.pressure} hPa`;
      const visibility = `${((data.visibility / 1000) * 0.621371).toFixed(1)} mi`;
      currHumidity.innerText = humidity;
      currPressure.innerText = pressure;
      currVisibility.innerText = visibility;

      // WIND SPEED, WIND GUST
      let windSpeed = '';
      let windDegree = '';
      let windGust = `Gusts: ${Math.round(data.wind.gust)} mph`;
      if (!data.wind.gust) {
        windGust = 'Gusts: N/A';
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
          wind[0] = 'No wind';
          wind[1] = '';
        } else {
          wind[0] = `${Math.round(data.wind.speed)} mph`;
          // wind[0] = `Wind speed: ${Math.round(data.wind.speed)} mph`;
          wind[1] = `${windDeg}<span>&deg;</span>${getWindDirection(directions)}`;
          // wind[1] = `Wind dir: ${windDeg}<span>&deg;</span>${getWindDirection(directions)}`;
        }
        return wind;
      }
      checkWindSpeed()

      currWindSpeed.innerText = wind[0];
      currWindGust.innerText = windGust;
      currWindDegree.innerHTML = wind[1];

      // CURRENT ALERT NOTICE OUTPUT
      if (data.alert) {
        const alertNotice = `${alertEvent}`;
        weatherAlert.innerText = alertNotice
      } else {
        console.log('Weather Alerts: No alerts for your location.');
        const alertNotice = 'No alerts';
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
    console.log(lat, long)
    const dayHourWeatherCity = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=imperial&appid=WEATHER_API_KEY`;

    const response = await fetch(dayHourWeatherCity);
    if (response.ok) {
      const data = await response.json();
      console.log(data);

      const dayData = data.daily;
      const hrData = data.hourly;

      // DAILY LOOP
      dayData.map(item => {
        const date2 = new Date(item.dt * 1000).toLocaleDateString('en-us', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
        const moonPhase = Math.round(item.moon_phase * 100);
        const moonrise = new Date(item.moonrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const moonSet = new Date(item.moonset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const dailyMain = item.weather[0].main.slice(0, 1).toUpperCase() + item.weather[0].main.slice(1);
        const humidity = item.humidity;
        const dailyDesc = item.weather[0].description;

        // SUNRISE
        const dateRise = new Date(item.sunrise * 1000);
        const riseTime = 'Sunrise: ' + dateRise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // SUNSET
        const dateSet = new Date(item.sunset * 1000);
        const setTime = 'Sunset: ' + dateSet.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // OUTPUT DAILY CONDITIONS
        const dayOutput = `<li class="curr-day"><span class="bold">${date2}</span>
          <ul id="daily-${item}">
            <li>${dailyMain}</li>

            <li>Low: ${Math.round(item.temp.min)}<span>&deg;</span>F</li>
            <li>High: ${Math.round(item.temp.max)}<span>&deg;</span>F</li>
            <li>Precip: ${Math.round(item.pop * 100)}%</li>

            <li>Moon phase: ${moonPhase}%</li>
            <li>Moon rise: ${moonrise}</li>
            <li>Moon set: ${moonSet}</li>
            
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
        const hour = new Date(item.dt * 1000);
        const outputHour = hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const temp = `${Math.round(item.temp)}<span>&deg;</span>F`;
        const feelsLike = `(Feels like: ${Math.round(item.feels_like)}<span class="hr-fl">&deg;</span>)`;
        const pop = Math.round(item.pop * 100) + '%';
        const windSpeed = `<i class="fa-solid fa-wind"></i> ${Math.round(item.wind_speed)} mph`;
        const gustSpeed = ` (${Math.round(item.wind_gust)} mph)`;
        const dewPt = Math.round(item.dew_point) + `<span>&deg;</span>` + 'F';
        const pressure = item.pressure + ' mb';
        const visibility = ((item.visibility / 1000) * 0.621371).toFixed(1) + ' mi';

        // OUTPUT HOURLY CONDITIONS
        const hrOutput = `<li class="curr-hour"><span class="bold">${outputHour}</span>
          <ul id="hourly-${item}">
            <li>${desc}</li>
            <li>${temp} <span class="hr-fl">${feelsLike}</span></li>
            <li>${windSpeed} ${gustSpeed}</li>
            <li><i class="fa-solid fa-droplet"></i> ${item.humidity}% | Precip.: ${pop}</li>
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

  const options = {
  weekday: "short",     // or "long", "narrow"
  year: "numeric",      // or "2-digit"
  month: "short",        // or "numeric", "short", "2-digit"
  day: "numeric",       // or "2-digit"
  hour: "2-digit",      // or "numeric"
  minute: "2-digit",    // or "numeric"
  second: "2-digit",    // or "numeric"
};

  let date = new Date(); 
  const time = date.toLocaleDateString("en-US", options);

  document.getElementById("clock").innerText = time; 
  const t = setTimeout(function(){ currentTime() }, 1000);
}
currentTime();
window.addEventListener('load', currentTime)

// navigator.geolocation.getCurrentPosition was here but it takes too long
