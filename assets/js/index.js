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
    var uvURL = 'https://api.openweathermap.org/data/2.5/uvi?appid=' +  APIKey + '&lat=' + lt + '&lon=' + ln

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
    var queryForecastURL = 'https://api.openweathermap.org/data/2.5/forecast?id=' + cityId + '&appid=' + APIKey;

    $.ajax({
        url: queryForecastURL,
        method: 'GET'
    }).then(function(response){

        for (i=0; i<5; i++){
            var date = new Date((response.list[((i+1) * 8) - 1].dt) * 1000).toLocaleDateString();
            
            var forecastIcon = response.list[((i+1) * 8) - 1].weather[0].icon;
            
            var iconURL = 'https://openweathermap.org/img/wn/' + forecastIcon + '@2x.png';
            
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
function addCity(city){
    var listEl = $('<li>' + city.toUpperCase() + '</li>');

    $(listEl).attr('class','list-group-item');
    $(listEl).attr('data-value', city.toUpperCase());
    $('.list-group').append(listEl);
}

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
            addCity(savedC[i]);
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