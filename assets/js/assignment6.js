var userFormEl = document.querySelector("#user-form");
var searchColEl = document.querySelector("#search-col")
var cityInputEl = document.querySelector("#search-npt");
var wCurrentEl = document.querySelector("#w-current");
var dailyHeadEl = document.querySelector("#daily-head");
var wCastEl = document.querySelector("#weekly-cast");   

// array for saving city searches
var search = [];

var today = new Date(); 

var date = (today.getMonth()+1) +'/'+ today.getDate() + '/' + today.getFullYear();

var formSubmitHandler = function(e) {
    // event.preventDefault();
    e.preventDefault();
    // console.log(e.value);
    
    // clear input area
    wCurrentEl.innerHTML = "";
    dailyHeadEl.textContent = "";
    wCastEl.textContent = "";
    
    // get value from input element
    var cityName = cityInputEl.value.trim();

    if (cityName) {
        getLatLon(cityName);
        cityInputEl.value = "";
    }
    else {
        alert("Please enter the name of a city.");
    }

    
};

// gets the lat and lon coordinates in order to find city
var getLatLon = function(cityName) {
    
    // var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + 
    
    
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&limit=1&appid=2632ab542fff737012a28d74931b6af5";
    // console.log(apiUrl);

    fetch(apiUrl)
    .then (function (response) {                     
        response.json()
        .then(function(data) {
            // console.log(data)
                getCityWeather(data.coord.lat, data.coord.lon);
            
                var sNameEl = document.createElement("button");
                sNameEl.classList = "col-9 btn-info rounded";
                sNameEl.textContent = data.name;
                
                search.push(sNameEl.textContent);
                saveCity();
                
                searchColEl.append(sNameEl);

                var NameEl = document.createElement("h2");
                NameEl.classList = "city-name pb-3"
                NameEl.textContent = data.name + " (" + date + ")";
                wCurrentEl.append(NameEl);

                var dailyTitle = document.createElement("h4");
                dailyTitle.textContent = "5-Day Forecast:";
                dailyHeadEl.append(dailyTitle);
        });
    })
    .catch (function(error){
        if( error){
        alert("Unable to connect to source")}
    });
    
};

// gets weather for search city
var getCityWeather = function(lat, lon) {
    
    var wApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&units=imperial&appid=2632ab542fff737012a28d74931b6af5";
    
    fetch(wApiUrl)
    .then(function(response) {                     
        response.json().then(function(data) {
            displayWeather(data);
            // console.log(data.daily);
        });
    })
    .catch (function(error){
        alert("Unable to connect to source")
    });
};

// click button function
userFormEl.addEventListener("submit", formSubmitHandler);

// 
var displayWeather = function(data) {

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
    uviEl.classList = "";
    uviEl.textContent = "UVI Index: " + data.current.uvi;
    wCurrentEl.append(uviEl);

    for (var i = 0; i < 5; i++) {
        
        var dailyCard = document.createElement("div");
        dailyCard.classList = "card col-2 bg-primary text-light h-150 p-1 shadow p-3 mb-5 bg-body rounded"
        dailyCard.style = "--bs-bg-opacity: .5";
        wCastEl.append(dailyCard);

        // data[i].daily.
        
        var dateEl = (today.getMonth()+1) +'/'+ (today.getDate() + 1 + i) + '/' + today.getFullYear();
        dailyCard.append(dateEl);

        var wIconEl = document.createElement("h3");
        dailyCard.append(wIconEl);
        
        // var getIcon = function() {
        //     if (data.current.weather[0].main === "Clouds") {
        //         return "<i class='bi bi-brightness-high'></i>";
        //     }
        //     else if (data.current.weather[0].main === "Thunderstorm") {
        //         return "<i class='bi bi-brightness-high'></i>";
        //     }
        //     else if (data.current.weather[0].main === "Rain") {
        //     }
            
        //     wIconEl.append(getIcon());
        // };
        
        dailyCard.append(wIconEl);

        var dTempEl = document.createElement("h7");
        dTempEl.classList = "p-2"
        dTempEl.textContent = "Temp: " + data.daily[i].temp.day + "";
        dailyCard.append(dTempEl);

        var dSpeedEl = document.createElement("h7");
        dSpeedEl.classList = "p-2"
        dSpeedEl.textContent = "Wind: " + data.daily[i].wind_speed + " mph";
        dailyCard.append(dSpeedEl);

        var dHumidityEl = document.createElement("h7");
        dHumidityEl.classList = "p-2"
        dHumidityEl.textContent = "Humidity: " + data.daily[i].humidity + "%";
        dailyCard.append(dHumidityEl);
    }

};

// saves the info to localstorage (-- T.A. Queen helped with this)
var saveCity = function() {
    localStorage.setItem("city", JSON.stringify(search));
};

// loads cities to page (-- T.A. Queen helped with this)
var loadCity = function() {
    // get city items from localstorage
    var savedSearch = localStorage.getItem("city");

    // converts string format back to an array
    savedSearch = JSON.parse(savedSearch);

    for (i = 0; i < savedSearch.length; i++) {
        var sNameEl = document.createElement("button");
        sNameEl.classList = "col-9 btn-info rounded";
        sNameEl.textContent = savedSearch[i];
        
        searchColEl.append(sNameEl);
    }
};

loadCity();