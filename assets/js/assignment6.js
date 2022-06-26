// variable to store searched city
var city = '';

// variable declaration
var searchCity = $('search-city');
var searchBtn = $('search-button');
var clearBtn = $('clear-history');
var currentCity = $('current-city');
var currentTemperature = $('temperature');
var currentHumidity = $('humidity');
var currentWindSpeed = $('wind-speed');
var currentUVIndex = $('uv-index');

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
        currentWeather(city)
    }
} 

function currentWeather(city){
    var queryURL = 'http.openweathermap.org/data/2.5/weather?q' + city + '&APPID=' + APIKey;

    $ajax({
        url: queryURL,
        method: 'GET'
    })
    .then(function(response){
        console.log(response);

        var weatherIcon = response.weather[0].icon;
        
        var iconurl='https://openweathermap.org/img/wn/' + weatherIcon +'@2x.png';

        var date = new Date(response.dt*1000).toLocaleString();

        $(currentCity).html(response.name + '(' + date + ')' + '<img src = ' + iconurl +'>');

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
        UVIndex(response.cord.lon, response.coord.lat);
        
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
    var uvURL = ''
}
