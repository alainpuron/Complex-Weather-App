// Cache DOM Elements for Efficiency
const searchForm = document.getElementById('search-form');
const searchBar = document.getElementById('search-bar');
const cityNameEl = document.getElementById('city-name');
const stateNameEl = document.getElementById('state-name');
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentTempEl = document.getElementById('current-temp');
const conditionEl = document.getElementById('condition');
const highLowEl = document.getElementById('high-low');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const hourlyForecastEl = document.getElementById('hourly-forecast');
const dailyForecastEl = document.getElementById('daily-forecast');
const rootEl = document.documentElement; // For dynamic CSS variables

const API_KEY = '75dd295c1c823ffe3f77dcfdfa77098d';

// List of some world cities for AutoComplete
const cities = [
    "Tokyo", "Havana", "Delhi", "Shanghai", "Sao Paulo", "Mumbai", "Cairo", "Beijing",
    "Dhaka", "Mexico City", "Osaka", "Karachi", "Chongqing", "Istanbul",
    "Buenos Aires", "Kolkata", "Lagos", "Kinshasa", "Manila", "Tianjin",
    "Guangzhou", "Rio de Janeiro", "Lahore", "Bangalore", "Moscow",
    "Shenzhen", "Chennai", "Bogota", "Jakarta", "Lima", "Bangkok",
    "Seoul", "Hyderabad", "London", "Tehran", "Chicago", "Chengdu",
    "Nanjing", "Wuhan", "Ho Chi Minh City", "Luanda", "Ahmedabad",
    "Kuala Lumpur", "Hong Kong", "Xian", "Dongguan", "Hangzhou",
    "Foshan", "Shenyang", "Riyadh", "Baghdad", "Santiago", "Surat",
    "Madrid", "Suzhou", "Pune", "Harbin", "Houston", "Dallas",
    "Toronto", "Dar es Salaam", "Miami", "Belo Horizonte", "Singapore",
    "Philadelphia", "Atlanta", "Fukuoka", "Khartoum", "Barcelona",
    "Johannesburg", "Saint Petersburg", "Qingdao", "Dalian",
    "Washington D.C.", "Yangon", "Alexandria", "Jinan", "Guadalajara",
    "Boston", "Melbourne", "Phoenix", "Nairobi", "Brasilia", "Cape Town",
    "Berlin", "Paris", "Rome", "Amsterdam", "Vienna", "Prague",
    "Budapest", "Warsaw", "Athens", "Dubai", "Copenhagen", "Stockholm",
    "Helsinki", "Lisbon", "Oslo", "Reykjavik", "Dublin", "Edinburgh",
    "New York", "Los Angeles", "San Francisco"
];

const faIcons = {
    "Clear": '<i class="fa-solid fa-sun"></i>',
    "Clouds": '<i class="fa-solid fa-cloud"></i>',
    "Rain": '<i class="fa-solid fa-cloud-rain"></i>',
    "Drizzle": '<i class="fa-solid fa-cloud-rain"></i>',
    "Thunderstorm": '<i class="fa-solid fa-cloud-bolt"></i>',
    "Snow": '<i class="fa-solid fa-snowflake"></i>',
    "Mist": '<i class="fa-solid fa-smog"></i>',
    "Haze": '<i class="fa-solid fa-smog"></i>',
    "Fog": '<i class="fa-solid fa-smog"></i>'
};

function getIcon(condition) {
    return faIcons[condition] || '<i class="fa-solid fa-cloud"></i>';
}

function setWeatherTheme(condition) {
    let bgColor = '#EBE0D4';
    let accentColor = '#DF5A52';

    switch (condition) {
        case 'Clear':
            bgColor = '#EBE0D4'; // Warm Sand
            accentColor = '#DF5A52'; // Sun Red
            break;
        case 'Clouds':
            bgColor = '#E4E5E6'; // Cool Grey
            accentColor = '#7B8C9A'; // Slate Blue
            break;
        case 'Rain':
        case 'Drizzle':
            bgColor = '#D5E1EA'; // Watery Blue
            accentColor = '#4A90E2'; // Deep Blue
            break;
        case 'Snow':
            bgColor = '#E8F0F2'; // Icy White
            accentColor = '#71B4CB'; // Frost Blue
            break;
        case 'Thunderstorm':
            bgColor = '#CFD4DC'; // Stormy Grey
            accentColor = '#594A70'; // Deep Purple
            break;
        default:
            bgColor = '#E6E4DD'; // Hazy Sand
            accentColor = '#A7A6A0'; // Haze Grey
            break;
    }

    // Update CSS Custom Properties. The transition applied to 'body' makes this smooth!
    rootEl.style.setProperty('--bg-color', bgColor);
    rootEl.style.setProperty('--accent-color', accentColor);
}

function autocomplete(inp, arr) {
    let currentFocus;
    inp.addEventListener("input", function (e) {
        let a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);

        let matches = 0;
        for (i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                if (matches > 10) break; // efficiency limiting DOM nodes
                matches++;
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });

    inp.addEventListener("keydown", function (e) {
        let x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1 && x) {
                x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        let x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    autocomplete(searchBar, cities);

    // Tab Efficiency: Event delegation pattern or simple iteration
    const tabs = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.forecast-panel');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-forecast`).classList.add('active');
        });
    });

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const city_name = searchBar.value.trim();
        if (!city_name) return;

        cityNameEl.innerText = "Searching...";
        stateNameEl.innerText = "";

        fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city_name}&limit=5&appid=${API_KEY}`)
            .then(res => res.json())
            .then(geoData => {
                if (geoData.length > 0) {
                    const { lat, lon } = geoData[0];
                    fetchWeather(lat, lon, geoData);
                } else {
                    cityNameEl.innerText = "City not found";
                }
            })
            .catch(err => {
                console.error(err);
                cityNameEl.innerText = "Error";
            });
    });

    // Auto-locate
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((success) => {
            let { latitude, longitude } = success.coords;
            fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`)
                .then(res => res.json())
                .then(geoData => {
                    fetchWeather(latitude, longitude, geoData);
                }).catch(() => fallbackWeather());
        }, () => fallbackWeather());
    } else {
        fallbackWeather();
    }
});

function fallbackWeather() {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=${API_KEY}`)
        .then(res => res.json())
        .then(geoData => {
            if (geoData.length > 0) {
                const { lat, lon } = geoData[0];
                fetchWeather(lat, lon, geoData);
            }
        });
}

function fetchWeather(lat, lon, geoData) {
    // Both fetches executed in parallel for better performance
    Promise.all([
        fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=imperial&appid=${API_KEY}`).then(r => r.json()),
        fetch(`https://api.ipgeolocation.io/timezone?apiKey=57636760429244f78be9410273312537&lat=${lat}&long=${lon}`).then(r => r.json()).catch(() => null)
    ]).then(([weatherData, locationData]) => {
        showWeatherData(weatherData, geoData, locationData);
    }).catch(err => {
        console.error("Failed fetching weather", err);
    });
}

function showWeatherData(data, geoData, locationData) {
    let { sunset, sunrise, dt } = data.current;
    let mainConditionObj = data.current.weather[0];
    let conditionMain = mainConditionObj.main; // "Clear", "Clouds", etc.
    let { temp, humidity, wind_speed } = data.current;
    let { name, state } = geoData[0];
    let timezone = data.timezone;
    let { max, min } = data.daily[0].temp;

    // Trigger Dynamic Theme Engine Feature based on current weather!!
    setWeatherTheme(conditionMain);

    let time_24 = locationData ? locationData.time_24 : moment(dt * 1000).format('HH:mm');
    let date_str = dt * 1000;

    cityNameEl.innerText = name;
    stateNameEl.innerText = state || geoData[0].country;
    dateEl.innerText = moment(date_str).format('dddd, MMMM D');
    timeEl.innerText = time_24;

    currentTempEl.innerHTML = `${Math.round(temp)}&deg;`;
    conditionEl.innerText = mainConditionObj.description;
    highLowEl.innerHTML = `H:${Math.round(max)}&deg; L:${Math.round(min)}&deg;`;

    const formatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric', minute: 'numeric', hour12: false, timeZone: timezone
    });

    // We can use document fragments or raw innerHTML. raw innerHTML is generally fast enough here.
    currentWeatherItemsEl.innerHTML = `
        <div class="weather-item">
            <i class="fa-solid fa-droplet"></i>
            <span>${humidity}%</span>
        </div>
        <div class="weather-item">
            <i class="fa-solid fa-wind"></i>
            <span>${wind_speed}mph</span>
        </div>
        <div class="weather-item">
            <i class="fa-solid fa-sun"></i>
            <span>${formatter.format(sunrise * 1000)}</span>
        </div>
        <div class="weather-item">
            <i class="fa-regular fa-moon"></i>
            <span>${formatter.format(sunset * 1000)}</span>
        </div>
    `;

    // Process arrays using map and join which is typically cleaner and fast.
    const hourlyItems = data.hourly.slice(1, 25).map(hour => {
        return `
            <div class="hourly-item">
                <div class="hourly-time">${formatter.format(hour.dt * 1000)}</div>
                <div class="weather-condition-icon">${getIcon(hour.weather[0].main)}</div>
                <div class="hourly-temp">${Math.round(hour.temp)}&deg;</div>
            </div>
        `;
    });
    hourlyForecastEl.innerHTML = hourlyItems.join('');

    const dailyItems = data.daily.slice(1, 8).map(day => {
        return `
            <div class="daily-item">
                <div class="daily-day">${moment(day.dt * 1000).format('dddd')}</div>
                <div class="weather-condition-icon">${getIcon(day.weather[0].main)}</div>
                <div class="daily-temp">${Math.round(day.temp.day)}&deg;</div>
            </div>
        `;
    });
    dailyForecastEl.innerHTML = dailyItems.join('');
}
