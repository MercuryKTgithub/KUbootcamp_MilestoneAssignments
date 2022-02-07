/* Quiz has 12 questions but can be deleted or expanded to your liking. Please see bottom */
const CHOICE_SML_LEN = 20;
const CHOICE_WIDTH_PASS_SML_LEN = "35%";
const CHOICE_WIDTH_MIDLEN = 40;
const CHOICE_WIDTH_PASS_MIDLEN = "80%";
const ITEM_ORDER_PERIOD = ".";
const HYPHENAGE = ' - '
const SPACE = ' ';
const STRING_EMPTY = '';
const ANS_WRONG = 'Wrong!';
const ANS_RIGHT = 'Correct!';
const QUIZ_END_SIGNAL = "All done!"
const SCORE_REPORT_LINE = "Your final score is: ";
const INITIALS_INVITE = "Enter initials: ";
const SUBMIT_BTN_FACE = "Submit";
const PREFIX_TIMESTAMP = "Time: ";
const ZERO = -1;

const FALSE = 'false';
const TRUE = 'true';

var btnStartGame = document.getElementById("start-the-quiz");
var globalCounter = 95; // how many seconds there are
var globalJumpedOffSlideId = STRING_EMPTY;

var currentHighScore = 0;
var startCountdown;
var quizIdCounter = 0;
 
var reportedScore = 0;

var currentQuizes = [];   

var questionnaireCard = document.getElementById("quiz-questionnaire");
var introCard = document.getElementById("quiz-intro");

var dynamicQuestionSet = document.getElementById("dynamic_question_set"); // div
var answerStatus = document.getElementById("quiz_answer_response"); // h4
//var gameDigitTimerPrint = null;

// -- Clock is counting down 
var countDownTimer = function(){
     var gameDigitTimerPrint = document.getElementById("digit-timer") // not a global var
   //globalCounter = 20;
   console.log("globalCounter in countDownTime is: " + globalCounter); // important
   if(globalCounter.toString().length < 2)
   {
      gameDigitTimerPrint.style.marginLeft = "68%";
      gameDigitTimerPrint.style.marginRight = "0";
      gameDigitTimerPrint.textContent = PREFIX_TIMESTAMP + SPACE + globalCounter; // add prefix Time: 

   }
   else{
      gameDigitTimerPrint.textContent = PREFIX_TIMESTAMP + globalCounter;
   }
   
   globalCounter--;
   if(globalCounter == ZERO)
   {
      console.log("Time has reached zero. Print inside countDownTimer()");
      clearInterval(startCountdown); 
      // globalCounter = 0;
      gameDigitTimerPrint.disabled = true; //disable the clock when 0
   }
};
// -- function countdown is passed in as 1st parameter of the framework setInterval funcion
var startQuizTimer = function(){
   startCountdown = setInterval(countDownTimer, 1000); // 500 indicates how fast the counting is
};

btnStartGame.addEventListener("click", function(){
   // var introCard = document.getElementById("quiz-intro");
   introCard.style.display = "none";
   // var questionnaireCard = document.getElementById("quiz-questionnaire");
   questionnaireCard.style.display = "block";
   
   startQuizTimer();
});

/* ////////////////////////////// MIDDLE CONTENT FOR DISPLAY QUIZ QUESTIONS STARTS HERE //////////////////////////////////////*/ 
function removeAllChildNodes(parent) {
   while (parent.firstChild) {
       parent.removeChild(parent.firstChild);
   }
   
}

function quizAnsRespond(status){
   answerStatus.textContent = SPACE;
   if (status === TRUE)
   {
      answerStatus.textContent = ANS_RIGHT;
      // console.log(answerStatus.textContent);
   }
   else{
      answerStatus.textContent = ANS_WRONG;
      // console.log(answerStatus.textContent);
   }
}

function displayScoresSTAT(reportScoreSTAT){
   highscoreStatPnl = document.querySelector("#highscore_panel")
   deactivateViewHighScoreInSTAT()
   highscoreStatPnl.style.display = "block";
   var highScoreBox = document.getElementById("high_score");
   highScoreBox.textContent = reportScoreSTAT.playerid + HYPHENAGE + reportScoreSTAT.score;
   // if(highscoreStatPnl != null)
   // {
   //    deactivateViewHighScoreInSTAT()
   //    highscoreStatPnl.style.display = "block";
   //    var highScoreBox = document.getElementById("high_score");
   //    highScoreBox.textContent = reportScoreSTAT.playerid + HYPHENAGE + reportScoreSTAT.score;
   // }

}

function getGameStopTimerDigit(){
   var digitTimer = document.getElementById("digit-timer");
   // if (!digitTimer.disabled){
   //    return STRING_EMPTY;
   // }
   var timerPrint = digitTimer.textContent;
   console.log("extract time value in func getGameStopTimerDigit: " + timerPrint);

   var gamestopDigit = timerPrint.substring(PREFIX_TIMESTAMP.length, timerPrint.length);
   //console.log("my digit is - print 1: " + gamestopDigit);
   return gamestopDigit;
}

function searchForUniqueDivDisplayedAsBlock(){
   var taskIdOfFoundDiv = STRING_EMPTY;
   var divs = document.getElementsByTagName("div");
   // Loop thru the collection of div elements
   for(var i = 0; i < divs.length; i++){
      //scan for the div that got rendered as block
      var display = divs[i].style.display
      if(display.toString() == "block"){
         //console.log("I found the block div!")
         var locatedDiv = divs[i];
         taskIdOfFoundDiv = locatedDiv.getAttribute("data-task-id");
         if (taskIdOfFoundDiv != null){
            //console.log("Its taskId here is: " + taskIdOfFoundDiv)
            return taskIdOfFoundDiv;
         }
      }
   }
}

function redirectViewHighScoreInSTAT()
{
   var btnViewHighScore = document.getElementById("view-score-after");
   // you are at the the report for the score already
   btnViewHighScore.setAttribute("title", "Please click submit button to view score statistics instead");
   btnViewHighScore.disabled = true; 
   btnViewHighScore.setAttribute("cursor", "none");
}

function deactivateViewHighScoreInSTAT()
{
   var btnViewHighScore = document.getElementById("view-score-after");
   // you are at the the report for the score already
   btnViewHighScore.setAttribute("title", "You're in View High Score screen");
   btnViewHighScore.disabled = true; 
   btnViewHighScore.setAttribute("cursor", "none");
}

function activateViewHighScoreElseWhereButScreenSTAT()
{
   var btnViewHighScore = document.getElementById("view-score-after");
   btnViewHighScore.disabled = false; // not going anywhere when about to get the report
   btnViewHighScore.setAttribute("title", STRING_EMPTY);
}
/////////////// end of function declarations /////////////////////////

var saveScoreReport = function(reportDataObj) {
   //localStorage.setItem() saves data to localStorage.
   localStorage.setItem("scores", JSON.stringify(reportDataObj)); // converted the tasks array into a string
   console.log("Calling from saveScoreReport");
   
}

 // Loads stuff from localStorage
 var loadScoreReport = function() {
   var savedScores = localStorage.getItem("scores");
   if (!savedScores) {
     return false;
   }
   savedScores = JSON.parse(savedScores); // of type reportDataObj
   console.log(savedScores); // important
   return savedScores;
   // // // loop through savedScores array of objects
   // // for (var i = 0; i < savedScores.length; i++) { // length is one anyway cause we only save the whoever has higher score in session
   // //   // pass each task object into the `createTaskEl()` function
   // //   displayScoresSTAT(savedScores[i]);
   // // }
 }

var createTaskList = function(currentQuizes){
   for(var j = 0; j < currentQuizes.length; j++)
   {
      createTaskElNoRemoval(currentQuizes[j]);
   }
   
   var quizReportEl = createQuizReportSlide();
   dynamicQuestionSet.appendChild(quizReportEl);

   console.log(dynamicQuestionSet); //important
   
   // -- the score report slide
   var highScoreStatEl = createScoreSTATslide();
   dynamicQuestionSet.appendChild(highScoreStatEl);
   activateViewHighScoreElseWhereButScreenSTAT();
   
}

var createTaskElNoRemoval = function(quizDataObj) {

      // //removeAllChildNodes(dynamicQuestionSet);
   
      // -- Create html stuff for individual multiple-choice question
      var quizActionsEl = createQuizActionsGeneric(quizIdCounter, quizDataObj); // works
   
      ////console.log(quizActionsEl);     //Test
      // -- append the individual multiple-choice question into its parent node
      dynamicQuestionSet.appendChild(quizActionsEl);

      // // Take care of the taskId of the task
      // quizDataObj.id = quizIdCounter;
    
      // // new - array push here - temp storage
      // tasks.push(quizDataObj); //This method adds any content between the parentheses to the end of the specified array.
      
      // increase task counter for next unique id
      quizIdCounter++;
      // saveTasks();
    
   };

   var createScoreSTATslide = function(){
      var reportScoreContainerEl = document.createElement("div"); 
      reportScoreContainerEl.setAttribute("id", "highscore_panel");
      reportScoreContainerEl.style.display = "none"; //"block"; //"none";
      reportScoreContainerEl.style.marginTop = "6%";
   
      var quizHighScoreSignal  = document.createElement("h5");  
      quizHighScoreSignal.textContent = "High Scores";
   
      // Highscore rendered as disable box
      var highScoreBox = document.createElement("input")
      highScoreBox.setAttribute("id", "high_score");
      highScoreBox.setAttribute("class", "score_row");
      highScoreBox.disabled = true;
   
      // Go back button - left
      var gobackBtn = document.createElement("button");
      gobackBtn.textContent = "Go back";
      gobackBtn.setAttribute("id", "go_back_btn");
      gobackBtn.setAttribute("class", "goback_btn");
      gobackBtn.style.display = "inline-block";
       
      // Clear highscore button - right
      var clearBtn = document.createElement("button");
      clearBtn.textContent = "Clear high scores";
      clearBtn.setAttribute("id", "clear_btn");
      clearBtn.setAttribute("class", "clear_btn");
      clearBtn.style.marginLeft = "2%";
   
      reportScoreContainerEl.appendChild(quizHighScoreSignal);
      reportScoreContainerEl.appendChild(highScoreBox);
      // reportScoreContainerEl.appendChild(highScoreBox2);
      reportScoreContainerEl.appendChild(gobackBtn);
      reportScoreContainerEl.appendChild(clearBtn);
      
      return reportScoreContainerEl;
      // formContainerEl.appendChild(reportContainerEl);
      // return formContainerEl;
   }   
   
// Could be called when last slide of quiz reached    
var createQuizReportSlide = function(){
   activateViewHighScoreElseWhereButScreenSTAT();

   var reportContainerEl = document.createElement("div"); 
   reportContainerEl.setAttribute("id", "quiz_report_panel");
   reportContainerEl.style.display =  "none"; 
   reportContainerEl.style.marginTop = "6%";

   var quizEndSignal  = document.createElement("h5");  
   quizEndSignal.textContent = QUIZ_END_SIGNAL;
   

   var finalScoreReportLine = document.createElement("h5"); 
   // finalScoreReportLine.textContent = SCORE_REPORT_LINE + finalScore; // may extrac value here
   finalScoreReportLine.textContent = SCORE_REPORT_LINE
   finalScoreReportLine.setAttribute("data-finalscore-print", STRING_EMPTY);

   var initialInvite = document.createElement("h5"); 
   initialInvite.textContent = INITIALS_INVITE; 
   initialInvite.style.display = "inline-block";
   initialInvite.style.marginRight = "5px";

   var finalScoreInputBox = document.createElement("input")
   finalScoreInputBox.setAttribute("id", "player_initials");
   finalScoreInputBox.setAttribute("class", "scorebox");

   var submitBtn = document.createElement("button");
   submitBtn.textContent = SUBMIT_BTN_FACE;
   submitBtn.setAttribute("id", "score_submit_btn");
   submitBtn.setAttribute("class", "submit_btn");
   submitBtn.style.display = "inline-block";
   //submitBtn.style.marginLeft = "20px";

   reportContainerEl.appendChild(quizEndSignal);

   reportContainerEl.appendChild(finalScoreReportLine);

   reportContainerEl.appendChild(initialInvite);
   reportContainerEl.appendChild(finalScoreInputBox);
   
   reportContainerEl.appendChild(submitBtn);
   
   return reportContainerEl;
   // formContainerEl.appendChild(reportContainerEl);
   // return formContainerEl;
}

// (3) Function 
// This function will create elements that display the content of the question and also set data attribute value for tracing back its element
var createQuizActionsGeneric  = function(askawayId, quizDataObj) {
   var needExpandBeyondMedWidth = false;
   var smallWidthSuffices = false;
   
   for ( var i = 0; i < 4; i++){
      if(quizDataObj.choices[i].toString().length < CHOICE_SML_LEN){
         smallWidthSuffices = true;
         break;
      }
      if(quizDataObj.choices[i].toString().length > CHOICE_WIDTH_MIDLEN){
         needExpandBeyondMedWidth = true;
         break;
      }
   }

   // -- will act as a container for the other elements.
   var actionContainerEl = document.createElement("div"); 
   actionContainerEl.setAttribute("data-task-id", askawayId);
   
   var textQuestion  = document.createElement("h4");  
   textQuestion.setAttribute("data-task-id", askawayId);
   textQuestion.textContent = quizDataObj.quesion;

   actionContainerEl.appendChild(textQuestion);

   // for display the individual quiz question only
   for ( var i = 0; i < 4; i++){
      var uniqueBtn = document.createElement("button");
      uniqueBtn.className = "multi_choice_btn";
      uniqueBtn.setAttribute("id", i + "_" + askawayId);
      uniqueBtn.textContent = (i + 1) + ITEM_ORDER_PERIOD + SPACE + quizDataObj.choices[i];
      uniqueBtn.setAttribute("data-task-id", askawayId);   

      if ((quizDataObj.correctAnsNumber) == (i + 1)){
         uniqueBtn.setAttribute("data-ans-value", TRUE); 
      }
      else{
         uniqueBtn.setAttribute("data-ans-value", FALSE);
      }

      if(needExpandBeyondMedWidth){
         uniqueBtn.style.width = CHOICE_WIDTH_PASS_MIDLEN;
      }

      if(smallWidthSuffices){
         uniqueBtn.style.width = CHOICE_WIDTH_PASS_SML_LEN;
      }

      actionContainerEl.appendChild(uniqueBtn);
   } // end of for loop

   if(askawayId == 0)
   {
      actionContainerEl.style.display = "block";
   }
   else{
      actionContainerEl.style.display = "none";
      // actionContainerEl.style.display = "block"; // comment out this line for all to be visible | important
       
   }

   return actionContainerEl;

 };

// (4) --------------------------------------------------------------------------------------------------
// Even Handler for eah answer 'button' 
var taskButtonHandler = function(event) {
   // get target element from event. 
   // event.target reports the element on which the event occurs, in this case, the click event.
   // console.log(event.target);
   var targetEl = event.target;
     
   if (targetEl.matches(".multi_choice_btn")) {  // matches() doesn't find and return an element. Instead, it returns true if the element would be returned
      var taskId = targetEl.getAttribute("data-task-id");
      var ansVal = targetEl.getAttribute("data-ans-value");
      //editTask(taskId);

      //console.log("taskId is: " + taskId);
      // // console.log("ansVal is: " + ansVal);

      if (ansVal.toString().toLocaleLowerCase() === FALSE.toLocaleLowerCase())
      {
          applyPenalty(taskId, FALSE);
      }
      // else if (ansVal.toString().toLocaleLowerCase() === TRUE.toLocaleLowerCase()){
      //    offerNextQuestion(taskId, TRUE);
      // }
      else{

         offerNextQuestion(taskId, TRUE);
         // -- Check on Score Submit button in next slide
      }
   } 
   else if (targetEl.matches(".submit_btn")){   // -- Check on Score Submit button in next slide
     console.log("you clicked a submit button!");
     activateViewHighScoreElseWhereButScreenSTAT();
     collectReportDataForSTATDisplay();
   }
   else if (targetEl.matches(".clear_btn")){   // -- Check on Score Submit button in next slide
      console.log("you clicked a clear highscore button!");
      clearHighScoreSTAT();
   }
   else if (targetEl.matches(".goback_btn")){
      console.log("you clicked a goback button!"); 
      activateViewHighScoreElseWhereButScreenSTAT();
      console.log("global taskId not known? : " + globalJumpedOffSlideId);
      if (globalJumpedOffSlideId != STRING_EMPTY){
         //console.log("The previous quiz-div taskId is: " + globalJumpedOffSlideId)
         goBackToAnyPreviousQuizSlide(globalJumpedOffSlideId);
      }   
      else{
         goBackToPreviousReportScreen();
      } 
      
   }
   else if(targetEl.matches(".btn_h6")){
      console.log("You clicked the View High Score link");      
      //var taskId = targetEl.getAttribute("data-task-id"); // you know you're in one of the slides
      //console.log("Can I get taskId here: " + taskId)
      // jumpAtViewScoreSTAT(taskId);
      jumpAtViewScoreSTAT();
   }

 }; 

var jumpAtViewScoreSTAT =  function(){//function(taskId){
   var taskId = searchForUniqueDivDisplayedAsBlock();
   var targetDiv = document.querySelector("div[data-task-id='" + taskId + "']");
   targetDiv.style.display = "none"; // close current slide that is not null at this point
   globalJumpedOffSlideId = taskId;

   collectReportDataForSTATDisplay();

   highscoreStatPnl = document.querySelector("#highscore_panel")
   deactivateViewHighScoreInSTAT();
   highscoreStatPnl.style.display = "block"; // let STAT visible

} 

// This gets called when the Go Back button is clicked, unique case
var goBackToAnyPreviousQuizSlide = function(taskId){
   // close current panel
   highscoreStatPnl = document.querySelector("#highscore_panel")
   highscoreStatPnl.style.display = "none";
   // open previous panel
   var slideSelected = document.querySelector("div[data-task-id='" + taskId + "']");
   if(!slideSelected){
      console.log("Coudn't find quiz div to go back");
      return false;
   }
   slideSelected.style.display = "block";
}

// This takes to the screen "All done! where it has a submit button to store Initials
 var goBackToPreviousReportScreen = function(){
   
   highscoreStatPnl = document.querySelector("#highscore_panel")
   highscoreStatPnl.style.display = "none";// close current panel
   
   var slideSelected = document.querySelector("#quiz_report_panel")
   if(!slideSelected){
      console.log("Coudn't find item to go back");
      return false;
   }
   redirectViewHighScoreInSTAT();
   slideSelected.style.display = "block"; // open previous panel
}

var clearHighScoreSTAT = function(){
   var highScoreBox = document.getElementById("high_score");
   highScoreBox.value = STRING_EMPTY;
}

// -- Will also expose the final slide which is the highscore statistics 
var collectReportDataForSTATDisplay = function(){
    var playerInitials = document.getElementById("player_initials");
    if(playerInitials != null)
    {
      initials = playerInitials.value;
      console.log(initials);
      if(!initials)
      {
         //alert("Please provide your initials!");
         return false;
      }
    }
    
   //  // no good, look at globalCounter instead because deduction could cause neg value on counter
   //  var digitTimer = document.getElementById("digit-timer"); 
   //  var timerPrint = digitTimer.textContent;
   //  var gamestopDigit = timerPrint.substring(PREFIX_TIMESTAMP.length, timerPrint.length);
  
   //  Alternatively
   var finalScorePrint = document.querySelector("h5[data-finalscore-print]").textContent.toString();
   knownScore = finalScorePrint.substring(SCORE_REPORT_LINE.length - 1, finalScorePrint.length);
   
   // var slideSelected = document.querySelector("#quiz_report_panel")
   // slideSelected.style.display = "none"; // close itself

   var liveScoreDataObj = {
      playerid: initials,
      score: parseInt(knownScore)
      };

   highscoreStatPnl = document.querySelector("#highscore_panel")
   highscoreStatPnl.style.display = "block";

   deactivateViewHighScoreInSTAT()

   var reportedDataObj = loadScoreReport();

   // for (var i = 0; i < reportedDataObj.length; i++) { // length is one anyway cause we only save the whoever has higher score in session
   //   // pass each task object into the `createTaskEl()` function
   //   //displayScoresSTAT(reportedDataObj[i]);
   //   console.log(reportedDataObj.score)
   // }

   console.log("Id is: " + reportedDataObj.playerid);
   console.log("Score is: " + reportedDataObj.score);

   /////////////// It is the 1st time the player takes the quiz ////////////////////////
   if ((!reportedDataObj.playerid) || (!reportedDataObj.score))
   {
      saveScoreReport(liveScoreDataObj);

      var slideSelected = document.querySelector("#quiz_report_panel")
      slideSelected.style.display = "none"; // close itself
   
      // -- close out a couple other things
      var separator = document.getElementById("slide_divider");
      separator.style.display = "none";
      var ans_reponse = response = document.getElementById("quiz_answer_response")
      ans_reponse.style.display = "none";

      var highScoreBox = document.getElementById("high_score");
      highScoreBox.value = liveScoreDataObj.playerid + HYPHENAGE + liveScoreDataObj.score;

      return;
   }
   ////////////////////////////////////////////////////////////////////////////////

   // Display purpose only
   var highScoreBox = document.getElementById("high_score");
   var whatInsideBox = liveScoreDataObj.playerid + HYPHENAGE + liveScoreDataObj.score;
   if (!whatInsideBox)
   {
      highScoreBox.value = STRING_EMPTY;
   }
   else{
      highScoreBox.value = liveScoreDataObj.playerid + HYPHENAGE + liveScoreDataObj.score;
   }
   
   console.log(highScoreBox.value);
   
   if (reportedDataObj.score <= liveScoreDataObj.score) // Max number logic  
   {
      currentHighScore = liveScoreDataObj.score; // Update old max value to new max value (greater)
      // -- call out to the saving function that moves data to localStorage
      console.log("Do you come here inside the if-statement");
     
      saveScoreReport(liveScoreDataObj); // check that the greater score has been saved
   }
   console.log("Do you come here after calling saveScoreReport"); 
      // console.log("my digit is - print 2: " +  highScoreBox.value.toString() );
//  }

   var slideSelected = document.querySelector("#quiz_report_panel")
   slideSelected.style.display = "none"; // close itself

   // -- close out couple other things
   var separator = document.getElementById("slide_divider");
   separator.style.display = "none";
   var ans_reponse = response = document.getElementById("quiz_answer_response")
   ans_reponse.style.display = "none";

   // var playerInitials = document.getElementById("player_initials");
   //  if(playerInitials != null)
   //  {
   //    initials = playerInitials.value;
   //    console.log(initials);
   //    if(!initials)
   //    {
   //       alert("Please provide your initials!");
   //       // return false;
   //    }
   //  }
}
//---------------------------------------------------------------------------------------------
 // This function display next slide of question but expect to display the report when
 // 1. time is out
 // 2. final quiz slide has reached
var offerNextQuestion = function(taskId, ansVal){
   console.log("You're in offerNextQuestion function scope")

   quizAnsRespond(ansVal);
   // // var nextQuestinId = 0;
   // // var taskSelectedNext = null; 

   var taskSelected = document.querySelector("div[data-task-id='" + taskId + "']");   
   var nextQuestinId = parseInt(taskId) + 1; //console.log(nextQuestinId);
   var taskSelectedNext = document.querySelector("div[data-task-id='" + nextQuestinId + "']");   

   taskSelected.style.display = "none"; // I'm closing myself before opening the next slide
  
   if(globalCounter <= ZERO ) // if(globalCounter == ZERO)
   {
      console.log("Time ran out before finishing quiz");
      
      clearInterval(startCountdown); // turn off the timer
      var gameDigitTimerPrint = document.getElementById("digit-timer") 
      gameDigitTimerPrint.disabled = true;

       // -- Looking for quiz report panel to make it visible regardless at what quiz slide
       reportPnl = document.querySelector("#quiz_report_panel");
       if(reportPnl != null)
       {
          reportPnl.style.display = "block";
       }
       //globalCounter = 0; // reset global time counter
   }
   else // if clock has not yet reached Zero, render next questionnaire
   {
      if(taskSelectedNext != null){
         taskSelectedNext.style.display = "block";
      }
      else{
         // -- when the last quiz slide is reached expect to see report_panel
         console.log("Finished in offerNextQuestion before Time ran out");
        
//          clearInterval(startCountdown)
// 
//          var gameDigitTimerPrint = document.getElementById("digit-timer") 
//          gameDigitTimerPrint.disabled = false;
//          console.log("All quizes visited - done in offerNextQuestion - Clock should stop with remaining seconds");
//          
         // -- Looking for quiz report panel to make it visible
         reportPnl = document.querySelector("#quiz_report_panel");
         reportPnl.style.display = "block";

         console.log("globalCounter in offerNextQuestion is: " + globalCounter);

         var timerDigit = getGameStopTimerDigit();
         var finalScorePrint = document.querySelector("h5[data-finalscore-print]"); // Your final score is:
         finalScorePrint.textContent += timerDigit;

         // // if(reportPnl != null)
         // // {
         // //    // -- display the score line per timer-stoppage
         // //    var finalScorePrint = document.querySelector("h5[data-finalscore-print]");
         // //    
         // //    finalScorePrint.textContent += globalCounter.toString();
         // //    reportPnl.style.display = "block";
         // // }


         clearInterval(startCountdown); // important to stop clock going down negative
         var gameDigitTimerPrint = document.getElementById("digit-timer") 
         gameDigitTimerPrint.disabled = false;
         console.log("All quizes visited - done in offerNextQuestion - Clock should stop with remaining seconds");
         
      } // end else

      console.log("End of offerNextQuestion function scope")
   }
}

// -------------------------------------------------------------------------------------------
// -- This handle wrong answers scoring and print what expected after that 
var applyPenalty = function(taskId, ansVal) {
   console.log("You're in applyPenalty function scope")

   quizAnsRespond(ansVal);
   
   var taskSelected = document.querySelector("div[data-task-id='" + taskId + "']");
   var nextQuestinId = parseInt(taskId) + 1; //console.log(nextQuestinId);
   var taskSelectedNext = document.querySelector("div[data-task-id='" + nextQuestinId + "']");  
   
   taskSelected.style.display = "none";

   if(globalCounter > 0 )
   {
      globalCounter -= 10;
   }
   
   console.log("Global time in applyPenalty() is at: " + globalCounter);
      
   if(globalCounter <= ZERO + 1) // if(globalCounter == ZERO)
   {
      console.log("Time ran out before finishing quizes - in applyPenalty");
      console.log("global time is: " + globalCounter);
      
      clearInterval(startCountdown); // turn off the timer
      var gameDigitTimerPrint = document.getElementById("digit-timer") ;
      gameDigitTimerPrint.disabled = true;
       // reset global time counter

      // -- Looking for quiz report panel to make it visible regardless at what quiz slide
      reportPnl = document.querySelector("#quiz_report_panel");
      reportPnl.style.display = "block";

      var finalScorePrint = document.querySelector("h5[data-finalscore-print]");
      finalScorePrint.textContent += globalCounter; // Display "Your final score is: "

         //  if(reportPnl != null)
      //  {
      //     reportPnl.style.display = "block";
      //  }
      globalCounter = ZERO;
   }
   else // if clock has not yet reached Zero, render next questionnaire
   {
      if(taskSelectedNext != null){
         taskSelectedNext.style.display = "block";
      }
      else{
         // -- when the last quiz slide is reached expect to see report_panel
         console.log("Finished before Time ran out in applyPenalty()");
        
//          clearInterval(startCountdown); // important
// 
//          var gameDigitTimerPrint = document.getElementById("digit-timer") 
//          gameDigitTimerPrint.disabled = false;
         console.log("All quizes visited - Done - Clock should stop with remaining seconds");
         
         // -- Looking for quiz report panel to make it visible
         reportPnl = document.querySelector("#quiz_report_panel");
         reportPnl.style.display = "block";
         if(reportPnl != null)
         {
            // -- display the score line per timer-stoppage
            var finalScorePrint = document.querySelector("h5[data-finalscore-print]");

            finalScorePrint.textContent += globalCounter.toString();
            reportPnl.style.display = "block";
         }
         clearInterval(startCountdown); // important

         var gameDigitTimerPrint = document.getElementById("digit-timer") 
         gameDigitTimerPrint.disabled = false;
      } // end nested else

      console.log("End of applyPenalty function scope")
   } // end outer else

   

// ///saveScore();
 
 };
 
questionnaireCard.addEventListener("click", taskButtonHandler);

// Define then build an array of quizDataObj
var quizDataObj_00 = {
    
   beenAsked: false,
   quesion: "To insert a JavaScript into an HTML page, which tag is used?",
   choices: ['<script="java">', '<javascript>', '<script>', '<js>'],
   correctAnsNumber: 3
    
 };

 var quizDataObj_01 = {
    
   beenAsked: false,
   quesion: "Browsers that do not understand Javascript _______",
   choices: ['ignore all tags <script> and <noscript>', 
   'display the content of the tags <script>', 
   'display the content of the tags <script> and <noscript>',
   'display the content of the tags <noscript>' ],
   correctAnsNumber: 4
    
 };

 var quizDataObj_02 = {
    
   beenAsked: false,
   quesion: "What is the correct file extension for Javascript files?",
   choices: ['.java', '.js', '.javascript', '.script'],
   correctAnsNumber: 2
    
 };

 var quizDataObj_03 = {
    
   beenAsked: false,
   quesion: "Which of the following is correct to write 'Hello World' on the web page?",
   choices: ['System.out.println("Hello World")', 'print("Hello World")', 'document.write("Hello World")', 'response.write("Hello World")'],
   correctAnsNumber: 3
 };

 
 var quizDataObj_04 = {
    
   beenAsked: false,
   quesion: "Which of the following is true about variable naming conventions in JavaScript?",
   choices: ["JavaScript variable names must begin with a letter, an underscore '_' character or a dollar sign '$' ", 
   'JavaScript variable names are case sensitive', 
   'Both of the above', 
   'None of the above'],
   correctAnsNumber: 3
 };

 
 var quizDataObj_05 = {
    
   beenAsked: false,
   quesion: "Which of the following statements will show a message as well as ask for user input in a popup?",
   choices: ['alert()', 'prompt()', 'confirm()', 'message()'],
   correctAnsNumber: 2
 };

 
 var quizDataObj_06 = {
    
   beenAsked: false,
   quesion: "Which are the correct if-statements to execute certain code if 'x' is equal to 2?",
   choices: ['if(x == 2)', 'if(x 2)', 'if(x != 2 )', 'if(x = 2)'],
   correctAnsNumber: 1
 };


 var quizDataObj_07 = {
   // name: taskNameInput,
   // type: taskTypeInput, 
   beenAsked: false,
   quesion: "The condition in an if|else statement is enclosed with ________. ",
   choices: ['Quotes', 'Curly brackets', 'Parentheses', 'Square brackets'],
   correctAnsNumber: 2

 };

 
 var quizDataObj_08 = {
    
   beenAsked: false,
   quesion: "Which method will you use to round the number 24.76 to the nearest integer?",
   choices: ['round(24.76);', 'rnd(24.76);', 'Math.rnd(24.76);', 'Math.round(24.76);'],
   correctAnsNumber: 4
 };

var quizDataObj_09 = {
   beenAsked: false,
   quesion: "If the value of x is 40, then what is the output of the following program? </br> (x % 10 == 0)? console.log('Divisible by 10') : console.log('Not divisible by 10');",
   choices: ['ReferenceError', 'Divisible by 10', 'Not divisible by 10', 'None of the above'],
   correctAnsNumber: 2
 };

 var quizDataObj_10 = {
   beenAsked: false,
   quesion: "Which of the following is an event listener in JavaScript?",
   choices: ['onclick', 'blur', 'click', 'Click()'],
   correctAnsNumber: 3

 };

 var quizDataObj_11 = {
   beenAsked: false,
   quesion: "What is the syntax of a 'for' statement in JavaScript?",
   choices: ['for(increment; condition; initialization)', 
   'for(initialization, condition, increment)', 
   'for(condition; initialization; increment)', 
   'for(initialization; condition; increment)'],
   correctAnsNumber: 3

 };

 var quizDataObj_12 = {
   beenAsked: false,
   quesion: "Which method returns the character at the specified index?",
   choices: ['charAt()', 'getCharAt()', 'characterAt()', 'None of the above'],
   correctAnsNumber: 1

 };


 var quizDataObj_13 = {
   beenAsked: false,
   quesion: "Which of the following is not a mouse event? ",
   choices: ['onmousemove', 'onmouseover', 'onclick', 'onmousescroller'],
   correctAnsNumber: 4

 };


 var quizDataObj_14 = {
   beenAsked: false,
   quesion: "The opposite of onmouseover is_____?",
   choices: ['onmouseoff', 'onmouseout', 'onmouseunder', 'onnotmouseover'],
   correctAnsNumber: 2

 };

 var quizDataObj_15 = {
   beenAsked: false,
   quesion: "Which of the following function of String object returns the characters in a string beginning at the specified location through the specified number of characters?",
   choices: ['slice()', 'split()', 'substr()', 'search()'],
   correctAnsNumber: 3

 };

 var quizDataObj_16 = {
   beenAsked: false,
   quesion: "Which of the following function of String object causes a string to be displayed in the specified size as if it were in a <font size = 'size'> tag?",
   choices: ['fixed()', 'fontcolor()', 'fontsize()', 'bold()'],
   correctAnsNumber: 3

 };

  var quizDataObj_17 = {
   beenAsked: false,
   quesion: "Which of the following function of String object returns the primitive value of the specified object?",
   choices: ['toLocaleUpperCase()', 'toUpperCase()', 'toString()', 'valueOf()'],
   correctAnsNumber: 4

 };

  var quizDataObj_18 = {
   beenAsked: false,
   quesion: "Which of the following function of Array object returns the first (least) index of an element within the array equal to the specified value, or -1 if none is found?",
   choices: ['indexOf()', 'join()', 'lastIndexOf()', 'map()'],
   correctAnsNumber: 1

 };

  var quizDataObj_19 = {
   beenAsked: false,
   quesion: "How to know the number of elements of a form?",
   choices: ['document.myform.elements.count', 'document.myform.length', 
   'document.myform.count', 'document.myform.elements.length'],
   correctAnsNumber: 4

 };

//  var quizDataObj_20 = {
//    beenAsked: false,
//    quesion: "Which",
//    choices: ['onclick', '123', 'def', 'abc'],
//    correctAnsNumber: 3
// 
//  };

currentQuizes.push(quizDataObj_00);
currentQuizes.push(quizDataObj_01);
currentQuizes.push(quizDataObj_02);
currentQuizes.push(quizDataObj_03);
currentQuizes.push(quizDataObj_04);
currentQuizes.push(quizDataObj_05);
currentQuizes.push(quizDataObj_06);
currentQuizes.push(quizDataObj_07);
currentQuizes.push(quizDataObj_08);
// currentQuizes.push(quizDataObj_09);
currentQuizes.push(quizDataObj_10);
currentQuizes.push(quizDataObj_11);
currentQuizes.push(quizDataObj_12);
// currentQuizes.push(quizDataObj_13);
// currentQuizes.push(quizDataObj_14);
// currentQuizes.push(quizDataObj_15);
// currentQuizes.push(quizDataObj_16);
// currentQuizes.push(quizDataObj_16);
// currentQuizes.push(quizDataObj_18);
// currentQuizes.push(quizDataObj_19);

createTaskList(currentQuizes);
 

 