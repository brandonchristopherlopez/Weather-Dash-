let apikey = "9442233adb1931154a31734b50dc4334"
let apiUrl = 'https://api.openweathermap.org';

let searchHistoryEl = document.querySelector('#search-history');
let searchHistory = [];


function getWeather(location) {
    let { lon } = location;
    let { lat } = location;
    let city = location.name;

    let Url = `${weatherApiRootURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            renderItems(city, data);
        })
        .catch(function (err) {
            console.error(err);
        });
}
function getCoordinates(query) {
    let Url = `${apiUrl}/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            if (!data[0]) {
                alert('Location not found');
            } else {
                appendToHistory(query);
                fetchWeather(data[0]);
            }
        })
        .catch(function (err) {
            console.error(err);
        });
}

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

function searchHistory() {
    let h = localStorage.getItem('search-history');
    if (h) {
      searchHistory = JSON.parse(storedHistory);
    }
    searchHistory_Print();
  }

function searchHistory_Print() {
    searchHistoryContainer.innerHTML = '';

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








 // searchHistory();
// searchForm.addEventListener('submit', handleSearchFormSubmit);
//searchHistoryContainer.addEventListener('click', handleSearchHistoryClick);

