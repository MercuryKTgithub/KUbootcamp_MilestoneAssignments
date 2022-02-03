const STRING_EMPTY = '';
const CITY = true;
const HTML_SPACE = "&nbsp;"
const SPACE = ' ';
const NIGHT_FORCAST = 'n';
const NIGHT_FORCAST_DIR = "assets/images/night/";
const DAY_FORCAST_DIR = "assets/images/";
const COMMON_FILE_EXT = "@2x.png"
const OPEN_PARENTHESES = '(';
const CLOSE_PARENTHESES = ')';
const TEMPERATURE_START = 'Temp: ';
const HUMIDITY_START = 'Humidity: ';
const WIND_START = "Wind: ";
const UVINDEX = "UV Index: "

const TEMPERATURE_END = ' &deg; F';
const HUMIDITY_END = ' %'; 
const WIND_END = " MPH";
const DEFAULT_CITY = "Wichita";
var city_queryparas = STRING_EMPTY;
var latParas = STRING_EMPTY;
var lonParas = STRING_EMPTY;

// -- Only want Current and Daily so we exclude minutely, hourly and alerts
apiCityUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city_queryparas + "&units=imperial&appid=70086082b66a96f76b891285bfdc0149";
apiOneCallCurrent =  "https://api.openweathermap.org/data/2.5/onecall?lat=" + latParas + "&lon=" + lonParas + "&exclude=hourly,minutely,alerts&appid=70086082b66a96f76b891285bfdc0149";
apiOneCallCurrentWichita = "https://api.openweathermap.org/data/2.5/onecall?lat=37.6922&lon=-97.3375&exclude=hourly,daily,minutely,alerts&units=imperial&appid=70086082b66a96f76b891285bfdc0149";

function renderLandingPage(){
   $("#summary").hide(200);
   $("#summary").show(1000);
}

function finalizeWeatherDisplay(){
   $("#five_day_panel").show();
}

// In use
// Generic function that displays data returned by One Call feature at openweathermap.org
var displayCityForcastPerOneCall = function(weather_data, cityname) {
   // console.log(weather_data);
   // var singleForcastHeader = document.querySelector("#city_header");
   var fiveDayImgLoc1 = document.querySelector("#weather_5day_icon_loc_1");
   var cityName = cityname + SPACE + OPEN_PARENTHESES + moment().format("MM-DD-YYYY") + CLOSE_PARENTHESES;
  
   // clear old content
   $("#city-search-term").html(STRING_EMPTY);
   $("#city_temp").html(STRING_EMPTY);
   $("#city_wind").text(STRING_EMPTY); 
   $("#city_hum").text(STRING_EMPTY);
   $("#city_uvi").text(STRING_EMPTY);

   $("#city-search-term").text(cityName);
   $("#city_temp").html(TEMPERATURE_START + weather_data.current.temp + TEMPERATURE_END);
   $("#city_wind").text(WIND_START + weather_data.current.wind_speed + WIND_END);
   $("#city_hum").text(HUMIDITY_START +  weather_data.current.humidity + HUMIDITY_END);
   $("#city_uvi").text(UVINDEX + weather_data.current.uvi);

   var img_file = weather_data.current.weather[0].icon.toLocaleLowerCase() ;  // alert(img_file);
   var citySpanGraphics = document.createElement("img");

   // -- checking night or day forcasting information
   if (img_file.includes(NIGHT_FORCAST.toLocaleLowerCase())){
      citySpanGraphics.setAttribute("src", NIGHT_FORCAST_DIR + img_file + COMMON_FILE_EXT);
   }
   else{
      citySpanGraphics.setAttribute("src", DAY_FORCAST_DIR + img_file + COMMON_FILE_EXT);
   }

   // -- remove img of past requests within span tags before append current image
   if ($("#city_img_rep").has("img")){
      $("#city_img_rep").empty();
   }
   $("#city_img_rep").append(citySpanGraphics);


   // // fiveDayImgLoc1.setAttribute("src",  NIGHT_FORCAST_DIR + img_file + COMMON_FILE_EXT);
  
 };

// In use
// Get everything forcast for default location - Wichita - call made at the bottom of page
var getOneCallForcastWichitaAsDefault = function() 
{  
   var apiUrl = apiOneCallCurrentWichita;
   // console.log(apiUrl);
   // check if api returned any repos   
   fetch(apiUrl)
      .then(function(weather_response) 
      {
            if(weather_response.ok)
            {
               weather_response.json().then(function(data_weather_has_uvi_info)
               {
               // -- action
               displayCityForcastPerOneCall(data_weather_has_uvi_info, DEFAULT_CITY); 
               // console.log(data_weather_has_uvi_info); // keep this
               });
            }
            else
            {
               alert("Error: Weather Data Not Found"); // status 400
            }
         
      })// ; remove ; bc it's not ended yet
      .catch(function(error){
         alert("An error has occured: " + error);
      });

}; 

// In use
// Called by getWeatherForcastPerCity() at which lon and lat are made available by passing city-name
// Must know lattitude and longtitude to make a call to this middle-man function to get the uvi
var getOneCallForcast = function(weather_data_has_lon_lat_city_info) 
{  
   var city = weather_data_has_lon_lat_city_info.name;
   
   lonParas = weather_data_has_lon_lat_city_info.coord.lon;
   latParas = weather_data_has_lon_lat_city_info.coord.lat;
   console.log(lonParas);
   console.log(latParas);
   apiOneCallCurrent =  "https://api.openweathermap.org/data/2.5/onecall?lat=" + latParas + "&lon=" + lonParas + "&exclude=hourly,minutely,alerts&units=imperial&appid=70086082b66a96f76b891285bfdc0149";
   
   console.log("Inside getOneCallForcast: " + apiOneCallCurrent);

   // check if api returned any repos   
   fetch(apiOneCallCurrent)
      .then(function(weather_response) 
      {
            if(weather_response.ok)
            {
               weather_response.json().then(function(data_weather_has_uvi_info)
               {
               // -- action
               displayCityForcastPerOneCall(data_weather_has_uvi_info, city); 
               console.log("Inside getOneCallForcast second Then: " + data_weather_has_uvi_info); // keep this
               });
            }
            else
            {
               alert("Error: Weather Data Not Found"); // status 400
            }
         
      })// ; remove ; bc it's not ended yet
      .catch(function(error){
         alert("An error has occured: " + error);
      });

}; 

var citySearchFormEl = document.querySelector("#city_form");
var cityInputEl = document.querySelector("#city_name");

// In Use
// Generic function - called when button Get City Weather is clicked, extract longtitude and lattitude as a result
var getWeatherForcastPerCity = function(cityname) 
{  
   city_queryparas = cityname;
   apiCityUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city_queryparas + "&units=imperial&appid=70086082b66a96f76b891285bfdc0149";
   console.log("Inside getWeatherForcastPerCity : " + apiCityUrl);
   // check if api returned any repos   
   fetch(apiCityUrl)
      .then(function(weather_response) 
      {
            // console.log(weather_response); // 404 still display node Response, but headers ok property is false
            if(weather_response.ok)
            {
               weather_response.json().then(function(weather_data_has_lon_lat_city_info)
               {
               // -- action
               // displayCityForcast(weather_data_has_lon_lat_city_info); 
               // displayCityForcastPerOneCall(weather_data_has_lon_lat_city_info, cityname);

               console.log("Inside getWeatherForcastPerCity second Then : " + weather_data_has_lon_lat_city_info); // keep this
               // console.log("The underlined city is: " + weather_data_has_lon_lat_city_info.name);
               // console.log("The underlined lattitude is: " + weather_data_has_lon_lat_city_info.coord.lat);
               // console.log("The underlined longtitude is: " + weather_data_has_lon_lat_city_info.coord.lon);

               // -- action
               getOneCallForcast(weather_data_has_lon_lat_city_info);
            });
            }
            else
            {
               alert("Error: Weather Data Not Found"); // status 400
            }
         
      })// ; remove ; bc it's not ended yet
      .catch(function(error){
         alert("An error has occured: " + error);
      });

};  

// Button click event handler
var formSubmitHandler = function(event){
   event.preventDefault();
   var cityname = cityInputEl.value.trim();
   if (cityname) {
      getWeatherForcastPerCity(cityname);
      cityInputEl.value = STRING_EMPTY;
   } 
   else {
      alert("Please enter a US city.");
   }
   //console.log(event); // testing the form submission hooked-up // print SubmitEvent node
}

citySearchFormEl.addEventListener("submit", formSubmitHandler);
 
renderLandingPage();
getOneCallForcastWichitaAsDefault();