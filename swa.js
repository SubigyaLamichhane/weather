// const city = localStorage.getItem("city");
// console.log("---city", city);

// searchInputBox2.value = "Kathmandu";

// JavaScript code goes here
document.addEventListener("DOMContentLoaded", function () {
  // Code that runs after the DOM is fully loaded
  console.log("loaded");
  // var heading = document.querySelector("h1");
  // heading.style.color = "blue";
  // const city = localStorage.getItem("city");
});

//making object of weatherapi
const weatherApi = {
  key: "ae12172090aa850cf6b4e802695c1730",
  baseUrl: "https://api.openweathermap.org/data/2.5/weather",
};

//anonymous function
let searchInputBox = document.getElementById("input-box");
let outputField = document.getElementById("output-field");
let searchButton = document.getElementById("search-button");

// Add event listeners for search input boxes and button
searchInputBox.addEventListener("input", () => {
  outputField.value = searchInputBox.value;
});

searchInputBox.addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    // console.log("getting data from api");
    getWeatherReport(searchInputBox.value);
    localStorage.setItem("city", searchInputBox.value);
  }
});

outputField.addEventListener("input", () => {
  searchInputBox.value = outputField.value;
});

searchButton.addEventListener("click", () => {
  if (searchInputBox.value.trim() === "") {
    alert("No city entered.");
  } else if (!isValidCity(searchInputBox.value)) {
    alert("Invalid city name.");
  } else {
    // console.log("getting data from api");
    getWeatherReport(searchInputBox.value);
    // console.log(searchInputBox.value);
    localStorage.setItem("city", searchInputBox.value);
  }
});

function isValidCity(city) {
  const minLength = 4;
  const maxLength = 50;
  const trimmedCity = city.trim();
  return trimmedCity.length >= minLength && trimmedCity.length <= maxLength;
}

//get weather report
function getWeatherReport(city) {
  console.log("Getting Weather Report from the API... for city:", city);
  fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const dataInString = JSON.stringify(data);
      localStorage.setItem("weather-data", dataInString);
      showWeaterReport(data);
      // localStorage.set("weather")
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      // Handle the error here, e.g., display an error message to the user
    });
}

//show weather report
function showWeaterReport(weather) {
  let cityCode = weather.cod;
  if (cityCode === "404") {
    alert("Empty Input: Please enter any city");
    reset();
  } else if (cityCode === "200") {
    alert("City Not Found: The entered city was not found");
    reset();
  } else {
    let op = document.getElementById("weather-body");
    op.style.display = "block";
    let todayDate = new Date();
    let parent = document.getElementById("parent");
    let weather_body = document.getElementById("weather-body");
    weather_body.innerHTML = `
            <div class="location-deatils">
                <div class="city" id="city">${weather.name}, ${
      weather.sys.country
    }</div>
                <div class="date" id="date"> ${dateManage(todayDate)}</div>
            </div>
            <div class="weather-status">
                <div class="temp" id="temp">${Math.round(
                  weather.main.temp
                )}&deg;C</div>
                <div class="weather" id="weather">${
                  weather.weather[0].main
                } <i class="${getIconClass(weather.weather[0].main)}"></i></div>
                <div class="min-max" id="min-max">${Math.floor(
                  weather.main.temp_min
                )}&deg;C (min) / ${Math.ceil(
      weather.main.temp_max
    )}&deg;C (max)</div>
                <div id="updated_on">Time: ${getTime(todayDate)}</div>
            </div>
            <hr>
            <div class="day-details">
                <div class="basic">Temperature ${
                  weather.main.feels_like
                }&deg;C | Humidity ${weather.main.humidity}%<br>Pressure ${
      weather.main.pressure
    } mb | Wind ${weather.wind.speed} KMPH</div>
            </div>
            `;
    parent.append(weather_body);
    changeBg(weather.weather[0].main);
    reset();
  }
}

//making a function for the last updated current time
function getTime(todayDate) {
  let hour = addZero(todayDate.getHours());
  let minute = addZero(todayDate.getMinutes());
  return `${hour}:${minute}`;
}

//date manage for returning current date
function dateManage(dateArg) {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let year = dateArg.getFullYear();
  let month = months[dateArg.getMonth()];
  let date = dateArg.getDate();
  return `${date} ${month}, ${year}`;
}

//making a function for the classname of the icon
function getIconClass(classarg) {
  if (classarg === "Rain") {
    return "fas fa-cloud-showers-heavy";
  } else if (classarg === "Clouds") {
    return "fas fa-cloud";
  } else if (classarg === "Clear") {
    return "fas fa-cloud-sun";
  } else if (classarg === "Snow") {
    return "fas fa-snowman";
  } else if (classarg === "Sunny") {
    return "fas fa-sun";
  } else if (classarg === "Mist") {
    return "fas fa-smog";
  } else if (classarg === "Thunderstorm" || classarg === "Drizzle") {
    return "fas fa-thunderstorm";
  } else {
    return "fas fa-cloud-sun";
  }
}

/// Declare a flag to track whether weather data is displayed
let weatherDataDisplayed = false;

// Initialize the weather data on page load
function initializeWeather() {
  if (!weatherDataDisplayed) {
    const city = localStorage.getItem("city");
    if (city) {
      searchInputBox.value = city;
      if (navigator.online) {
        getWeatherReport(localStorage.getItem("city"));
      } else {
        const weatherData = localStorage.getItem("weather-data");
        if (weatherData) {
          console.log(
            "No internet connection. Pulling old data from local storage..."
          );
          showWeaterReport(JSON.parse(weatherData));
        }
      }
    } else {
      console.log("No previous data found.");
    }
    // Fetch default weather report
    weatherDataDisplayed = true; // Set the flag to true after fetching the initial weather
  }
}

// Call the initialization function
initializeWeather();

// Button click event listener
searchButton.addEventListener("click", (event) => {
  event.preventDefault();
  console.log("Button clicked");
  if (!weatherDataDisplayed) {
    console.log("Fetching weather data...");
    getWeatherReport(searchInputBox.value);
    weatherDataDisplayed = true;
  }
});

function reset() {
  let input = document.getElementById("input-box");
  input.value = "";
}

// function to add zero if hour and minute are less than 10
function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
