var btnStartGame = document.getElementById("start-the-quiz");
var globalCounter = 26;

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

const FALSE = 'false';
const TRUE = 'true';

var currentHighScore = 0;
var startCountdown;
var quizIdCounter = 0;
var tasks = [];
var scores = [];
var reportedScore = 0;

var currentQuizes = [];   

var questionnaireCard = document.getElementById("quiz-questionnaire");
var introCard = document.getElementById("quiz-intro");

var dynamicQuestionSet = document.getElementById("dynamic_question_set"); // div
var answerStatus = document.getElementById("quiz_answer_response"); // h4

var countDownTimer = function(){
   var gameDigitTimerPrint = document.getElementById("digit-timer") // not a global var
   //globalCounter = 20;
   console.log(globalCounter); // important
   if(globalCounter.toString().length < 2)
   {
      gameDigitTimerPrint.style.marginLeft = "68%";
      gameDigitTimerPrint.style.marginRight = "0";
      gameDigitTimerPrint.textContent = PREFIX_TIMESTAMP + SPACE + globalCounter;

   }
   else{
      gameDigitTimerPrint.textContent = PREFIX_TIMESTAMP + globalCounter;
   }
   
   globalCounter--;
   if(globalCounter === 0)
   {
      console.log("All done");
      clearInterval(startCountdown); 
      globalCounter = 0;
      gameDigitTimerPrint.disabled = true;
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
      console.log(answerStatus.textContent);
   }
   else{
      answerStatus.textContent = ANS_WRONG;
      console.log(answerStatus.textContent);
   }
}

function displayScoresSTAT(reportScoreSTAT){
   highscoreStatPnl = document.querySelector("#highscore_panel")
   if(highscoreStatPnl != null)
   {
      highscoreStatPnl.style.display = "block";
      var highScoreBox = document.getElementById("high_score");
      highScoreBox.textContent = reportScoreSTAT.playerid + HYPHENAGE + reportScoreSTAT.score;
   }

}

function getGameStopTimerDigit(){
   var digitTimer = document.getElementById("digit-timer");

   var timerPrint = digitTimer.textContent;
   //console.log("extract time value: " + timerPrint);

   var gamestopDigit = timerPrint.substring(PREFIX_TIMESTAMP.length, timerPrint.length);
   //console.log("my digit is - print 1: " + gamestopDigit);
   return gamestopDigit;
}
/////////////// end of function declarations /////////////////////////

var saveScoreReport = function(reportDataObj) {
   //localStorage.setItem() saves data to localStorage.
   localStorage.setItem("scores", JSON.stringify(reportDataObj)); // converted the tasks array into a string
 }

 // Loads stuff from localStorage
 var loadScoreReport = function() {
   var savedScores = localStorage.getItem("scores");
   if (!savedScores) {
     return false;
   }
   savedScores = JSON.parse(savedScores); // of type reportDataObj
   console.log(savedScores); // important
   // loop through savedScores array of objects
   for (var i = 0; i < savedScores.length; i++) { // length is one anyway cause we only save the whoever has higher score in session
     // pass each task object into the `createTaskEl()` function
     displayScoresSTAT(savedScores[i]);
   }
 }

var createTaskList = function(currentQuizes){
   for(var j = 0; j < currentQuizes.length; j++)
   {
      createTaskElNoRemoval(currentQuizes[j]);
   }
   
   var quizReportEl = createQuizReportSlide();
   dynamicQuestionSet.appendChild(quizReportEl);

   console.log(dynamicQuestionSet);
   
   // -- the score report slide
   var highScoreStatEl = createScoreSTATslide();
   dynamicQuestionSet.appendChild(highScoreStatEl);
   
}

var createTaskElNoRemoval = function(quizDataObj) {

      // //removeAllChildNodes(dynamicQuestionSet);
   
      // -- Create html stuff for individual multiple-choice question
      var quizActionsEl = createQuizActionsGeneric(quizIdCounter, quizDataObj); // works
   
      console.log(quizActionsEl);     //Test
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
      // finalScore = globalCounter.toString();
      // var formContainerEl = document.createElement("form");
      // formContainerEl.setAttribute("id", "quiz_report_form");
      // formContainerEl.style.display = "none";
   
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
   //finalScore = globalCounter.toString();
   // var formContainerEl = document.createElement("form");
   // formContainerEl.setAttribute("id", "quiz_report_form");
   // formContainerEl.style.display = "none";

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

// (4) 
// Even Handler for eah answer 'button' 
var taskButtonHandler = function(event) {
   // get target element from event. 
   // event.target reports the element on which the event occurs, in this case, the click event.
   // console.log(event.target);
   var targetEl = event.target;
   
   // edit button was clicked
   if (targetEl.matches(".multi_choice_btn")) {  // matches() doesn't find and return an element. Instead, it returns true if the element would be returned
      var taskId = targetEl.getAttribute("data-task-id");
      var ansVal = targetEl.getAttribute("data-ans-value");
      //editTask(taskId);

      //console.log("taskId is: " + taskId);
      console.log("ansVal is: " + ansVal);

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
     collectReportDataForSTATDisplay();
   }
   else if (targetEl.matches(".clear_btn")){   // -- Check on Score Submit button in next slide
      console.log("you clicked a clear highscore button!");
      clearHighScoreSTAT();
   }
   else if (targetEl.matches(".goback_btn")){
      console.log("you clicked a goback button!");
      //console.log("Taskid status: " + taskId);
      goBackToPreviousReportScreen();
   }

 }; 

var goBackToPreviousReportScreen = function(){
   // close current panel
   highscoreStatPnl = document.querySelector("#highscore_panel")
   highscoreStatPnl.style.display = "none";
   // open previous panel
   var slideSelected = document.querySelector("#quiz_report_panel")
   if(!slideSelected){
      console.log("Coudn't find item to go back");
      return false;
   }
   slideSelected.style.display = "block";
}

var clearHighScoreSTAT = function(){
   var highScoreBox = document.getElementById("high_score");
   highScoreBox.value = STRING_EMPTY;
}

// Will also expose the final slide which is the highscore statistics 
var collectReportDataForSTATDisplay = function(){
    var playerInitials = document.getElementById("player_initials");
   //  var playerInitials = document.querySelector("#player_initials");
    if(playerInitials != null)
    {
      initials = playerInitials.value;
      console.log(initials);
      if(!initials)
      {
         alert("Please provide your initials!");
         return false;
      }
    }
     
    var digitTimer = document.getElementById("digit-timer");
   //  if (digitTimer == null)
   //  {
   //     console.log("not found");
   //  }
    var timerPrint = digitTimer.textContent;
    console.log("extract time value: " + timerPrint);

    var gamestopDigit = timerPrint.substring(PREFIX_TIMESTAMP.length, timerPrint.length);
    console.log("my digit is - print 1: " + gamestopDigit);
   
    var reportHighScoreDataObj = {
      playerid: initials,
      score: gamestopDigit
      };

   highscoreStatPnl = document.querySelector("#highscore_panel")
   if(highscoreStatPnl != null)
   {
      highscoreStatPnl.style.display = "block";
      var highScoreBox = document.getElementById("high_score");
      highScoreBox.value = reportHighScoreDataObj.playerid + HYPHENAGE + reportHighScoreDataObj.score;
      if (currentHighScore < reportHighScoreDataObj.playerid)
      {
         currentHighScore = reportHighScoreDataObj.playerid;
         saveScoreReport(reportHighScoreDataObj);
      }
      // console.log("my digit is - print 2: " +  highScoreBox.value.toString() );
   }

   var slideSelected = document.querySelector("#quiz_report_panel")
   slideSelected.style.display = "none"; // close itself

   // -- close couple other things
   var separator = document.getElementById("slide_divider");
   separator.style.display = "none";
   var ans_reponse = response = document.getElementById("quiz_answer_response")
   ans_reponse.style.display = "none";
 }

 // This function display next slide of question
 var offerNextQuestion = function(taskId, ansVal){
   console.log("You're in offerNextQuestion function scope")
   console.log(taskId);
   console.log(ansVal);

   quizAnsRespond(ansVal);

   var nextQuestinId = parseInt(taskId) + 1; //console.log(nextQuestinId);
   var taskSelected = document.querySelector("div[data-task-id='" + taskId + "']");   
   var taskSelectedNext = document.querySelector("div[data-task-id='" + nextQuestinId + "']");   

   taskSelected.style.display = "none"; // I'm closing myself before opening the next slide
   // console.log(taskSelected); // important
   
// //    if(taskSelectedNext != null){
// //       taskSelectedNext.style.display = "block";
// //    }
// //    else{
// //       // -- when done taking the entire quizes
// //       console.log("Game Over");
// // 
// //       // -- Looking for quiz report panel
// //       reportPnl = document.querySelector("#quiz_report_panel");
// //       reportPnl.style.display = "block";
// //    }
   
   // console.log(taskSelectedNext); // important

   var tasklistSelected = document.querySelector("#dynamic_question_set");   // testing only
   console.log((tasklistSelected));

   console.log("End of offerNextQuestion function scope")
   //createTaskEl(quizDataObj_03);

   if(globalCounter === 0)
   {
      console.log("All done - in applyPenalty function");
      clearInterval(startCountdown); 
      globalCounter = 0;

       // -- Looking for quiz report panel to make it visible
       reportPnl = document.querySelector("#quiz_report_panel");
       if(reportPnl != null)
       {
          reportPnl.style.display = "block";
       }
   }
   else // if clock has not yet reached Zero 
   {
      if(taskSelectedNext != null){
         taskSelectedNext.style.display = "block";
      }
      else{
         // -- when done taking the entire quizes
         console.log("Game Over");
         clearInterval(startCountdown); 
         var gameDigitTimerPrint = document.getElementById("digit-timer") 
         gameDigitTimerPrint.disabled = true;
         console.log("Game Over and Clock should stop");
         // -- Looking for quiz report panel to make it visible
         reportPnl = document.querySelector("#quiz_report_panel");
         if(reportPnl != null)
         {
            // -- display the score line per timer-stoppage
            var finalScorePrint = document.querySelector("h5[data-finalscore-print]");
            stoppedDigit = getGameStopTimerDigit();
            finalScorePrint.textContent += stoppedDigit;
            reportPnl.style.display = "block";
         }
           
      }
   }

 }

 var applyPenalty = function(taskId, ansVal) {

   quizAnsRespond(ansVal);

   var nextQuestinId = parseInt(taskId) + 1; //console.log(nextQuestinId);
   var taskSelected = document.querySelector("div[data-task-id='" + taskId + "']");
   var taskSelectedNext = document.querySelector("div[data-task-id='" + nextQuestinId + "']");  
   taskSelected.style.display = "none";
   taskSelectedNext.style.display = "block";

   if(taskSelectedNext != null){
      taskSelectedNext.style.display = "block";
   }
   else{
      console.log("Game Over");
   }

   // reportedScore = globalCounter;
   // reportedScore -= 10;
   // globalCounter = reportedScore;
   // console.log ("Score is: " + reportedScore);

   globalCounter -= 10;
   
   if(globalCounter === 0)
   {
      console.log("All done - in applyPenalty function");
      clearInterval(startCountdown); 
      globalCounter = 0;

       // -- Looking for quiz report panel to make it visible
       reportPnl = document.querySelector("#quiz_report_panel");
       if(reportPnl != null)
       {
          reportPnl.style.display = "block";
       }
   }

   // quizAnsRespond(ansVal);
   // <button class="multi_choice_btn" data-task-id="0" data-ans-value="false">This answer is false - Delete</button>
   //var taskSelected = document.querySelector(".multi_choice_btn[data-ans-value='" + ansVal + "']"); // this works, item is found
   // taskSelected.remove(); // test remove only - do not use


   //display next questionnaire

//    //console.log(taskSelected);
//  
//    // create new array to hold updated list of tasks
//    var updatedTaskArr = [];
//  
//    // loop through current tasks
//    for (var i = 0; i < tasks.length; i++) {
//      // if tasks[i].id does NOT match the value of taskId, let's keep that task and push it into the new array
//      if (tasks[i].id !== parseInt(taskId)) {
//        updatedTaskArr.push(tasks[i]);
//      }
//    }
//  
//    // reassign tasks array to be the same as updatedTaskArr
//    tasks = updatedTaskArr; //need to keep the tasks array variable up-to-date at all times
//    saveTasks();

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

//  var quizDataObj_11 = {
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
// 
// currentQuizes.push(quizDataObj_07);
// currentQuizes.push(quizDataObj_08);
// // currentQuizes.push(quizDataObj_09);
// currentQuizes.push(quizDataObj_10);
// currentQuizes.push(quizDataObj_11);
// currentQuizes.push(quizDataObj_12);
// currentQuizes.push(quizDataObj_13);
// currentQuizes.push(quizDataObj_14);
// currentQuizes.push(quizDataObj_15);
// currentQuizes.push(quizDataObj_16);
// currentQuizes.push(quizDataObj_16);
// currentQuizes.push(quizDataObj_18);
// currentQuizes.push(quizDataObj_19);

//createTaskEl(quizDataObj_00);

createTaskList(currentQuizes);
 

 