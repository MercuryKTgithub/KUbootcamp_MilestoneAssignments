const STRING_EMPTY = '';
const UNDERSCORE = '_'
const SPACE = ' ';
const TIMESTAMP = '@ ' ;
const NIGHT_FORCAST = 'n';
const NIGHT_FORCAST_DIR = "assets/images/night/";
const DAY_FORCAST_DIR = "assets/images/";
const COMMON_FILE_EXT = "@2x.png" //image made available per curtesy of openweathermap.org
const OPEN_PARENTHESES = '(';
const CLOSE_PARENTHESES = ')';
const CITY_CURR_NIGHT_FORCAST_DIR = "assets/images/currentheader/night/";
const CITY_CURR_DAY_FORCAST_DIR = "assets/images/currentheader/";
const TEMPERATURE_START = '<strong>Temp: </strong>';
const HUMIDITY_START = '<strong>Humidity: </strong>';
const WIND_START = "<strong>Wind: </strong>";
const UVINDEX = "<strong>UV Index: </strong>"
const UNIQUE_STORAGE_ID = "MercuryKT";
const TEMPERATURE_END = ' &deg;F'; // Fahrenheit unit
const HUMIDITY_END = '%'; 
const WIND_END = " MPH";
const DEFAULT_CITY = "Wichita";
const PRETEXT_HISTORY = "Searched on: " 
var city_queryparas = STRING_EMPTY;
var latParas = STRING_EMPTY;
var lonParas = STRING_EMPTY;
let searchRecord = [];
let searchClick = 0;

// Source: https://www.epa.gov/sunsafety/uv-index-scale-0 
const uvIndexColorCodes = {
   two_or_less_green : new Array("green", "Low/Favorable"),
   three_to_five_yellow: new Array("yellow", "Moderate"),
   six_to_seven_orange: new Array("orange", "High"),
   eight_or_above_red: new Array("red", "Severely High")
}

// -- Only want Current and Daily so we exclude minutely, hourly and alerts, imperial for unit system
apiCityUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city_queryparas + "&units=imperial&appid=70086082b66a96f76b891285bfdc0149";
apiOneCallCurrent =  "https://api.openweathermap.org/data/2.5/onecall?lat=" + latParas + "&lon=" + lonParas + "&exclude=hourly,minutely,alerts&appid=70086082b66a96f76b891285bfdc0149";
apiOneCallCurrentWichita = "https://api.openweathermap.org/data/2.5/onecall?lat=37.6922&lon=-97.3375&exclude=hourly,minutely,alerts&units=imperial&appid=70086082b66a96f76b891285bfdc0149";

function renderLandingPage(){
   $("#summary").hide(200);
   $("#summary").show(1000);
   $("#city_name").focus()
   // console.log("searchRecord array-length: ") + searchRecord.length;
   renderItemSearchHistory()
}
// Turns visibility on or off via jquery methods
function setHistoryColumnVisibility(currentLocalStorageSize){
   // alert(currentLocalStorageSize.length);
   if((currentLocalStorageSize > 0)||(searchClick > 0)) 
   { 
      $("#pole_blue_theme").show(); 
      // alert("It shows") // keep this
   }
   else
   {
      $("#pole_blue_theme").hide(); 
      // alert("It is hidden") // keep this
   }
}

// Called when history city item "button" is clicked, extract longtitude and lattitude as a result
function getWeatherForcastPerCityOmittedHistory(obj) 
{  
   var btn = obj;
   city_queryparas = btn.id;
   apiCityUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city_queryparas + "&units=imperial&appid=70086082b66a96f76b891285bfdc0149";
      
   fetch(apiCityUrl)
      .then(function(weather_response) 
      {
            // console.log(weather_response); // 404 still display node Response, but headers ok property is false
            if(weather_response.ok)
            {
               weather_response.json().then(function(weather_data_has_lon_lat_city_info)
               {
               // console.log("The underlined city is: " + weather_data_has_lon_lat_city_info.name);
               // -- action
               getOneCallForcast(weather_data_has_lon_lat_city_info);
            });
            }
            else
            {
               console.log("Error: Weather Data Not Found"); // status 400
            }
         
      }) 
      .catch(function(error){
         console.log("An error has occured: " + error);
      });  
 
      if((searchRecord.length > 0)||(searchClick > 0)) { 
         $("#pole_blue_theme").show(); 
         // alert("It should show up") // keep this
      }else{
         $("#pole_blue_theme").hide(); 
         // alert("It should be hidden") // keep this
      }
}; 

// Determines whether to display item history if history exists when page first loads - key/value approach
function renderItemSearchHistory(){
   currentLocalStorageSize = localStorage.length;
   setHistoryColumnVisibility(currentLocalStorageSize);
   if(currentLocalStorageSize){
      searchRecord.length = 0;
      for(var i=0; i < currentLocalStorageSize; i++) {
          // different approach
         let keyalias = localStorage.key(i);
         // console.log(keyalias); // testing only - retained
         let itemRowValueOfKey;
         if(keyalias.includes(UNIQUE_STORAGE_ID)){
            itemRowValueOfKey = JSON.parse(localStorage.getItem(keyalias));

            var searchByClicking = {
               searchID: itemRowValueOfKey.searchID,
               searchDateTime: moment(itemRowValueOfKey.searchDateTime),
               searchTerm: itemRowValueOfKey.searchTerm }         
            
            searchRecord.push(searchByClicking);
         }
         else{
            localStorage.removeItem(localStorage.key(i));
            // alert("I romoved it"); // testing only - retained
         }
         
      }

      // // searchRecord.sort(function(a, b){
      // //    return a.searchID - b.searchID;
      // // });

      // sort the data by date using moment.js
      searchRecord.sort(function (momentObjLeft, momentObjRight) {
         return (momentObjLeft.searchDateTime).diff((momentObjRight.searchDateTime))
      });

      console.log(searchRecord); // sorted array asc
      
      // -- remove old children div before append new div of new city 
      if ($("#pole_blue_theme").has("input")){
         $("#pole_blue_theme").empty();
      }
    
      for(var j=0; j < searchRecord.length; j++) {
         
         var searchDate = moment(searchRecord[j].searchDateTime);
         var searchTime = moment(searchRecord[j].searchDateTime);
         // console.log(searchDate.format('dddd, MMMM Do YYYY'));
         // console.log(searchTime.format('LTS')); // hour minute second
         var itemHistory = $("<input>").addClass("search_history")
                                    .attr("title", PRETEXT_HISTORY + searchDate.format('dddd, MMMM Do YYYY') + SPACE + TIMESTAMP + searchTime.format('LTS'))
                                    .val((searchRecord[j].searchTerm))
                                    .attr('id', searchRecord[j].searchTerm)
                                    // .on("click", function(){ myFunction(); });  // works    
                                    // .attr('onClick', 'myFunction(this);'); // works   
                                    .attr('onClick', 'getWeatherForcastPerCityOmittedHistory(this);');   
                                                   
         $("#pole_blue_theme").append(itemHistory);
                         
      }
   }
}

function myFunction(val){
   alert("Where am I 1?");
   // var btnClicked = $(event.target);
   console.log(val);
   var btn = val;
   
   alert(btn.id);
   alert("Where am I 2?");
   getWeatherForcastPerCityDetachedHistory(btn.id)
}

// Rounding decimal to whole number indexes - source https://www.epa.gov/sunsafety/uv-index-scale-0  // non-negative
// Determines what to display (color, decimal mesurement treatment) for UV index button of current city weather
function getUVIndexButtonInfo(measure_data){
   var num = Math.round((measure_data)); 
   // alert(num)
   var metrics = {
      uvDecimalRead: STRING_EMPTY,
      uvIndexColor: STRING_EMPTY,
      uvIndexDesc: STRING_EMPTY
   }
   if (num <= 2){
      metrics.uvDecimalRead = measure_data;
      metrics.uvIndexColor = uvIndexColorCodes.two_or_less_green[0];
      metrics.uvIndexDesc = uvIndexColorCodes.two_or_less_green[1];
   }
   else if ((2 < num) && (num <= 5)){
      metrics.uvDecimalRead = measure_data;
      metrics.uvIndexColor = uvIndexColorCodes.three_to_five_yellow[0];
      metrics.uvIndexDesc = uvIndexColorCodes.three_to_five_yellow[1];
   }
   else if ((6 <= num) && (num <= 7)){
      metrics.uvDecimalRead = measure_data;
      metrics.uvIndexColor = uvIndexColorCodes.six_to_seven_orange[0];
      metrics.uvIndexDesc = uvIndexColorCodes.six_to_seven_orange[1];
   }
   else {
      metrics.uvDecimalRead = measure_data;
      metrics.uvIndexColor = uvIndexColorCodes.eight_or_above_red[0];
      metrics.uvIndexDesc = uvIndexColorCodes.eight_or_above_red[1];
   }
   return metrics;
}

//-----------------------------------------------------------------------------------------------------------------------/

// Generic function that displays all data returned in One Call featured at openweathermap.org
var displayCityForcastPerOneCall = function(weather_data, cityname) {
   console.log(weather_data);

   var initialCurrentDate =  moment() ;
   var cityNameForHeader = cityname + SPACE + OPEN_PARENTHESES + initialCurrentDate.format("M/DD/YYYY") + CLOSE_PARENTHESES;
  
   // clear old content
   $("#city_search_term").html(STRING_EMPTY);
   $("#city_temp").html(STRING_EMPTY);
   $("#city_wind").html(STRING_EMPTY); 
   $("#city_hum").html(STRING_EMPTY);
   $("#city_uvi").html(STRING_EMPTY);

   // var btnUVindexInfo = getUVIndexButtonInfo('3.88') // Test only, rounded up to 8
   var btnUVindexInfo = getUVIndexButtonInfo(weather_data.current.uvi)

   var btnUVindex = $("<button>").addClass("btnUVI")
                                 .text(btnUVindexInfo.uvDecimalRead)               
                                 .css("background-color", btnUVindexInfo.uvIndexColor)
                                 .attr("title", btnUVindexInfo.uvIndexDesc)

   if(btnUVindexInfo.uvIndexColor.toLocaleLowerCase().includes("yellow")){
      btnUVindex.removeClass("btnUVI");
      btnUVindex.addClass("btnUVIDarkText");
   }

   $("#city_search_term").text(cityNameForHeader);
   $("#city_temp").html(TEMPERATURE_START + weather_data.current.temp + TEMPERATURE_END);
   $("#city_wind").html(WIND_START + weather_data.current.wind_speed + WIND_END);
   $("#city_hum").html(HUMIDITY_START +  weather_data.current.humidity + HUMIDITY_END);
   $("#city_uvi").html(UVINDEX);
   $("#city_uvi").append(btnUVindex);

   var img_file = weather_data.current.weather[0].icon.toLocaleLowerCase() ;  // alert(img_file);
   var imgPathDay = CITY_CURR_DAY_FORCAST_DIR + img_file + COMMON_FILE_EXT;
   var imgPathNite = CITY_CURR_NIGHT_FORCAST_DIR + img_file + COMMON_FILE_EXT;

   var citySpanGraphics = $("<img>")
   if(img_file.includes(NIGHT_FORCAST.toLocaleLowerCase())){
      citySpanGraphics.attr("src", imgPathNite)
      citySpanGraphics.attr("title",  weather_data.current.weather[0].description)
      citySpanGraphics.attr("alt",  weather_data.current.weather[0].description);
   }
   else{
      citySpanGraphics.attr("src", imgPathDay)
      citySpanGraphics.attr("title",  weather_data.current.weather[0].description)
      citySpanGraphics.attr("alt",  weather_data.current.weather[0].description);
   }
   
   // -- remove old img before append current image
   if ($("#city_img_rep").has("img")){
      $("#city_img_rep").empty();
   }
   $("#city_img_rep").append(citySpanGraphics);

   // -- remove old children div before append new div of new city 
   if ($("#five_day_forcast_panel").has("div")){
      $("#five_day_forcast_panel").empty();
   }

   //----------------------------END OF TOP PANEL SUMMARY  -----------------------------//

   var fiveday_forcast  = [];
   for(var i = 0; i < 5; i++){
      var weatherNextDay = {
         date: null,
         icon: STRING_EMPTY,
         description: STRING_EMPTY,

         humidity: STRING_EMPTY,
         temp: STRING_EMPTY,
         wind: STRING_EMPTY, 
         iconfile: STRING_EMPTY
      }
      weatherNextDay.date = moment(initialCurrentDate).add(i + 1, 'day'); // Get the next day in each iteration until 5th day's reached
      weatherNextDay.icon = weather_data.daily[i].weather[0].icon.toLocaleLowerCase()
      weatherNextDay.description = weather_data.daily[i].weather[0].description;

      weatherNextDay.humidity = weather_data.daily[i].humidity;
      weatherNextDay.temp = weather_data.daily[i].temp.day;
      weatherNextDay.wind = weather_data.daily[i].wind_speed;
     
      imgPathDay = DAY_FORCAST_DIR + weatherNextDay.icon + COMMON_FILE_EXT;    
      imgPathNite = NIGHT_FORCAST_DIR + weatherNextDay.icon + COMMON_FILE_EXT;

      weatherNextDay.iconfile = (weatherNextDay.icon.includes(NIGHT_FORCAST.toLocaleLowerCase())) ? imgPathNite : imgPathDay;

      fiveday_forcast.push(weatherNextDay);

   } // End of 1st For Loop
   
   // console.log(fiveday_forcast.length);
   console.log(fiveday_forcast);

   for(var j = 0; j < 5; j++){
      var fivedayCardWeatherImg = $("<img>").attr("src", fiveday_forcast[j].iconfile)
                                            .attr("title", fiveday_forcast[j].description)
                                            .attr("alt", fiveday_forcast[j].description);
      var fivedayCardHeader = $("<h6>").addClass("five_day_card_header")
                                       .text(fiveday_forcast[j].date.format("M/DD/YYYY"));
      var fivedayCardBody = $("<div>").addClass("five_day_card_body")
                           .append(fivedayCardWeatherImg)
                           .append( $("<p>").html(TEMPERATURE_START + fiveday_forcast[j].temp + TEMPERATURE_END))
                           .append( $("<p>").html(WIND_START + fiveday_forcast[j].wind + WIND_END))
                           .append( $("<p>").html(HUMIDITY_START +  fiveday_forcast[j].humidity + HUMIDITY_END));

      var fivedayCardJquery = $("<div>").addClass("five_day_card");
      fivedayCardJquery.append(fivedayCardHeader);
      fivedayCardJquery.append(fivedayCardBody);

      var fivedayCard = $("<div>").addClass("five_day_card");
      fivedayCard.append(fivedayCardHeader);
      fivedayCard.append(fivedayCardBody);

      $("#five_day_forcast_panel").append(fivedayCard);
                                             
   } // End of 2nd For Loop

   // console.log($("#five_day_forcast_panel").children())
  
 };

// Get everything forcast for default location - Wichita - call made at the bottom of page
var getOneCallForcastWichitaAsDefault = function() 
{  
   var apiUrl = apiOneCallCurrentWichita;
   // console.log(apiUrl);
   fetch(apiUrl)
      .then(function(weather_response) 
      {
            if(weather_response.ok)
            {
               // console.log(weather_response);
               weather_response.json().then(function(data_weather_has_uvi_info_daily_included)
               {
               // -- action
               displayCityForcastPerOneCall(data_weather_has_uvi_info_daily_included, DEFAULT_CITY); 
               // console.log(data_weather_has_uvi_info_daily_included); // keep this
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

// Called by getWeatherForcastPerCity() at which lon and lat are made available by passing city-name
// Must know lattitude and longtitude to make a call to this middle-man function to get the uvi info
var getOneCallForcast = function(weather_data_has_lon_lat_city_info) 
{  
   var city = weather_data_has_lon_lat_city_info.name;
   
   lonParas = weather_data_has_lon_lat_city_info.coord.lon;
   latParas = weather_data_has_lon_lat_city_info.coord.lat;
   console.log(lonParas);
   console.log(latParas);
   apiOneCallCurrent =  "https://api.openweathermap.org/data/2.5/onecall?lat=" + latParas + "&lon=" + lonParas + "&exclude=hourly,minutely,alerts&units=imperial&appid=70086082b66a96f76b891285bfdc0149";
   
   // console.log("Inside getOneCallForcast: " + apiOneCallCurrent);

      
   fetch(apiOneCallCurrent)
      .then(function(weather_response) 
      {
            if(weather_response.ok)
            {
               weather_response.json().then(function(data_weather_has_uvi_info)
               {
               // -- action
               displayCityForcastPerOneCall(data_weather_has_uvi_info, city); 
               // console.log("Inside getOneCallForcast second Then: " + data_weather_has_uvi_info); // keep this
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

// Generic function - called when button Search is clicked, extract longtitude and lattitude as a result
var getWeatherForcastPerCity = function(cityname) 
{  
   currentLocalStorageSize = localStorage.length;   
   searchClick = (currentLocalStorageSize) ? currentLocalStorageSize : 0;
   // alert("searchClick value per storageLength: " + searchClick);
   searchClick += 1;
   var searchByClicking = {
      searchID: searchClick,
      searchDateTime: moment(),
      searchTerm: cityname}

   searchRecord.push(searchByClicking);
   localStorage.setItem(searchByClicking.searchTerm + UNDERSCORE + searchByClicking.searchID + UNDERSCORE + UNIQUE_STORAGE_ID, JSON.stringify(searchByClicking));
   
   city_queryparas = cityname;
   apiCityUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city_queryparas + "&units=imperial&appid=70086082b66a96f76b891285bfdc0149";
   // console.log("Inside getWeatherForcastPerCity : " + apiCityUrl);
      
   fetch(apiCityUrl)
      .then(function(weather_response) 
      {
            // console.log(weather_response); // 404 still display node Response, but headers ok property is false
            if(weather_response.ok)
            {
               weather_response.json().then(function(weather_data_has_lon_lat_city_info)
               {
               // console.log("Inside getWeatherForcastPerCity second Then : " + weather_data_has_lon_lat_city_info); // keep this
               // console.log("The underlined city is: " + weather_data_has_lon_lat_city_info.name);
               // -- action
               getOneCallForcast(weather_data_has_lon_lat_city_info);
            });
            }
            else
            {
               console.log("Error: Weather Data Not Found"); // status 400
            }
         
      })// ; remove semicolon bc it's not ended yet
      .catch(function(error){
         console.log("An error has occured: " + error);
      }); // it ends here

      // console.log("|searchRecord| has: " + searchRecord.length);
      // console.log("$Local Storage length$ is: " + localStorage.length);
 
      if((searchRecord.length > 0)||(searchClick > 0)) { 
         $("#pole_blue_theme").show(); 
         // alert("It should show up") // keep this
      }else{
         $("#pole_blue_theme").hide(); 
         // alert("It should be hidden") // keep this
      }
       
      var itemHistory = $("<input>").addClass("search_history")
                                    .attr("title", PRETEXT_HISTORY + searchByClicking.searchDateTime.format('dddd, MMMM Do YYYY') + SPACE + TIMESTAMP + searchByClicking.searchDateTime.format('LTS'))
                                    .val((searchByClicking.searchTerm))
                                    .attr('id', searchByClicking.searchTerm)
                                    // .attr('onClick', 'myFunction(this);'); // works
                                    .attr('onClick', 'getWeatherForcastPerCityOmittedHistory(this);'); 
                                     
      $("#pole_blue_theme").append(itemHistory);
};  

// Button-click event handler
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
}



citySearchFormEl.addEventListener("submit", formSubmitHandler);

renderLandingPage(); // default to City of Wichita weather
getOneCallForcastWichitaAsDefault();
