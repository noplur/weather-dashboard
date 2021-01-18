// global variables to be executed upon a form submission browser event

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

    // clear old search (city name) content

    cityNameEl.value = "";

    // alert when a city name is not typed in

    } else {

    alert("Please enter a city");

    }
};

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

        // if invalid city name is typed into search bar
        } else {
        alert("Error: " + response.statusText);

        // removes city name from city history list if invalid city name is typed into search bar
        var listGroup = document.querySelector(".list-group-item");
        
        listGroup.style.display = 'none';
        }

     })
    .then(function(response) {

      // clears current-weather div class so elements will not repeat when another city name is enterred.

      var currentWeatherContainerEl = document.querySelector('.current-weather');
      currentWeatherContainerEl.innerHTML = '';

    })
    .catch(function(error) {
      // alert if there is an error with fetch
      alert("Unable to connect to Open Weather");
    });
  };

// function to display current city weather
var displayCityWeather = function(data, city) {
  console.log(data)

  // adds classes and text for display:
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

  // append city name, temperature, humidity and wind to display on page, append weather icon to title

  title.append(icon)
  weather.append(title)
  weather.append(temperature)
  weather.append(humidity)
  weather.append(wind)

  // run function to display UV-index
  displayUVIndex(data.coord.lat,data.coord.lon)
};

// function for displaying UV-Index
var displayUVIndex = function (lat, lon) {

  // format the Open Weather api url
  fetch(`https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${APIkey}`)

    .then(function(response) {
      // return the response as JSON
      return response.json()
    })
    // function for what to do with UV-Index data
    .then(function(data) {
      console.log(data)
      // add a class to the UV-Index data
      var UVtext = $("<p>").addClass("card-text").text("UV Index: " )
      // add a non-clickable button for the UV-Index for color indicator
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
  } 
})
  .then(function(response) {

  // clears future-weather div class so elements will not repeat when another city name is enterred. 

  var forecastContainerEl = document.querySelector('.future-weather');
  forecastContainerEl.innerHTML = '';
  
})
  .catch(function(error) {
  // alert if there is an error with fetch
  alert("Unable to connect to Open Weather");
});
};

var displayForecastWeather = function(data, city) {
  console.log(data)

  // add 5-Day Forecast title when city name is enterred. Title includes h3 header and takes up entire row within card

  var forecastTitle = $("<h3>").addClass("forecast-title").attr("class", "col-12 col-md-12 mb-3").text("5-Day Forecast:");
  $(".row").append(forecastTitle);

    // displays 5 separate columns
    for (i = 0; i < 5; i++) {

    // creates the columns with royal blue background
    var newCard = $("<div>").attr("class", "col-12 col-md-2 five-day bg-primary text-white rounded-lg p-2");
    $(".future-weather").append(newCard);

  // display future date
  // display icon representation of future weather conditions
  // display future temperature
  // display future humidity

  var title = $("<h4>").addClass("card-header").text(`${moment().add(i + 1, "days").format("M/D/YYYY")}`)
  var temperature = $("<p>").addClass("card-text").text("Temp: " + data.list[0 + i].main.temp +" °F")
  var humidity = $("<p>").addClass("card-text").text("Humidity: " + data.list[0 + i].main.humidity+"%")
  var icon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.list[0 + i].weather[0].icon + ".png")

  // append city name, future temperature and future humidity to display on page
  title.append(icon)
  newCard.append(title)
  newCard.append(temperature)
  newCard.append(humidity)
  }
};

// function to make list of city search history
function cityHistory () {

  // get value from input element

  var cityName = cityNameEl.value.trim();

  // give <li> a class name

  var listItem = $("<li>").addClass("list-group-item list-group-item-action").text(cityName);

  // prepend listItem to city-list class to display on page

  $(".city-list").prepend(listItem);

  }

// searched cities buttons event listener

$(".city-list").click(function(event) {

  // prevent page from refreshing

  event.preventDefault();

  // targets the cityname text element
  $("#cityname").val(event.target.textContent);
  
  // restarts function to get function to get current weather and 5-day forecast
  formSubmitHandler(event);

  // removes city name from search history so it is not repeated

  var listGroup = document.querySelector(".list-group-item");
        
  listGroup.style.display = 'none';
  
});

// add event listener to forms

userFormEl.addEventListener("submit", formSubmitHandler);