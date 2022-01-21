// var counter = 10
// var countdown = function(){
//    console.log(counter);
//    counter--;
//    if(counter === 0)
//    {
//       console.log("blastoff");
//    };
// };
//var gameDigitTimerPrint = document.getElementById("digit-timer")
var btnStartGame = document.getElementById("start-the-quiz");
var globalCounter = 3;
const SPACE = ' '
var countDownTimer = function(){

   var gameDigitTimerPrint = document.getElementById("digit-timer")
   //globalCounter = 20;
   console.log(globalCounter);
   if(globalCounter.toString().length < 2)
   {
      gameDigitTimerPrint.style.marginLeft = "68%";
      gameDigitTimerPrint.style.marginRight = "0";
      gameDigitTimerPrint.textContent = "Time: " + globalCounter;

   }
   else{
      gameDigitTimerPrint.textContent = "Time: " + globalCounter;
   }
   
   globalCounter--;
   if(globalCounter === -1)
   {
      // gameDigitTimerPrint.style.marginLeft = "68%";
      // gameDigitTimerPrint.style.marginRight = "5px";
      //gameDigitTimerPrint.textContent = "Time: 00" ;
      console.log("All done");
      // just make a call to handler clearInterval and
      // let it make the coundown stop when 0 reached.
      // otherwise, keeps counting down to negative
      clearInterval(startCountdown); 
   }
};

// -- user function countdown is passed in as 1st parameter of the 
// -- framework setInterval funcion
// var startCountdown = setInterval(countDownTimer, 500); // 500 indicates how fast the counting is

var startCountdown;
var startQuizTimer = function(){
   startCountdown = setInterval(countDownTimer, 1000); // 500 indicates how fast the counting is
};

btnStartGame.addEventListener("click", function(){
   var introCard = document.getElementById("quiz-intro");
   introCard.style.display = "none";
   var questionCard = document.getElementById("question");
   questionCard.style.display = "block";
   
   startQuizTimer();
});
