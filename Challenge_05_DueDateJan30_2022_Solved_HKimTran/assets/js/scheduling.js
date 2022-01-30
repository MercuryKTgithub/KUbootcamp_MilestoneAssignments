
 
const ITEM_FUTURE_HR_GREEN = "form-control bg-success edit-mode"
const ITEM_PASS_HR_GRAY = "form-control bg-secondary edit-mode"
const ITEM_WITHIN_CURR_HR_RED = "form-control bg-danger edit-mode"
const COLON = ":";

var BIZ_HR_START = "1:00 AM"; // will change accordingly to reflect actual business time
var HTML_DSPACE = "&nbsp;&nbsp;"
var SPACE = " ";

// -- Render the colors of the existing tasks per time sensitive conditional checking
var auditTask = function(taskEl) {
   // -- to ensure element is getting to the function
   console.log(taskEl);   

   var hrBlock = $(taskEl).find("span").text().trim();
   // // ensure it worked
   // console.log(hrBlock); 

   var nexthrBlock = (parseInt(hrBlock.split(COLON)[0]) + 1).toString() + COLON + hrBlock.split(COLON)[1].toString();
   // console.log(nexthrBlock);
   
   // // For quick test only:
   // // Get moment object #1
   // var yesterday = '29-Jan-2022, 11:00 PM';
   // var currentDateTime = moment(yesterday, 'DD-MMM-YYYY, hh:mm A' ); 
   // console.log(currentDateTime.format('DD-MMM-YYYY, hh:mm A') + " is the yesterday moment obj formatted");

   // // Get moment object #1 is currentDateTime
   var currentDateTime = moment(); // moment obj of today --  being the current day
   
   var currentHourFormated = currentDateTime.format("LT"); // want to get the Hour portion of today
   console.log(currentHourFormated + " is the current hour");

   var currentDateFormated = moment().format("DD-MMM-YYYY"); // want to get the Date portion of today
   console.log(currentDateFormated)
   
   // Make the hour-block located on the left side become today's hour stamp so I can get the moment object out of it
   var hrBlockDateTimeFormatted = currentDateFormated +  SPACE + hrBlock;  // hrBlock = 1:00 AM
   console.log(hrBlockDateTimeFormatted + " is the hr block moment obj formatted");
   // Get moment object #2
   var hrBlockDateTime = moment(hrBlockDateTimeFormatted, 'DD-MMM-YYYY, hh:mm A' ); // moment object 

    // Make the next hour-block located on the left side become today's next hour stamp so I can get the moment object out of it
    var nexthrBlockDateTimeFormatted = currentDateFormated +  SPACE + nexthrBlock;  // hrBlock = 1:00 AM
    console.log(nexthrBlockDateTimeFormatted + " is the NEXT hr block moment obj formatted");
    // Get moment object #2
    var nexthrBlockDateTime = moment(nexthrBlockDateTimeFormatted, 'DD-MMM-YYYY, hh:mm A' ); // moment object 
 
   console.log( hrBlockDateTime < currentDateTime);
   console.log(currentDateTime < nexthrBlockDateTime ); 

   // Remove whateve css classes were applied
   $(taskEl).find("textarea").removeClass("form-control bg-primary edit-mode");

   if(hrBlockDateTime < currentDateTime)
   { 
      // Per TA: any scheduled task item within the Current Hour should have a red color
      // Any scheduled task item's time [presented by hrBlockDateTime from 3:00 AM to 3:59 AM] within 
      // which the the current hour (3:12 AM) falls into, will have a red color
      if(currentDateTime < nexthrBlockDateTime)
      {
         // equivalent to (hrBlockDateTime < currentDateTime) && (currentDateTime < nexthrBlockDateTime)
         //  (3:00 AM < 3:23 AM() && (3:23 AM < 4:00 AM)
         $(taskEl).find("textarea").addClass(ITEM_WITHIN_CURR_HR_RED);
      }
      else{
         $(taskEl).find("textarea").addClass(ITEM_PASS_HR_GRAY);
      }     
   }
   else{
      $(taskEl).find("textarea").addClass(ITEM_FUTURE_HR_GREEN);
   }
  
 };

// Display the layout of the scheduler per per given mock-up where a schedule task item to be populated or edited
var displaySchedulerWithLeftEdgeHourBlock = function() {//function(taskEl) {

   var initialTime =  moment(BIZ_HR_START, ["HH:mm"]) ;
   var hourBlocks = $("span[class='input-group-text hour-minute'");
   if(hourBlocks){
      for (var j = 0; j < hourBlocks.length; j++)
      {
         // var formatedSingleHr = initialTime.format("h:mm A");
         if (j === 0){
            if(initialTime.format("h:mm A").length == 7){
               hourBlocks[j].innerHTML = HTML_DSPACE + initialTime.format("h:mm A");
            }
            else{
               hourBlocks[j].innerHTML =  initialTime.format("h:mm A");
            }

         }
         else{
            var nextHr = moment(initialTime).add(j, 'hours'); // clone the initial time before increment its hour value by j
            if (nextHr.format("h:mm A").length == 7){
               hourBlocks[j].innerHTML = HTML_DSPACE + nextHr.format("h:mm A");
            }
            else{
               hourBlocks[j].innerHTML = nextHr.format("h:mm A");
            }
         }
      }
   }
   else{
      return false;
   }

}; 

var renderTasksPerCurrentTime = function() {
    
   var currentDate = moment();
   $("#current_date").append(currentDate.format('dddd, MMMM Do YYYY')); // let the header display today date

   displaySchedulerWithLeftEdgeHourBlock();

   var taskInputGrp = $("div[class='input-group input-group-lg']");
   for (var i = 0; i < taskInputGrp.length; i++)
   {
      auditTask(taskInputGrp[i]);
   }

 };

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Onclick even handler here: trigger ul will trigger p because
// p element is within <ul> element that employs .list-group class, 
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(".input-group").on("click", "input", function() {  
   console.log("<input> was clicked");
   //console.log(this); // -- print <p class="m-1">4the Task Desc</p>
   //With the $ character, however, we can convert [this] into a jQuery object and extract obj's text:
   
   var text = $(this).text(); // -- EXTRACT 1ST UI text 
   console.log(text); // -- print the schedule item text

   var multiCssClass = $('#div1').attr('class');
   var multiCssClass = $(this).attr('class');
  
   var rowbgcolor = checkScheduleItemColor(multiCssClass);
   console.log(rowbgcolor + " is the current item bgcolor")
 
   // Create a new <textarea> element. 
   var textInput = $("<textarea>") 
     .addClass("form-control")
     .addClass("edit-mode")
     .addClass(rowbgcolor)
     .val(text); // -- ASSIGN TO 2ND UI
 
   // Swap out elements
   $(this).replaceWith(textInput); // - REPLACE 1ST UI WITH 2ND UI
 
   textInput.trigger("focus");
 });

 renderTasksPerCurrentTime();

