var btnStartGame = document.getElementById("start-the-quiz");
var globalCounter = 23;
const ITEM_ORDER_PERIOD = ".";
const SPACE = ' ';
const ANS_WRONG = 'Wrong!';
const ANS_RIGHT = 'Correct!';
const FALSE = 'false';
const TRUE = 'true';


var startCountdown;
var quizIdCounter = 0;
var tasks = [];
var reportedScore = 0;

var questionnaireCard = document.getElementById("quiz-questionnaire");
var introCard = document.getElementById("quiz-intro");

var dynamicQuestionSet = document.getElementById("dynamic_question_set"); // div
var answerStatus = document.getElementById("quiz_answer_response"); // h4
//var textQuestion = document.getElementById("question_text"); // div of buttons

var countDownTimer = function(){

   var gameDigitTimerPrint = document.getElementById("digit-timer")
   //globalCounter = 20;
   console.log(globalCounter);
   if(globalCounter.toString().length < 2)
   {
      gameDigitTimerPrint.style.marginLeft = "68%";
      gameDigitTimerPrint.style.marginRight = "0";
      gameDigitTimerPrint.textContent = "Time: " + SPACE + globalCounter;

   }
   else{
      gameDigitTimerPrint.textContent = "Time: " + globalCounter;
   }
   
   globalCounter--;
   if(globalCounter === -1)
   {
      console.log("All done");
      clearInterval(startCountdown); 
   }
};
// -- function countdown is passed in as 1st parameter of the framework setInterval funcion
var startQuizTimer = function(){
   startCountdown = setInterval(countDownTimer, 500); // 500 indicates how fast the counting is
};

btnStartGame.addEventListener("click", function(){
   // var introCard = document.getElementById("quiz-intro");
   introCard.style.display = "none";
   // var questionnaireCard = document.getElementById("quiz-questionnaire");
   questionnaireCard.style.display = "block";
   
   startQuizTimer();
});

/* ////////////////////////////// MIDDLE CONTENT START HERE //////////////////////////////////////*/ 
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
   }
   else{
      answerStatus.textContent = ANS_WRONG;
   }
    
}

// (2)
var createTaskEl = function(quizDataObj) {

//    // testing only
//    console.log(quizDataObj);
//    console.log(quizDataObj.status);
//  
//    // create list item
//    var listItemEl = document.createElement("li");
//    listItemEl.className = "task-item";
//  
//    // add task id as a custom attribute ----------------------------------
//    listItemEl.setAttribute("data-task-id", quizIdCounter);  // passed in global var value
//  
//    // //how to use data-* attributes:
//    // <div class="pet" data-animal="puppy" data-voice="woof" data-task-id="12">Spot</div>
//    // //how to use data-* attributes: ------------------------------------
//  
//    // create div to hold task info and add to list item
//    var taskInfoEl = document.createElement("div");
//    taskInfoEl.className = "task-info";
//  
//    // the h3 will pay a role in searching for the task-name later by passing h3.task-name in to querySelector()
//    taskInfoEl.innerHTML = "<h3 class='task-name'>" + quizDataObj.name + "</h3><span class='task-type'>" + quizDataObj.type + "</span>";
//    listItemEl.appendChild(taskInfoEl);
 
   // // // add button stuff within a task item ///////////////////// OLD WAY ///////////////////
   // var quizActionsEl = createTaskActions(quizIdCounter); //new, call to funcion (3), returned item is a compact item
   // // listItemEl.appendChild(quizActionsEl);

   ///////////////////// NEW WAY ///////////////////
   // numChildren = dynamicQuestionSet.children
   // numChildren.remove;
   // console.log("I have: " + numChildren);
   // for (var j = 1; j <= numChildren; j++)
   // {
   //    dynamicQuestionSet.removeChild();
   // }

   removeAllChildNodes(dynamicQuestionSet);

  // dynamicQuestionSet.removeChild();

   var quizActionsEl = createQuizActionsGeneric(quizIdCounter, quizDataObj);

   console.log(quizActionsEl);     //Test

   dynamicQuestionSet.appendChild(quizActionsEl);

   // // Take care of the status assignment of the task reflect in the task-action 3 dropdown selections
   // switch (quizDataObj.status) {
   //   case BEEN_ASKED_YES:
   //     quizActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
   //     tasksToDoEl.append(listItemEl); // add list item to list
   //     break;
   //   case BEEN_ASKED_NO:
   //     quizActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
   //     tasksInProgressEl.append(listItemEl);
   //     break;
   //   case AT_GAME_OVER:
   //     quizActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
   //     tasksCompletedEl.append(listItemEl);
   //     break;
   //   default:
   //     console.log("Something went wrong!");
   // }
 
   // // Take care of the taskId of the task
   // quizDataObj.id = quizIdCounter;
 
//    // new - array push here - temp storage
//    tasks.push(quizDataObj); //This method adds any content between the parentheses to the end of the specified array.
//  
   // increase task counter for next unique id
   quizIdCounter++;
 
   // saveTasks();
 
};

// (3) Function (3)
var createQuizActionsGeneric  = function(taskId, quizDataObj) {
   var actionContainerEl = document.createElement("div"); //will act as a container for the other elements.

   var textQuestion  = document.createElement("h4"); //will act as a container for the other elements.
   textQuestion.setAttribute("data-task_id", taskId);
   textQuestion.textContent = quizDataObj.quesion;

   actionContainerEl.appendChild(textQuestion);

   for ( var i = 0; i < 4; i++){
      var uniqueBtn = document.createElement("button");
      uniqueBtn.className = "multi_choice_btn";
      uniqueBtn.setAttribute("id", i + "_" + i);
      uniqueBtn.textContent = (i + 1) + ITEM_ORDER_PERIOD + SPACE + quizDataObj.choices[i];
      uniqueBtn.setAttribute("data-task-id", taskId);
      if ((quizDataObj.correctAnsNumber) == (i + 1))
      {
         uniqueBtn.setAttribute("data-ans-value", TRUE);
      }
      else{
         uniqueBtn.setAttribute("data-ans-value", FALSE);
      }

      actionContainerEl.appendChild(uniqueBtn);
   }

   // // After these lines, create two new <button> elements and append them to the <div> by adding the following code:
   // // create edit button
   // var editButtonEl = document.createElement("button");
   // editButtonEl.textContent = "This answer is false - Edit";
   // editButtonEl.className = "multi_choice_btn";
   // editButtonEl.setAttribute("data-task-id", taskId);
   // editButtonEl.setAttribute("data-ans-value", FALSE);
 
//    actionContainerEl.appendChild(editButtonEl);
//  
//    // create delete button
//    var deleteButtonEl = document.createElement("button");
//    deleteButtonEl.textContent = "This answer is false - Delete";
//    deleteButtonEl.className = "multi_choice_btn";
//    deleteButtonEl.setAttribute("data-task-id", taskId);
//    deleteButtonEl.setAttribute("data-ans-value", FALSE);
 
//    actionContainerEl.appendChild(deleteButtonEl);
//  
//     // create answerThird button
//    var answerThirdButtonEl = document.createElement("button");
//    answerThirdButtonEl.textContent = "This answer is TRUE";
//    answerThirdButtonEl.className = "multi_choice_btn";
//    answerThirdButtonEl.setAttribute("data-task-id", taskId);
//    answerThirdButtonEl.setAttribute("data-ans-value", TRUE);
//  
//    actionContainerEl.appendChild(answerThirdButtonEl);

//    // create answerFouth button
//    var answerFouthButtonEl = document.createElement("button");
//    answerFouthButtonEl.textContent = "This answer is false";
//    answerFouthButtonEl.className = "multi_choice_btn";
//    answerFouthButtonEl.setAttribute("data-task-id", taskId);
//    answerFouthButtonEl.setAttribute("data-ans-value", FALSE);
//  
//    actionContainerEl.appendChild(answerFouthButtonEl);
 
   return actionContainerEl;

 };

 var createTaskActions = function(taskId) {
   var actionContainerEl = document.createElement("div"); //will act as a container for the other elements.
   var textQuestion  = document.createElement("h4"); //will act as a container for the other elements.
   textQuestion.setAttribute("data-task_id", taskId);
   textQuestion.textContent = "The condition in an if|else statement is enclosed with ________. "

   actionContainerEl.appendChild(textQuestion);

   // After these lines, create two new <button> elements and append them to the <div> by adding the following code:
   // create edit button
   var editButtonEl = document.createElement("button");
   editButtonEl.textContent = "This answer is false - Edit";
   editButtonEl.className = "multi_choice_btn";
   editButtonEl.setAttribute("data-task-id", taskId);
   editButtonEl.setAttribute("data-ans-value", FALSE);
 
   actionContainerEl.appendChild(editButtonEl);
 
   // create delete button
   var deleteButtonEl = document.createElement("button");
   deleteButtonEl.textContent = "This answer is false - Delete";
   deleteButtonEl.className = "multi_choice_btn";
   deleteButtonEl.setAttribute("data-task-id", taskId);
   deleteButtonEl.setAttribute("data-ans-value", FALSE);
 
   actionContainerEl.appendChild(deleteButtonEl);
 
    // create answerThird button
   var answerThirdButtonEl = document.createElement("button");
   answerThirdButtonEl.textContent = "This answer is TRUE";
   answerThirdButtonEl.className = "multi_choice_btn";
   answerThirdButtonEl.setAttribute("data-task-id", taskId);
   answerThirdButtonEl.setAttribute("data-ans-value", TRUE);
 
   actionContainerEl.appendChild(answerThirdButtonEl);

   // create answerFouth button
   var answerFouthButtonEl = document.createElement("button");
   answerFouthButtonEl.textContent = "This answer is false";
   answerFouthButtonEl.className = "multi_choice_btn";
   answerFouthButtonEl.setAttribute("data-task-id", taskId);
   answerFouthButtonEl.setAttribute("data-ans-value", FALSE);
 
   actionContainerEl.appendChild(answerFouthButtonEl);
 
   return actionContainerEl;

 };

// (4) 
// Even Handler for ecah answer 'button' 
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

      console.log("taskId is: " + taskId);
      console.log("ansVal is: " + ansVal);

      if (ansVal.toString().toLocaleLowerCase() === FALSE.toLocaleLowerCase())
      {
         applyPenalty(taskId, FALSE);
      }
      else{
         
         offerNextQuestion(taskId, TRUE);
      }

      
   } 
   // else if (targetEl.matches(".delete-btn")){  // matches() doesn't find and return an element. Instead, it returns true if the element would be returned
   //   //console.log("you clicked a delete button!");
   //   var taskId = event.target.getAttribute("data-task-id");
   //   applyPenalty(taskId);
   // }

 }; 


 var offerNextQuestion = function(taskId, ansVal){
    quizAnsRespond(ansVal);
    console.log("Will display next question here");
    createTaskEl(quizDataObj_03);
 }

 var applyPenalty = function(taskId, ansVal) {
   // There's no space between the .task-item and the [data-task-id] attribute, which
   // means that both properties must be on the same element li that help define element li
   reportedScore = globalCounter;
   
   
   
   reportedScore -= 10;
   
   console.log ("Score is: " + reportedScore);

   quizAnsRespond(ansVal);
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

// Define then build an array of quizDataObj_02 objects
var quizDataObj_02 = {
   // name: taskNameInput,
   // type: taskTypeInput, 
   beenAsked: false,
   quesion: "The condition in an if|else statement is enclosed with ________. ",
   choices: ['Answer A', 'Answer B', 'Answer C', 'Answer D'],
   correctAnsNumber: 2
   // choice01: "1. Answer A ",
   // choice02: "2. Answer B ",
   // choice03: "3. Answer C ",
   // choice04: "4. Answer D "

 };

 var quizDataObj_03 = {
   beenAsked: false,
   quesion: "How many arguments does getAttribut require?",
   choices: ['Answer K', 'Answer M', 'Answer N', 'Answer P'],
   correctAnsNumber: 3

 };


createTaskEl(quizDataObj_02);

 