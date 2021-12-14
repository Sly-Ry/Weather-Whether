var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#search-npt")
var wContainerEl = document.querySelector("#weather-container");

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
    
    console.log(event);
};

// gets the lat and lon coordinates in order to find city
var getLatLon = function(cityName) {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=2632ab542fff737012a28d74931b6af5"

    fetch(apiUrl)
    .then(function(response) {                     
        response.json().then(function(data) {
           console.log(data);
        });
    })
    .catch (function(error){
        alert("Unable to connect to source")
    });
    
};






// gets weather for search city
var getCityWeather = function() {
    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}"
};

userFormEl.addEventListener("submit", formSubmitHandler);

// // create a var that gets user repos
// var getUserRepos = function(user){

//     // format the github api url
//     var apiUrl = "https://api.github.com/users/"+ user +"/repos";
    
//     // fetch from app and a response came from GitHub's server.
//     // make a request to the url
//     fetch(apiUrl)
//     .then(function(response) {

//         // an if statement in case of 404 status on username search
//         if (response.ok) {

//             // json is used here, but sometimes "text() would be used if resources return non-json data"
//             response.json().then(function(data) {
//                 displayRepos(data, user);
//             });
//         }
//         else {
//             alert("Github User Not Found!");
//         }
//         // console.log("inside", response);
//     })
//     .catch(function(error) {
        
//         // notice this '.catch()' getting chained onto the end of the '.then()' method
//         alert("Unable to connect to Github");
//     });
//     // console.log("outside");
// };