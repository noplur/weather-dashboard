// to be executed upon a form submission browser event

var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var cityNameSearchTerm = document.querySelector('#repo-search-term');
var cityWeatherContainerEl = document.querySelector('#repos-container');

var formSubmitHandler = function(event) {
  // prevent page from refreshing
      event.preventDefault();

// get value from input element
var cityName = nameInputEl.value.trim();

if (cityName) {
  getCityWeather(cityName);

  // clear old content
  cityWeatherContainerEl.textContent = "";
  nameInputEl.value = "";
} else {
  alert("Please enter a city");
}
};

var getCityWeather = function(cityName) {
      // format the Open Weather api url
      var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIkey;
  
      // make a request to the url
    fetch(apiUrl)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        response.json().then(function(data) {
          displayCityWeather(data, user);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function(error) {
      // Notice this `.catch()` getting chained onto the end of the `.then()` method
      alert("Unable to connect to Open Weather");
    });
  };

// function to display city weather

var displayCityWeather = function(cityWeather, searchTerm) {

  // check if api returned any repos
if (cityWeather.length === 0) {
  cityWeatherContainerEl.textContent = "No cities found.";
  return;
}
  console.log(cityWeather);
  console.log(searchTerm);

cityNameTerm.textContent = searchTerm;

// loop over weather for each city
for (var i = 0; i < cityWeather.length; i++) {
  // format city name
  var cityName = cityWeather[i].owner.login + "/" + cityWeather[i].name;

  // create a container for each weather for city
  var cityWeatherEl = document.createElement("div");
  cityWeatherEl.classList = "list-item flex-row justify-space-between align-center";

  // create a span element to hold city name
  var titleEl = document.createElement("span");
  titleEl.textContent = cityName;

  // append to container
  cityWeatherEl.appendChild(titleEl);

// create a status element
var statusEl = document.createElement("span");
statusEl.classList = "flex-row align-center";

// check if current city weather has issues or not
if (cityWeather[i].open_issues_count > 0) {
  statusEl.innerHTML =
    "<i class='fas fa-times status-icon icon-danger'></i>" + cityWeather[i].open_issues_count + " issue(s)";
} else {
  statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
}

// append to container
cityWeatherEl.appendChild(statusEl);

// append container to the dom
cityWeatherContainerEl.appendChild(cityWeatherEl);
}
};
// add event listeners to forms

userFormEl.addEventListener("search", formSubmitHandler);