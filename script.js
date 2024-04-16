let apikey = "9442233adb1931154a31734b50dc4334"
let apiUrl = 'https://api.openweathermap.org';

let searchHistoryEl = document.querySelector('#search-history');
let searchHistory = [];
let searchInputEl = document.querySelector('#my-search-input');
let searchFormEl = document.querySelector('#my-search-form');
let todayWeather = document.querySelector('#current-weather');
let forecastContainer = document.querySelector('#forecast');

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

function getWeather(location) {
    let { lon } = location;
    let { lat } = location;
    let city = location.name;

    let Url = `${apiUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apikey}`;

    fetch(Url)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            weather_print(city, data);
        })
        .catch(function (err) {
            console.error(err);
        });
}
function getCoordinates(query) {
    let Url = `${apiUrl}/geo/1.0/direct?q=${query}&limit=5&appid=${apikey}`;

    fetch(Url)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            if (!data[0]) {
                alert('Location not found');
            } else {
                searchHistory_Push(query);
                getWeather(data[0]);
            }
        })
        .catch(function (err) {
            console.error(err);
        });
}

function searchHistory_init() {
    let h = localStorage.getItem('search-history');
    if (h) {
      searchHistory = JSON.parse(h);
    }
    searchHistory_Print();
  }

function searchHistory_Print() {
    searchHistoryEl.innerHTML = '';

    for (let i = searchHistory.length - 1; i >= 0; i--) {
        let button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.setAttribute('aria-controls', 'today forecast');
        button.classList.add('history-btn', 'btn-history');

        button.setAttribute('data-search', searchHistory[i]);
        button.textContent = searchHistory[i];
        searchHistoryEl.append(button);
    }
}

function searchHistory_Push(query) {
    if (searchHistory.indexOf(query) !== -1) {
      return;
    }
    searchHistory.push(query);
  
    localStorage.setItem('search-history', JSON.stringify(searchHistory));
    searchHistory_Print();
  }


  function FormSubmit(e) {
    if (!searchInputEl.value) {
      return;
    }
  
    e.preventDefault();
    let s = searchInputEl.value.trim();
    getCoordinates(s);
    searchInputEl.value = '';
  }
 
  function FormClick(e) {
    if (!e.target.matches('.btn-history')) {
      return;
    }
  
    let btn = e.target;
    let s = btn.getAttribute('data-search');
    getCoordinates(s);
  }

function weather_print(city, data) {
 currentWeather_Print(city, data.list[0], data.city.timezone);
 displayFiveDayForecast(data.list);
  }

  function currentWeather_Print(location, weatherData) {
    const currentDate = dayjs().format('M/D/YYYY');
    const temperature = weatherData.main.temp;
    const windSpeed = weatherData.wind.speed;
    const humidityLevel = weatherData.main.humidity;
    const iconSource = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
    const iconAltText = weatherData.weather[0].description || weatherData.weather[0].main;

    const weatherCard = document.createElement('div');
    const cardContent = document.createElement('div');
    const titleElement = document.createElement('h2');
    const weatherImage = document.createElement('img');
    const temperatureElement = document.createElement('p');
    const windElement = document.createElement('p');
    const humidityElement = document.createElement('p');

    weatherCard.setAttribute('class', 'weather-card');
    cardContent.setAttribute('class', 'card-content');
    weatherCard.appendChild(cardContent);

    titleElement.setAttribute('class', 'heading card-title');
    temperatureElement.setAttribute('class', 'info-text');
    windElement.setAttribute('class', 'info-text');
    humidityElement.setAttribute('class', 'info-text');

    titleElement.textContent = `${location} (${currentDate})`;
    weatherImage.setAttribute('src', iconSource);
    weatherImage.setAttribute('alt', iconAltText);
    weatherImage.setAttribute('class', 'weather-icon');
    titleElement.appendChild(weatherImage);
    temperatureElement.textContent = `Temperature: ${temperature}°F`;
    windElement.textContent = `Wind Speed: ${windSpeed} MPH`;
    humidityElement.textContent = `Humidity: ${humidityLevel}%`;

    cardContent.appendChild(titleElement);
    cardContent.appendChild(temperatureElement);
    cardContent.appendChild(windElement);
    cardContent.appendChild(humidityElement);

todayWeather.innerHTML = '';
    todayWeather.appendChild(weatherCard);
}

function displayForecastCard(forecastData) {
    const forecastIconSource = `https://openweathermap.org/img/w/${forecastData.weather[0].icon}.png`;
    const forecastIconDescription = forecastData.weather[0].description;
    const forecastTemperature = forecastData.main.temp;
    const forecastHumidity = forecastData.main.humidity;
    const forecastWindSpeed = forecastData.wind.speed;

    const columnElement = document.createElement('div');
    const cardElement = document.createElement('div');
    const cardContentElement = document.createElement('div');
    const titleElement = document.createElement('h5');
    const forecastImage = document.createElement('img');
    const tempElement = document.createElement('p');
    const windElement = document.createElement('p');
    const humidityElement = document.createElement('p');

    columnElement.appendChild(cardElement);
    cardElement.appendChild(cardContentElement);
    cardContentElement.appendChild(titleElement);
    cardContentElement.appendChild(forecastImage);
    cardContentElement.appendChild(tempElement);
    cardContentElement.appendChild(windElement);
    cardContentElement.appendChild(humidityElement);

    columnElement.setAttribute('class', 'forecast-col');
    columnElement.classList.add('forecast-card');
    cardElement.setAttribute('class', 'card bg-primary h-100 text-white');
    cardContentElement.setAttribute('class', 'card-body p-2');
    titleElement.setAttribute('class', 'card-title');
    tempElement.setAttribute('class', 'card-text');
    windElement.setAttribute('class', 'card-text');
    humidityElement.setAttribute('class', 'card-text');

    titleElement.textContent = dayjs(forecastData.dt_txt).format('M/D/YYYY');
    forecastImage.setAttribute('src', forecastIconSource);
    forecastImage.setAttribute('alt', forecastIconDescription);
    tempElement.textContent = `Temp: ${forecastTemperature}°F`;
    windElement.textContent = `Wind: ${forecastWindSpeed} MPH`;
    humidityElement.textContent = `Humidity: ${forecastHumidity}%`;

    forecastContainer.appendChild(columnElement);
}
function displayFiveDayForecast(forecastData) {
    const startTimestamp = dayjs().add(1, 'day').startOf('day').unix();
    const endTimestamp = dayjs().add(6, 'day').startOf('day').unix();

    const headingColumn = document.createElement('div');
    const forecastHeading = document.createElement('h4');

    headingColumn.setAttribute('class', 'col-12');
    forecastHeading.textContent = 'Upcoming 5-Day Forecast:';
    headingColumn.appendChild(forecastHeading);

    forecastContainer.innerHTML = '';
    forecastContainer.appendChild(headingColumn);

    forecastData.forEach(entry => {
        console.log(entry.dt);
        let timestamp = entry.dt;
        let isWithinTimeRange = true//(timestamp >= startTimestamp && timestamp < endTimestamp);
        let isNoonTime = entry.dt_txt.slice(11, 13) === "12";

        if (isWithinTimeRange && isNoonTime) {
            console.log(entry);
            displayForecastCard(entry);
        }
    });
}


 searchHistory_init();
searchFormEl.addEventListener('submit', FormSubmit);
searchHistoryEl.addEventListener('click', FormClick);

