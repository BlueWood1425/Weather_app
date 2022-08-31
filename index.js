function formatDate(date) {
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let hours = now.getHours();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let currentDay = days[now.getDay()];
  let time = document.querySelector(`#time`);
  time.innerHTML = ` ${currentDay} ${hours} : ${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2 card mini" style="height: 150px; width: 150px; margin-left: 30px;">
          <h3>
            ${formatDay(forecastDay.dt)}
            <div class="mini">
              <img 
              src="http://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png"
              alt="iconWeather"
              id="icon"
              class="picture, smallPicture"
            >
            </div>
            <span class="weather-forecast-temperatur-max">${Math.round(
              forecastDay.temp.max
            )}</span>
            /
            <span class="weather-forecast-temperatur-min">${Math.round(
              forecastDay.temp.min
            )}</span>
          </h3>
        </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function temp(response) {
  let location = document.querySelector(`.location`);
  let temperatureL = document.querySelector(`.temperatyreL`);
  let temperature = Math.round(response.data.main.temp);
  location.innerHTML = `${response.data.name}`;
  temperatureL.innerHTML = `${temperature}`;
}

function handlePosition(position) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(temp);
}

function geolocationPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(handlePosition);
}

let geolocationClick = document.querySelector(`#geolocationButton`);
geolocationClick.addEventListener("click", geolocationPosition);

let now = new Date();

formatDate();

function search(event) {
  event.preventDefault();
  let cityForm = document.querySelector("#cityForm");
  let city = document.querySelector("#city");
  city.innerHTML = `${cityForm.value}`;
}

function geolocation(event) {
  event.preventDefault();
  let cityForm = document.querySelector("#cityForm");
  let city = document.querySelector("#city");
  city.innerHTML = `${cityForm.value}`;
}

let searchForm = document.querySelector("#searching");
searchForm.addEventListener("submit", search);

//////////////////////////////////////

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperature = document.querySelector(".temperatyreL");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperature.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperature = document.querySelector(".temperatyreL");
  temperature.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let fahrenheitLink = document.querySelector(`#F`);
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector(`#C`);
celsiusLink.addEventListener("click", displayCelsiusTemperature);

//////////////////////////////////////

function getForecast(coordinates) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=f4db6aa7e5cfe4049fcbfe96c0455ba9&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeatherCondition(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#math").innerHTML = Math.round(
    response.data.main.temp
  );
  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = response.data.weather[0].description;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  celsiusTemperature = response.data.main.temp;

  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#cityForm").value;
  searchCity(city);
}

let searchingForm = document.querySelector("#searching");
searchingForm.addEventListener("submit", handleSubmit);

searchCity("Kyiv");
displayForecast();
