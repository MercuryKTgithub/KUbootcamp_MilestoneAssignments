const BLUE = 'bg-primary';
const GRAY = "bg-secondary";
const GREEN = "bg-success";
const RED = "bg-danger";
const YELLOW = "bg-warning";
const TEAL = "bg-info";
const OFFWHITE = "bg-light";
const BLACK = "bg-dark";
const WHITE = "bg-white";

var bootstrapBgColors = new Array(BLUE, GRAY, GREEN, RED, YELLOW, TEAL, OFFWHITE, BLACK, WHITE);

// Helps detect the background color on the fly that render the task so that this color can be matched during the UI content editing. 
function checkScheduleItemColor(multiCssClass){
   for(var i = 0; i < bootstrapBgColors.length; i++)
   {
      console.log(bootstrapBgColors[i].trim() + " extracted inside for loop");
      if(multiCssClass.includes(bootstrapBgColors[i].trim())) // if found
      {
         // console.log(multiCssClass.includes(bootstrapBgColors[i].trim()) + "  | value true for false"); 
         return bootstrapBgColors[i]; // return the matched color
      }
   }
}
 
var taskSet = JSON.parse(localStorage.getItem("allEntries"));
if(taskSet == null){ taskSet = [];}
var taskInputGrp = $("div[class='input-group input-group-lg']");

const INACTIVE_BTN_MSG = "Button is inactive as the scheduled block has passed current time."
const ITEM_FUTURE_HR_GREEN = "form-control bg-success edit-mode"
const ITEM_PASS_HR_GRAY = "form-control bg-secondary edit-mode"
const ITEM_WITHIN_CURR_HR_RED = "form-control bg-danger edit-mode"
const COLON = ":";
const STRING_EMPTY = '';

var BIZ_HR_START = "9:00 AM"; // will change accordingly to reflect actual business time
var HTML_DSPACE = "&nbsp;&nbsp;"
var SPACE = " "; 

// Displays the layout of the scheduler per per given mock-up where a schedule task item to be populated or edited
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

// -- Renders the colors of the existing tasks per time sensitive conditional checking
var auditTaskStatus = function(taskEl) 
{
   // // -- to ensure element is getting to the function
   // console.log(taskEl);   

   var hrBlock = $(taskEl).find("span").text().trim();

   // -- Get moment object #1 is currentDateTime
   var currentDateTime = moment(); // moment obj of today --  being the current day
   
   var currentHourFormated = currentDateTime.format("LT"); // want to get the Hour portion of today
   // console.log(currentHourFormated + " is the current hour");

   var currentDateFormated = moment().format("DD-MMM-YYYY"); // want to get the Date portion of today
   // console.log(currentDateFormated + " is the current Date Time moment obj")
   
   // -- Make the hour-block located on the left side become today's hour stamp so I can get the moment object out of it
   var hrBlockDateTimeFormatted = currentDateFormated +  SPACE + hrBlock;  // hrBlock = 1:00 AM
   // console.log(hrBlockDateTimeFormatted + " is the hr block moment obj formatted");

   // -- Get moment object #2
   var hrBlockDateTime = moment(hrBlockDateTimeFormatted, 'DD-MMM-YYYY, hh:mm A' ); // moment object 

   // -- Get moment object #3
   var nexthrBlockDateTime = moment(hrBlockDateTime).add(1, 'hours');
   // console.log(nexthrBlockDateTime.format('DD-MMM-YYYY, hh:mm A') + " is new variable");

   // // console.log(hrBlockDateTime < currentDateTime);
   // // console.log(currentDateTime < nexthrBlockDateTime ); 

   // Remove whateve css classes were applied
   $(taskEl).find("textarea").removeClass("form-control bg-primary edit-mode");

   if(hrBlockDateTime < currentDateTime)
   { 
      // Per TA: any scheduled task item within the Current Hour should have a red color
      // Any scheduled task item's time [presented by hrBlockDateTime from 3:00 AM to 3:59 AM] within 
      // which the the current hour (9:12 AM) falls into, will have a red color
      if(currentDateTime < nexthrBlockDateTime)
      {
         // equivalent to (hrBlockDateTime < currentDateTime) && (currentDateTime < nexthrBlockDateTime)
         //  (9:00 AM < 9:23 AM() && (9:23 AM < 10:00 AM)
         $(taskEl).find("textarea").addClass(ITEM_WITHIN_CURR_HR_RED);
      }
      else{
         $(taskEl).find("textarea").addClass(ITEM_PASS_HR_GRAY);
         $(taskEl).find("textarea").prop("readonly", true);
         $(taskEl).find("button").attr("disabled","disabled") ;
         $(taskEl).find("button").prop("title", INACTIVE_BTN_MSG);
      }     
   }
   else{
      $(taskEl).find("textarea").addClass(ITEM_FUTURE_HR_GREEN);
   }

};

// This function will ensure updated content of the task will be reflected upon a browser-refresh
var populateContentSinceLastEdited = function()
{
   var taskSet = JSON.parse(localStorage.getItem("taskSet"));
   
   if (taskSet == null){
      return false;
   }
   else
   {
      for (var i = 0; i < taskSet.length; i++)
      {
         for (var r = 0; r < taskInputGrp.length; r++)
         {
            if (r == (parseInt(taskSet[i].taskNo) - 1))
            {
               // // alert("matching row: " + r);
               // // alert(parseInt((taskSet[i].taskNo)) + "--" + taskSet[i].taskDesc);
               taskEl = taskInputGrp[r];
               // // var txtA =  $(taskEl).find("textarea[class='edit-mode-action']");
               // // if (txtA){
               // //    alert("found area");
               // // }
               $(taskEl).find("textarea[class='edit-mode-action']").hide();
               $(taskEl).find("textarea").append(taskSet[i].taskDesc);
            }
         }

      }
   }
}

// (1) Takes care of printing all the Headings and rendering task-item per hour which make up the rows of the Scheduler
var renderTasksPerCurrentTime = function() {
    
   var currentDate = moment();
   $("#current_date").append(currentDate.format('dddd, MMMM Do YYYY')); // let the header display today date

   displaySchedulerWithLeftEdgeHourBlock();
   console.log(taskInputGrp);
   
   // populateContentSinceLastEdited();
      
   // taskInputGrp is a global entity, desiged to be assessible from every where
   for (var i = 0; i < taskInputGrp.length; i++) // taskInputGrp this is the collection of rows that render the tasks down wards
   {
      auditTaskStatus(taskInputGrp[i]);
   }

   populateContentSinceLastEdited(); 
  
};

// Gets called when the Save Button is clicked, it will save the task-entry into local storage
var saveUpdatedTaskDetail = function(taskEl, btnIdNo)
{       
   var txtAreaTaskDetail = $(taskEl).find("textarea").val();
   // console.log(txtAreaTaskDetail.length); // 1
   console.log(txtAreaTaskDetail);

   if(taskSet == null){taskSet = [];}

   scheduledTask = {
      taskNo: btnIdNo,
      taskDesc: txtAreaTaskDetail
   };       

   taskSet.push(scheduledTask);  
   console.log(taskSet.length + " is the length of array taskSet after some pushing per save button click event")
   localStorage.setItem("taskSet", JSON.stringify(taskSet));
} 

 //+++++++++++++++++++++++++++++++++++ EVENT HANDLER P.1 ++++++++++++++++++++++++++++++++++++++++++
 $("textarea").on("click", function() {  
   console.log("<textarea> was clicked");

   // -- With the $ character, however, we can convert [this] into a jQuery object and extract obj's text:
   var text = $(this).text(); // -- EXTRACT 1ST UI text 
   console.log(text); // -- print the schedule item text

   var multiCssClass = $(this).attr('class');
   var rowbgcolor = checkScheduleItemColor(multiCssClass);
   console.log(rowbgcolor + " is the current item bgcolor")

   if (rowbgcolor.toLocaleLowerCase().includes(GRAY.toLocaleLowerCase()))
   {
       // Create a new <textarea> element. 
      var textInput = $("<textarea>") 
      .addClass("form-control")
      .addClass("edit-mode-action")
      .addClass("text-light")
      .addClass(rowbgcolor)
      .val(text) // -- ASSIGN TO 2ND UI
      .prop("readonly", true); // -- Passes current time, task is no longer editable
   }
   else{
      // Create a new <textarea> element. 
      var textInput = $("<textarea>") 
      .addClass("form-control")
      .addClass("edit-mode-action")
      .addClass("text-light")
      .addClass(rowbgcolor)
      .val(text); // -- ASSIGN TO 2ND UI
   }
 
   // Swap out elements
   $(this).replaceWith(textInput); // - REPLACE 1ST UI WITH 2ND UI
 
   textInput.trigger("focus");
 });
//------------------------------------------ EVENT HANDLER P.2----------------------------------------------//

$("#button_addon_1").on("click", function() {  
   console.log("<button 1> was clicked");
   btnId = "button_addon_1";
  
   btnIdNo = btnId.split('_')[2];
   console.log(btnIdNo + " is clicked"); // print 1   
   saveUpdatedTaskDetail(taskInputGrp[parseInt(btnIdNo) - 1], btnIdNo);
   
 });

 $("#button_addon_2").on("click", function() {  
   console.log("<button 2> was clicked");
   btnId = "button_addon_2";
   btnIdNo = btnId.split('_')[2];
   console.log(btnIdNo + " is clicked"); // print 1
   saveUpdatedTaskDetail(taskInputGrp[parseInt(btnIdNo) - 1], btnIdNo);
 });

 $("#button_addon_3").on("click", function() {  
   console.log("<button 3> was clicked");
   btnId = "button_addon_3";
   btnIdNo = btnId.split('_')[2];
   console.log(btnIdNo + " is clicked"); // print 1
   saveUpdatedTaskDetail(taskInputGrp[parseInt(btnIdNo) - 1], btnIdNo);
 });

 $("#button_addon_4").on("click", function() {  
   console.log("<button 4> was clicked");
   btnId = "button_addon_4";
   btnIdNo = btnId.split('_')[2];
   console.log(btnIdNo + " is clicked"); // print 1
   saveUpdatedTaskDetail(taskInputGrp[parseInt(btnIdNo) - 1], btnIdNo);
 });

 $("#button_addon_5").on("click", function() {  
   console.log("<button 5> was clicked");
   btnId = "button_addon_5";
   btnIdNo = btnId.split('_')[2];
   console.log(btnIdNo + " is clicked"); // print 1
   saveUpdatedTaskDetail(taskInputGrp[parseInt(btnIdNo) - 1], btnIdNo);
 });

 $("#button_addon_6").on("click", function() {  
   console.log("<button 6> was clicked");
   btnId = "button_addon_6";
   btnIdNo = btnId.split('_')[2];
   console.log(btnIdNo + " is clicked"); // print 1
   
   // var taskSet = JSON.parse(localStorage.getItem("taskSet"));
   // if (taskSet != null){
   //    alert("it's not null")
   // }
   saveUpdatedTaskDetail(taskInputGrp[parseInt(btnIdNo) - 1], btnIdNo);
 });

 $("#button_addon_7").on("click", function() {  
   console.log("<button 7> was clicked");
   btnId = "button_addon_7";
   btnIdNo = btnId.split('_')[2];
   console.log(btnIdNo + " is clicked") ;// print 1
   saveUpdatedTaskDetail(taskInputGrp[parseInt(btnIdNo) - 1], btnIdNo);
 });

 $("#button_addon_8").on("click", function() {  
   console.log("<button 8> was clicked");
   btnId = "button_addon_8";
   btnIdNo = btnId.split('_')[2];
   console.log(btnIdNo + " is clicked"); // print 1
   saveUpdatedTaskDetail(taskInputGrp[parseInt(btnIdNo) - 1], btnIdNo);
 });

 $("#button_addon_9").on("click", function() {  
   console.log("<button 9> was clicked");
   btnId = "button_addon_9";
   btnIdNo = btnId.split('_')[2];
   console.log(btnIdNo + " is clicked"); // print 1
   saveUpdatedTaskDetail(taskInputGrp[parseInt(btnIdNo) - 1], btnIdNo);
 });

 $("#button_addon_10").on("click", function() {  
   console.log("<button 10> was clicked");
   btnId = "button_addon_10";
   btnIdNo = btnId.split('_')[2];
   console.log(btnIdNo + " is clicked"); // print 1
   saveUpdatedTaskDetail(taskInputGrp[parseInt(btnIdNo) - 1], btnIdNo);
 });

 $("#button_addon_11").on("click", function() {  
   console.log("<button 11> was clicked");
   btnId = "button_addon_11";
   btnIdNo = btnId.split('_')[2];
   console.log(btnIdNo + " is clicked"); // print 1
   saveUpdatedTaskDetail(taskInputGrp[parseInt(btnIdNo) - 1], btnIdNo);
 });

 $("#button_addon_12").on("click", function() {  
   console.log("<button 12> was clicked");
   btnId = "button_addon_12";
   btnIdNo = btnId.split('_')[2];
   console.log(btnIdNo + " is clicked"); // print 1
   saveUpdatedTaskDetail(taskInputGrp[parseInt(btnIdNo) - 1], btnIdNo);
 });


renderTasksPerCurrentTime();