
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

function checkScheduleItemColor(multiCssClass){
   for(var i = 0; i < bootstrapBgColors.length; i++)
   {
      console.log(bootstrapBgColors[i].trim() + " extracted inside for loop");
      if(multiCssClass.includes(bootstrapBgColors[i].trim())) // if found
      {
         // console.log(multiCssClass.includes(bootstrapBgColors[i].trim()) + "  | value true for false"); 
         return bootstrapBgColors[i]; // don't care what color it is, just return it to me
      }
   }
}

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

