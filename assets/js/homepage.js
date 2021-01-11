  var getCityWeather = function(cityName) {
      // format the Open Weather api url
      var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIkey;
  
      // make a request to the url
        fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
          console.log(data);
        });
      });
    };