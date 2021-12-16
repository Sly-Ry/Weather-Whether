var apiKey = ["2632ab542fff737012a28d74931b6af5"];
var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#search-npt")
var wContainerEl = document.querySelector(".w-container");


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
           console.log(data);
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
            console.log(data.current);
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
    
    // var nameEl  = document.createElement("h3")
    // nameEl.classList = "city-name"
    // nameEl.textContent = cityName;
    // wContainerEl.append(nameEl);

    // create variables using weather data
    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + data.current.temp + "";
    wContainerEl.append(tempEl);

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + data.current.humidity + "%";
    wContainerEl.append(humidityEl);

    var wSpeedEl = document.createElement("p");
    wSpeedEl.textContent = "Wind: " + data.current.wind_speed + " MPH";
    wContainerEl.append(wSpeedEl);

    var uviEl = document.createElement("p");
    uviEl.classList = "success";
    uviEl.textContent = "UVI Index: " + data.current.uvi;
    wContainerEl.append(uviEl);

};

formSubmitHandler();