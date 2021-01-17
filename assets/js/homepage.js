// to be executed upon a form submission browser event

var userFormEl = document.querySelector("#user-form");
var cityNameEl = document.querySelector("#cityname");
var cityWeatherContainerEl = document.querySelector("#city-list");
var currentWeatherContainerEl = document.querySelector("current-weather");
var forecastContainerEl = document.querySelector("future-weather");
var APIkey = "d32377506e56284db17e72a06db9c9d8";



// function for search bar

var formSubmitHandler = function(event) {
  // prevent page from refreshing
      event.preventDefault();

// get value from input element
var cityName = cityNameEl.value.trim();

// functions to call when a city name is enterred

if (cityName) {
  getCityWeather(cityName);
  getForecastWeather(cityName);  
  cityHistory ();

  // clear old content

  cityNameEl.value = "";

  // alert when a city name is not typed in

} else {
  alert("Please enter a city");
}
};

// function to make list of city search history
function cityHistory () {

  // get value from input element

  var cityName = cityNameEl.value.trim();

  // give <li> a class name

  var listItem = $("<li>").addClass("list-group-item").text(cityName);

    // append listItem to city-list class to display on page

    $(".city-list").append(listItem);
  
}

// searched cities buttons event listener

$(".city-list").on("click", (event) => {

  // prevent page from refreshing

  event.preventDefault();

  // targets the cityname text element
  $("#cityname").val(event.target.textContent);
  
  // restarts function to get function to get current weather and 5-day forecast
  formSubmitHandler(event);
});

// function to get current weather for a city

var getCityWeather = function(cityName) {
      // format the Open Weather api url
      var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIkey + "&units=imperial";
  
      // make a request to the url
    fetch(apiUrl)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        response.json().then(function(data) {
          displayCityWeather(data, cityName);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .then(function(response) {
      var currentWeatherContainerEl = document.querySelector('.current-weather');
      currentWeatherContainerEl.innerHTML = '';
    })
    .catch(function(error) {
      // Notice this `.catch()` getting chained onto the end of the `.then()` method
      alert("Unable to connect to Open Weather");
    });
  };

// function to display current city weather
var displayCityWeather = function(data, city) {
  console.log(data)

  // display city name
  // display current time
  // display icon representation of weather conditions
  // display temperature
  // display humidity 
  // display wind speed

  var weather = $(".current-weather")
  var title = $("<h3>").addClass("card-header").text(`${data.name} (${moment().format('l')})`)
  var temperature = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp +" °F")
  var humidity = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity+"%")
  var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH")
  var icon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png")

  // append city name, temperature, humidity and wind to display on page
  title.append(icon)
  weather.append(title)
  weather.append(temperature)
  weather.append(humidity)
  weather.append(wind)

  // display UV-index
  displayUVIndex(data.coord.lat,data.coord.lon)
};

// function for UV-Index
var displayUVIndex = function (lat, lon) {
  fetch(`http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${APIkey}`)
    .then(function(response) {
      return response.json()
    })
    .then(function(data) {
      console.log(data)
      var UVtext = $("<p>").addClass("card-text").text("UV Index: " )
      var UVIndex = $("<button>").addClass("btn btn-sm").text(data.value)

      // color that indicates whether the UV-index is favorable (1-2), moderate (3-7), or severe (8+)
      if (data.value <3) {
        UVIndex.addClass("btn-success")
      }
      else if (data.value <8) {
        UVIndex.addClass("btn-warning")
      }
      else {
        UVIndex.addClass("btn-danger")
      }

      // append UV-Index to display on page
    UVtext.append(UVIndex)
    $(".current-weather").append(UVtext)
    });
  
};

// function for 5-day forcast for a city  *** need to loop 5 day forecast ***

var getForecastWeather = function(cityName) {
  // format the Open Weather api url
  var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIkey + "&units=imperial";

  // make a request to the url
fetch(apiUrl)
.then(function(response) {
  // request was successful
  if (response.ok) {
    response.json().then(function(data) {
      displayForecastWeather(data, cityName);
    });
  } else {
    alert("Error: " + response.statusText);
  }
})
.then(function(response) {
  var forecastContainerEl = document.querySelector('.future-weather');
  forecastContainerEl.innerHTML = '';
})
.catch(function(error) {
  // Notice this `.catch()` getting chained onto the end of the `.then()` method
  alert("Unable to connect to Open Weather");
});
};

var displayForecastWeather = function(data, city) {
  console.log(data)

    // displays 5 separate columns
  for (i = 0; i < 5; i++) {

    // creates the columns
    var newCard = $("<div>").attr("class", "col-12 col-md-2 five-day bg-primary text-white rounded-lg p-2");
    $(".future-weather").append(newCard);

  // display date
  // display icon representation of weather conditions
  // display temperature
  // display humidity

  var title = $("<h4>").addClass("card-header").text(`${moment().add(i + 1, "days").format("M/D/YYYY")}`)
  var temperature = $("<p>").addClass("card-text").text("Temperature: " + data.list[0 + i].main.temp +" °F")
  var humidity = $("<p>").addClass("card-text").text("Humidity: " + data.list[0 + i].main.humidity+"%")
  var icon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.list[0 + i].weather[0].icon + ".png")

  // append city name, temperature, humidity and wind to display on page
  title.append(icon)
  newCard.append(title)
  newCard.append(temperature)
  newCard.append(humidity)
  }
};


// function to list search history

// function to get current weather when user clicks on city in search history <list-group-item>


// add event listeners to forms

userFormEl.addEventListener("submit", formSubmitHandler);