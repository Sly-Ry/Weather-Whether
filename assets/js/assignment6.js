var apiKey = ["2632ab542fff737012a28d74931b6af5"];
var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#search-npt");
var wCurrentEl = document.querySelector("#w-current");
var wCastEl = document.querySelector("#weekly-cast");

var formSubmitHandler = function(event) {
    event.preventDefault();

    // get value from input element
    var cityName = cityInputEl.value.trim();

    if (cityName) {
        getLatLon(cityName);
        cityInputEl = "";
    }
    else {
        alert("Please enter the name of a city.");
    }
};

// gets the lat and lon coordinates in order to find city
var getLatLon = function(cityName) {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + apiKey;

    fetch(apiUrl)
    .then(function(response) {                     
        response.json().then(function(data) {
           getCityWeather(data[0].lat, data[0].lon);

           var NameEl = document.createElement("h2");
           NameEl.classList = "city-name"
           NameEl.textContent = data[0].name + ", " + data[0].state;
           wCurrentEl.append(NameEl)

        });
    })
    .catch (function(error){
        alert("Unable to connect to source")
    });
    
};

// gets weather for search city
var getCityWeather = function(lat, lon) {
    var wApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&units=imperial&appid=" + apiKey;
    
    fetch(wApiUrl)
    .then(function(response) {                     
        response.json().then(function(data) {
            displayWeather(data);
            console.log(data.daily);
        });
    })
    .catch (function(error){
        alert("Unable to connect to source")
    });
};

userFormEl.addEventListener("submit", formSubmitHandler);

var displayWeather = function(data) {
    console.log(data.current);
    console.log(data.current.weather[0].description);

    // create variables using weather data
    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + data.current.temp + "";
    wCurrentEl.append(tempEl);

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + data.current.humidity + "%";
    wCurrentEl.append(humidityEl);

    var wSpeedEl = document.createElement("p");
    wSpeedEl.textContent = "Wind: " + data.current.wind_speed + " MPH";
    wCurrentEl.append(wSpeedEl);

    var uviEl = document.createElement("p");
    uviEl.classList = "success";
    uviEl.textContent = "UVI Index: " + data.current.uvi;
    wCurrentEl.append(uviEl);

    for (var i = 0; i < 5; i++) {
        var dailyCard = document.createElement("div");
        dailyCard.classList = "card col-2 p-1";
        wCastEl.append(dailyCard);

        // data[i].daily.

        var dTempEl = document.createElement("p");
        dTempEl.textContent = "Temp: " + data.daily[i].temp.day + "";
        dailyCard.append(dTempEl);

        var wSpeedEl = document.createElement("p");
        wSpeedEl.textContent = "Wind: " + data.current.wind_speed + " MPH";
        wCurrentEl.append(wSpeedEl);

        var humidityEl = document.createElement("p");
        humidityEl.textContent = "Humidity: " + data.current.humidity + "%";
        wCurrentEl.append(humidityEl);
    }

};

formSubmitHandler();