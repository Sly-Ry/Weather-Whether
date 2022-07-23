// variable to store searched city
var city = '';

// variable declaration
var searchCity = $('#search-city');
var searchBtn = $('#search-button');
var clearBtn = $('#clear-history');
var currentCity = $('#current-city');
var currentTemperature = $('#temperature');
var currentHumidity = $('#humidity');
var currentWindSpeed = $('#wind-speed');
var currentUVIndex = $('#uv-index');

// array for saving city searches
var savedC = [];

// checks localstorage for prior city searches
function search(c){
    for(var i=0; i < savedC.length; i++){
        if (c.toUpperCase()===savedC[i]){
            return -1;
        }
    }
    return 1;
}

var APIKey = '2632ab542fff737012a28d74931b6af5';

// display weather for searched city 
function displayWeather(e){
    e.preventDefault();

    if (searchCity.val().trim() !== ''){
        city = searchCity.val().trim();

        console.log(city);

        currentWeather(city)
    }
} 

function currentWeather(city){
    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&APPID=' + APIKey;

    $.ajax({
        url: queryURL,
        method: 'GET'
    })
    .then(function(response){
        console.log(response);

        var weatherIcon = response.weather[0].icon;
        
        var iconURL='https://openweathermap.org/img/wn/' + weatherIcon +'@2x.png';

        var date = new Date(response.dt*1000).toLocaleString();

        $(currentCity).html(response.name + '(' + date + ')' + '<img src = ' + iconURL +'>');

        // parse response to display current temp
        // convert temp to fahrenheit
        var tempF = (response.main.temp - 273.15) * 1.80 + 32

        $(currentTemperature).html((tempF).toFixed(2) + '&#8457');

        // display humidity
        $(currentHumidity).html(response.main.humidity + '%');

        // display wind speed and convert to MPH
        var ws = response.wind.speed;
        var windsMPH = (ws * 2.237).toFixed(1);

        $(currentWindSpeed).html(windsMPH + 'MPH')

        // display UV index
        UVIndex(response.coord.lon, response.coord.lat);
        
        forecast(response.id);
        
        if (response.cod == 200){
            savedC = JSON.parse(localStorage.getItem('cityname'));
            
            console.log(savedC);

            if (savedC == null){
                savedC = [];
                savedC.push(city.toUpperCase());

                localStorage.setItem('cityname', JSON.stringify(savedC));

                addCity(city);
            } else {
                if (search(city) > 0){
                    savedC.push(city.toUpperCase());
                    
                    localStorage.setItem('cityname', JSON.stringify(savedC));

                    addCity(city);
                }
            }
        }
    });
}

// returns the UVIndex response
function UVIndex(ln, lt){
    // url for UVIndex
    var uvURL = 'https://api.openweathermap.org/data/3.0/onecall?lat=' + lt + '&lon=' + ln + '&appid=' + APIKey

    $.ajax({
        url: uvURL,
        method: 'GET',
    }).then(function(response){
        $(currentUVIndex).html(response.value);
    });
}

// display 5 day forecast for current city
function forecast(cityId){
    var weekly = false;
    var queryForecastURL = 'https://api.openweathermap.org/data/3.0/forecast?id=' + cityId + '&appid=' + APIKey;

    $.ajax({
        url: queryForecastURL,
        method: 'GET'
    }).then(function(response){
        for(i=0; i<5; i++){
            var date = new Date((response.list[((i+1) * 8) - 1].dt) * 1000).toLocaleDateString();
            var forecastIcon = response.list[((i+1) * 8) - 1].weather[0].icon;
            var iconURL = 'https://openweathermap.org/img/wn/' + forecastIcon+'@2x.png';
            
            // pulls temp from API (Kelvin)
            var tempKelv = response.list[((i+1) * 8) - 1].main.temp;

            // convert temp from Kelvin to Fahrenheit
            var tempFahr = (((tempKelv - 273.5) * 1.80) + 32).toFixed(2);
            
            var humidity = response.list[((i+1) * 8) - 1].main.humidity;


            $('#fDate'+i).html(date);
            $('#fImg'+i).html('<img src=' + iconURL + '>');
            $('#fTemp'+i).html(tempFahr + '&#8457');
            $('#fHumidity'+i).html(humidity + '%');
        }
    });
}

// dynamically add city to search history

// Search history click search
function pastSearch(event){
    var liEl = event.target;
    if (event.target.matches("li")){
        city=liEl.textContent.trim();
        
        currentWeather(city);
    }
}

// Load City 
function loadlastCity(){
    $('ul').empty();
    
    var savedC = JSON.parse(localStorage.getItem('cityname'));
    
    if (savedC !== null){
        savedC=JSON.parse(localStorage.getItem('cityname'));
        
        for(i=0; i<savedC.length;i++){
            addToList(savedC[i]);
        }

        city = savedC[i-1];
        
        currentWeather(city);
    }
}

function clearHistory(event){
    event.preventDefault();
    savedC = [];
    localStorage.removeItem('cityname');
    document.location.reload();
}

// Click Handlers
$('#search-button').on('click', displayWeather);
$(document).on('click', pastSearch);
$(window).on('load', loadlastCity);
$('#clear-history').on('click', clearHistory);




// 
// gets the lat and lon coordinates in order to find city
// var getLatLon = function(cityName) {
    
//     // var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + 
    
    
//     var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&limit=1&appid=2632ab542fff737012a28d74931b6af5";
//     // console.log(apiUrl);

//     fetch(apiUrl)
//     .then (function (response) {                     
//         response.json()
//         .then(function(data) {
//             // console.log(data)
//                 getCityWeather(data.coord.lat, data.coord.lon);
            
//                 var sNameEl = document.createElement("button");
//                 sNameEl.classList = "col-9 btn-info rounded";
//                 sNameEl.textContent = data.name;
                
//                 search.push(sNameEl.textContent);
//                 saveCity();
                
//                 searchColEl.append(sNameEl);

//                 var NameEl = document.createElement("h2");
//                 NameEl.classList = "city-name pb-3"
//                 NameEl.textContent = data.name + " (" + date + ")";
//                 wCurrentEl.append(NameEl);

//                 var dailyTitle = document.createElement("h4");
//                 dailyTitle.textContent = "5-Day Forecast:";
//                 dailyHeadEl.append(dailyTitle);
//         });
//     })
//     .catch (function(error){
//         if( error){
//         alert("Unable to connect to source")}
//     });
    
// };

// // gets weather for search city
// var getCityWeather = function(lat, lon) {
    
//     var wApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&units=imperial&appid=2632ab542fff737012a28d74931b6af5";
    
//     fetch(wApiUrl)
//     .then(function(response) {                     
//         response.json().then(function(data) {
//             displayWeather(data);
//             // console.log(data.daily);
//         });
//     })
//     .catch (function(error){
//         alert("Unable to connect to source")
//     });
// };

// // click button function
// userFormEl.addEventListener("submit", formSubmitHandler);

// // 
// var displayWeather = function(data) {

//     // create variables using weather data
//     var tempEl = document.createElement("p");
//     tempEl.textContent = "Temp: " + data.current.temp + "";
//     wCurrentEl.append(tempEl);

//     var humidityEl = document.createElement("p");
//     humidityEl.textContent = "Humidity: " + data.current.humidity + "%";
//     wCurrentEl.append(humidityEl);

//     var wSpeedEl = document.createElement("p");
//     wSpeedEl.textContent = "Wind: " + data.current.wind_speed + " MPH";
//     wCurrentEl.append(wSpeedEl);

//     var uviEl = document.createElement("p");
//     uviEl.classList = "";
//     uviEl.textContent = "UVI Index: " + data.current.uvi;
//     wCurrentEl.append(uviEl);

//     for (var i = 0; i < 5; i++) {
        
//         var dailyCard = document.createElement("div");
//         dailyCard.classList = "card col-2 bg-primary text-light h-150 p-1 shadow p-3 mb-5 bg-body rounded"
//         dailyCard.style = "--bs-bg-opacity: .5";
//         wCastEl.append(dailyCard);

//         // data[i].daily.
        
//         var dateEl = (today.getMonth()+1) +'/'+ (today.getDate() + 1 + i) + '/' + today.getFullYear();
//         dailyCard.append(dateEl);

//         var wIconEl = document.createElement("h3");
//         dailyCard.append(wIconEl);
        
//         // var getIcon = function() {
//         //     if (data.current.weather[0].main === "Clouds") {
//         //         return "<i class='bi bi-brightness-high'></i>";
//         //     }
//         //     else if (data.current.weather[0].main === "Thunderstorm") {
//         //         return "<i class='bi bi-brightness-high'></i>";
//         //     }
//         //     else if (data.current.weather[0].main === "Rain") {
//         //     }
            
//         //     wIconEl.append(getIcon());
//         // };
        
//         dailyCard.append(wIconEl);

//         var dTempEl = document.createElement("h7");
//         dTempEl.classList = "p-2"
//         dTempEl.textContent = "Temp: " + data.daily[i].temp.day + "";
//         dailyCard.append(dTempEl);

//         var dSpeedEl = document.createElement("h7");
//         dSpeedEl.classList = "p-2"
//         dSpeedEl.textContent = "Wind: " + data.daily[i].wind_speed + " mph";
//         dailyCard.append(dSpeedEl);

//         var dHumidityEl = document.createElement("h7");
//         dHumidityEl.classList = "p-2"
//         dHumidityEl.textContent = "Humidity: " + data.daily[i].humidity + "%";
//         dailyCard.append(dHumidityEl);
//     }

// };

// // saves the info to localstorage (-- T.A. Queen helped with this)
// var saveCity = function() {
//     localStorage.setItem("city", JSON.stringify(search));
// };

// // loads cities to page (-- T.A. Queen helped with this)
// var loadCity = function() {
//     // get city items from localstorage
//     var savedSearch = localStorage.getItem("city");

//     // converts string format back to an array
//     savedSearch = JSON.parse(savedSearch);

//     for (i = 0; i < savedSearch.length; i++) {
//         var sNameEl = document.createElement("button");
//         sNameEl.classList = "col-9 btn-info rounded";
//         sNameEl.textContent = savedSearch[i];
        
//         searchColEl.append(sNameEl);
//     }
// };

// loadCity();