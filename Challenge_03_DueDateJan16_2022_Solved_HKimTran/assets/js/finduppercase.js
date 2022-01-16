const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
const EMPTY_STRING = '';
const LINE_BREAK = '\r\n';
const DOUBLE_LINE_BREAK = '\r\n\r\n';

var uppercaseLetters = lowercaseLetters.toString().toUpperCase();

var allIndividualUppercase = [];
allIndividualUppercase =  uppercaseLetters.split(EMPTY_STRING);

var pwResult = document.getElementById("password");
pwResult.textContent = "What is this";

// pwResult.textContent += lowercaseLetters.length.toString()  + LINE_BREAK 
//                         + lowercaseLetters + LINE_BREAK 
//                         + lowercaseLetters[2].toString();

pwResult.textContent += LINE_BREAK + allIndividualUppercase.length.toString()  + LINE_BREAK 
                        + allIndividualUppercase + LINE_BREAK 
                        + allIndividualUppercase[2].toString() + LINE_BREAK ;

//  ">6w;H.+t8-=p3";
var existedUppercase = function(pw){
   console.log(pw);
   console.log(pw.length);
   var found = false;
   for(var j = 0; j < allIndividualUppercase.length; j++)
   { 
      for(var i = 0; i < pw.length; i++)
      {
         //console.log(i);
         //console.log(pw[i]);
         if(allIndividualUppercase[j] === pw[i]){
            console.log(pw[i] + " is an uppercase letter" );
            found = true;
         }
      }
   }
   console.log(found);
   return found;
 }

 var existedLowercase = function(pw){
   
   console.log(pw);
   console.log(pw.length);
   var found = false;
   for(var j = 0; j < lowercaseLetters.length; j++)
   { 
      for(var i = 0; i < pw.length; i++)
      {
         //console.log(i);
         //console.log(pw[i]);
         if(lowercaseLetters[j] === pw[i]){
            console.log(pw[i] + " is an lowercase letter" );
            found = true;
         }
      }
   }
   console.log(found);
   return found;
 }


var implementSpec = function(){
   var generatedPassword = ">6w;u.+t8-=p3"; //">6W;U.+T8-=P3"; //">6w;U.+t8-=p3";
   pwResult.textContent += generatedPassword + LINE_BREAK;
   if(true){
      var found = existedUppercase(generatedPassword);
      console.log("found-uppercase value is: " + found);
      if (found)
      {
         pwResult.textContent += "The generated pw " + generatedPassword + " has at least one uppercase" + DOUBLE_LINE_BREAK;
      } 
      else {
         pwResult.textContent += "The generated pw " + generatedPassword + " has no uppercase" + DOUBLE_LINE_BREAK;
      }
   }
   if(true){
      var found = existedLowercase(generatedPassword);
      console.log("found-lowercase value is: " + found);
      if (found)
      {
         pwResult.textContent += "The generated pw " + generatedPassword + " has at least one lowercase" + DOUBLE_LINE_BREAK;
      } 
      else {
         pwResult.textContent += "The generated pw " + generatedPassword + " has no lowercase" + DOUBLE_LINE_BREAK;
      }
   }

}

implementSpec();